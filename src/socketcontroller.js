

peers = {};

players = {};

module.exports = (io) => {
    io.on('connect', (socket) => {
        console.log('a client is connected')

        
        // Initiate the connection process as soon as the client connects

        peers[socket.id] = socket
        
        // create new player and add him to players
        players[socket.id] = {
            rotation: 0,
            x: Math.floor(Math.random() * 300) + 500,
            y: Math.floor(Math.random() * 100) + 500,
            playerId: socket.id,
            team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue',
            account: "player"
        };

        console.log(players[socket.id]);
        socket.emit('currentPlayers', players);
        
        // update all other players of the new player
        socket.broadcast.emit('newPlayer', players[socket.id]);

        // when a player moves, update the player data
        socket.on('playerMovement', function (movementData) {
            players[socket.id].x = movementData.x;
            players[socket.id].y = movementData.y;
            players[socket.id].rotation = movementData.rotation;
            // emit a message to all players about the player that moved
            socket.broadcast.emit('playerMoved', players[socket.id]);
        });

        // ADDING VOICE PART
        socket.on("voice", function (data) {
            var newData = data.split(";");
            newData[0] = "data:audio/ogg;";
            newData = newData[0] + newData[1];
            for (const id in socketsStatus) {
            if (id != socketId)
                socket.broadcast.to(id).emit("send", newData);
            }
        });
        
        socket.on("userInformation", function (data) {
            socketsStatus[socketId] = data;
            io.sockets.emit("usersUpdate",socketsStatus);
        });



        // Asking all other clients to setup the peer connection receiver
        for(let id in peers) {
            if(id === socket.id) continue
            console.log('sending init receive to ' + socket.id)
            peers[id].emit('initReceive', socket.id)
        }

        /**
         * relay a peerconnection signal to a specific socket
         */
        socket.on('signal', data => {
            if(!peers[data.socket_id])return
            peers[data.socket_id].emit('signal', {
                socket_id: socket.id,
                signal: data.signal
            })
        });

        /**
         * remove the disconnected peer connection from all other connected clients
         */
         socket.on('disconnect', async function () {
            console.log('user disconnected: ', socket.id);
            delete players[socket.id];
            // emit a message to all players to remove this player
            io.emit('disconnected', socket.id);
          });

        /**
         * Send message to client to initiate a connection
         * The sender has already setup a peer connection receiver
         */
        socket.on('initSend', init_socket_id => {
            console.log('INIT SEND by ' + socket.id + ' for ' + init_socket_id)
            peers[init_socket_id].emit('initSend', socket.id)
        });
    });
};