const nicknames = require("./data/nicknames");


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
            microphoneStatus: false,
            playerName: nicknames[Math.floor(Math.random() * nicknames.length)], 
            textureId: Math.floor(Math.random() * 4),
        };

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


        socket.on('updatePlayerInfo', (data, socket_id) => {
            if (data.microphoneStatus)  players[socket_id].microphoneStatus = data.microphoneStatus;
            socket.broadcast.emit('updatePlayerInfo', players[socket_id]);
        })
        


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
            delete peers[socket.id];
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