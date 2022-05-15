const { join, filter, values } = require("./data/nicknames");
const playerController = require("./playerController");
const supabase = require('./supabase/supabase.js');
const monstersInfo = require("./data/MMORPG/monsters");
const mapTowers = require("./data/MMORPG/mapTowers");
const mapsStartPoints = require("./data/mapsStartPoints");


// peers for voice chat
peers = {};

// main players
players = {};

// for players who should have only one voice chat
hashChats = [];

// current rooms
rooms = {};

// monsters
monstersList = {};


module.exports = (io) => {
    io.on('connect', (socket) => {
        // Initiate the connection process as soon as the client connects

        peers[socket.id] = socket

        socket.on('initializePlayer', (address, planet, firstEntrance) => {
            // playerController.addPlayer(io, socket, players, address, planet, {}, rooms, firstEntrance, null);
            // return;
            supabase.getPlayerData(address).then(result => {
                var data = result.data;
                if (data && !data.length) {
                    supabase.createPlayer(address).then(result => {
                        playerController.addPlayer(io, socket, players, address, planet, {}, rooms, firstEntrance, result.data);
                    })
                } else {
                    if (data) data = data[0];
                    if (data && data.planet != planet) data = null;
                    playerController.addPlayer(io, socket, players, address, planet, {}, rooms, firstEntrance, data);
                }
            })
        })
        // create new player and add him to players
        socket.on('addPlayer', (address, planet, playerInfo) => {
            console.log(address);
            playerController.addPlayer(io, socket, players, address, planet, playerInfo, rooms, false, null);
            supabase.getPlayerData(players[socket.id]);
        });


        socket.on('connectToOtherRoom', (mapId) => {
            // disconnect from previous room
            for (let i = 0; i < rooms[players[socket.id].room].length; i++) {
                if (rooms[players[socket.id].room][i] == socket.id) {
                    console.log("removing from room", rooms[players[socket.id].room][i]);
                    rooms[players[socket.id].room].splice(i, 1);
                }
            }

            // updatePlayerInfo in database
            supabase.updatePlayerInfo(players[socket.id]);

            socket.to(players[socket.id].room).emit('disconnected', socket.id);

            socket.leave(players[socket.id].room);

            // connect to other room
            const previousMap = players[socket.id].mapId;
            const room = players[socket.id].planet + '$' + mapId;
            socket.join(room);
            players[socket.id].room = room;
            players[socket.id].mapId = mapId;

            console.log("TRYING TO CONNECT TO MAP " + mapId + " FROM " + previousMap);
            
            var x = mapsStartPoints[mapId][0].x;
            var y = mapsStartPoints[mapId][0].y;
            
            if (mapsStartPoints[mapId][previousMap]) {
                x = mapsStartPoints[mapId][previousMap].x;
                y = mapsStartPoints[mapId][previousMap].y;
            }

            players[socket.id].x = x;
            players[socket.id].y = y;
            
            playerController.connectToRoom(socket, players, rooms, false);

            
        })

        // when a player moves, update the player data
        socket.on('playerMovement', function (movementData) {
            players[socket.id].x = movementData.x;
            players[socket.id].y = movementData.y;
            players[socket.id].rotation = movementData.rotation;
            // emit a message to all players about the player that moved
            socket.to(players[socket.id].room).emit('playerMoved', players[socket.id]);
        });


        socket.on('updatePlayerInfo', (data, socket_id) => {
            if (data.microphoneStatus != null) players[socket_id].microphoneStatus = data.microphoneStatus;
            if (data.playerName != null) players[socket_id].playerName = data.playerName;
            if (data.nft != null) players[socket_id].nft = data.nft;
            if (data.textureId) players[socket_id].textureId = data.textureId;
            if (data.deafen != null) players[socket_id].deafen = data.deafen;
            io.to(players[socket.id].room).emit('updatePlayerInfo', players[socket_id]);
        })


        /**
         * relay a peerconnection signal to a specific socket
         */
        socket.on('signal', data => {
            if (!peers[data.socket_id]) return
            peers[data.socket_id].emit('signal', {
                socket_id: socket.id,
                signal: data.signal
            })
        });

        /**
         * remove the disconnected peer connection from all other connected clients
         */
        socket.on('disconnect', async function () {
            // remove from ojbect rooms 
            if (!players[socket.id]) return;

            for (let i = 0; i < rooms[players[socket.id].room].length; i++) {
                if (rooms[players[socket.id].room][i] == socket.id) {
                    console.log("removing from room", rooms[players[socket.id].room][i]);
                    rooms[players[socket.id].room].splice(i, 1);
                }
            }

            // updatePlayerInfo in database
            supabase.updatePlayerInfo(players[socket.id]);

            // emit a message to all players to remove this player
            io.to(players[socket.id].room).emit('disconnected', socket.id);
            delete players[socket.id];
            delete peers[socket.id];
        });

        /**
         * Send message to client to initiate a connection
         * The sender has already setup a peer connection receiver
         */
        socket.on('initSend', init_socket_id => {
            console.log('INIT SEND by ' + socket.id + ' for ' + init_socket_id)
            if (peers[init_socket_id]) peers[init_socket_id].emit('initSend', socket.id)
        });


        socket.on('addToTalk', id => {
            if (hashChats.includes(socket.id + '$' + id)) return;
            console.log('sending init receive to ' + socket.id)
            if (peers[id]) peers[id].emit('initReceive', socket.id)
            hashChats.push(id + '$' + socket.id);
            console.log(`TRYING TO CHAT ${id} with ${socket.id}`)
        });

        socket.on('addToAllPeers', () => {
            for (var peer in peers) {
                if (hashChats.includes(socket.id + '$' + peer)) return;
                if (peers[peer]) peers[id].emit('initeReceive', socket.id);
                hashChats.push(peers + '$' + socket.id);
            }
        })

        socket.on('removeFromTalk', id => {
            if (hashChats.includes(id + '$' + socket.id)) hashChats.splice(hashChats.indexOf(id + '$' + socket.id), 1);
            if (hashChats.includes(socket.id + '$' + id)) hashChats.splice(hashChats.indexOf(socket.id + '$' + id), 1);

            console.log('REMOVING PEER', id, socket.id);
            // emit player with socket id
            if (peers[id]) peers[id].emit('removeFromTalk', socket.id);
            if (peers[socket.id]) peers[socket.id].emit('removeFromTalk', id);
        });

        // ADD TEXT CHAT
        socket.on('textChatMessage', (message) => {
            socket.to(players[socket.id].room).emit('textChatMessage', message);
        });


        // MMORPG 
        socket.on('hitMonster', (monsterId) => {
            const damage = players[socket.id].weapon.damage;
            const monster = monstersList[monsterId];
            if (!monster) return;
            monster.hp -= damage;
            if (monster.hp <= 0) {
                delete monstersList[monsterId];
                players[socket.id].killedMonsters++;
            }
        });

        socket.on('weaponShot', (data) => {
            socket.to(players[socket.id].room).emit('weaponShot', data);
        });

        var gettingResult = false
        setInterval(() => {
            if (gettingResult) return;
            gettingResult = true;
            supabase.getPlayersKilledMonster().then(result => {
                gettingResult = false;
                if (!result || !result.data) return
                // sort result by result.data.killed_monsters in descending order
                result = result.data.sort((a, b) => b.killed_monsters - a.killed_monsters);
                socket.emit('updateLeaderboard', result);
            })
        }, 10000)
    });

    // main timer

    setInterval(() => {
        // get for in object 
        for (var room in rooms) {
            const data = {};
            rooms[room].forEach(socketId => {
                if (!players[socketId]) return;
                data[socketId] = {
                    x: players[socketId].x,
                    y: players[socketId].y,
                };
            });
            // make room string value
            const roomString = room.toString();
            io.to(roomString).emit('updatePlayers', data);
        }

        Object.keys(monstersList).forEach(monsterId => {
            const monster = monstersList[monsterId];
            // go with hypotenuse of monster and finalX, finalY
            const angle = Math.atan2(monster.finalY - monster.y, monster.finalX - monster.x);
            // go until the monster is close to the final position
            if (Math.hypot(monster.y - monster.finalY, monster.x - monster.finalX) > 0.5) {
                monster.x += Math.cos(angle) * monster.speed;
                monster.y += Math.sin(angle) * monster.speed;
            } else {
                // remove monster from list
                delete monstersList[monsterId];
            }
        });
        io.to('coffeebar$8').emit('updateMonsters', monstersList);

    }, 30);

    // create monsters
    setInterval(() => {
        if (rooms["coffeebar$8"] && rooms["coffeebar$8"].length) {
            // create monster
            const monsterInfo = monstersInfo[Math.floor(Math.random() * monstersInfo.length)];
            const monster = {
                x: Math.random() * (800 - 100) + 100,
                y: Math.random() * 1000 + 100,
                ...monsterInfo,
            }

            // make random id
            monster.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

            // get random msonter position x and y

            monster.finalX = mapTowers[8].x;
            monster.finalY = mapTowers[8].y;

            monster.room = "coffeebar$8";

            monstersList[monster.id] = monster;


        }
    }, 2000)

};