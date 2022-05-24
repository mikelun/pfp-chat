const { join, filter, values } = require("./data/nicknames");
const playerController = require("./playerController");
const supabase = require('./supabase/supabase.js');
const monstersInfo = require("./data/MMORPG/monsters");
const mapTowers = require("./data/MMORPG/mapTowers");
const mapsStartPoints = require("./data/mapsStartPoints");

// MAIN ITEMS
const items = require('./data/MMORPG/items');
const weapons = require("./data/MMORPG/weapons");

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

// coins
coins = {};


module.exports = (io) => {
    io.engine.on("initial_headers", (headers, req) => {
        if (req.cookieHolder) {
            headers["set-cookie"] = req.cookieHolder;
            delete req.cookieHolder;
        }
    });

    io.on('connect', (socket) => {

        //console.log('--------------SESSION-------------\n', socket.request.sessionStore.sessions,'\n--------------------------------------');
        //console.log('-----------YOUR SESSION ID--------\n', socket.request.sessionID,'\n--------------------------------------');
        // Initiate the connection process as soon as the client connects

        peers[socket.id] = socket

        function addPlayer(address, planet, firstEntrance, data) {
            playerController.addPlayer(io, socket, players, peers, address, planet, {}, rooms, firstEntrance, data);
            getLeaderboard(socket);
            getItems(socket, address)

            if (players[socket.id].mapId == 8) {
                socket.emit('updateRewardCoins', coins);
            }
        }

        socket.on('initializePlayer', (address, planet, firstEntrance) => {
            supabase.getPlayerData(address).then(result => {
                var data = result ? result.data : null;
                if (data && !data.length) {
                    supabase.createPlayer(address).then(result => {
                        addPlayer(address, planet, firstEntrance, data);
                    })
                } else {
                    if (data) data = data[0];
                    if (data && data.planet != planet) data = null;
                    addPlayer(address, planet, firstEntrance, data);
                }
            })
        })

        socket.on('connectToOtherRoom', (mapId) => {
            connectToOtherRoom(mapId);
        })

        function connectToOtherRoom(mapId) {
            // disconnect from previous room
            for (let i = 0; i < rooms[players[socket.id].room].length; i++) {
                if (rooms[players[socket.id].room][i] == socket.id) {
                    console.log("removing from room", rooms[players[socket.id].room][i]);
                    rooms[players[socket.id].room].splice(i, 1);
                }
            }

            // emit to players in room that current player disconnected and leave the room
            socket.to(players[socket.id].room).emit('disconnected', socket.id);
            socket.leave(players[socket.id].room);

            // connect to other room + kukarek if isHome
            const previousMap = players[socket.id].mapId;
            var room = players[socket.id].planet + '$' + mapId;
            if (players[socket.id].isHome) {
                room = players[socket.id].planet + '$' + players[socket.id].address;
            }

            console.log("connecting to room", room);
            socket.join(room);
            players[socket.id].room = room;
            players[socket.id].mapId = mapId;


            // coordinates of spawn point
            var x = mapsStartPoints[mapId][0].x;
            var y = mapsStartPoints[mapId][0].y;

            // if map has different entrances (for example different homes) -> player will back to the same position
            if (mapsStartPoints[mapId][previousMap]) {
                x = mapsStartPoints[mapId][previousMap].x;
                y = mapsStartPoints[mapId][previousMap].y;
            }

            players[socket.id].x = x;
            players[socket.id].y = y;
            playerController.connectToRoom(socket, players, rooms, false);

            // if map width id 8 -> fight room
            if (players[socket.id].mapId == 8) {
                getLeaderboard(socket);
                socket.emit('updateRewardCoins', coins);
            }

            // updatePlayerInfo in database
            supabase.updatePlayerInfo(players[socket.id]);
        }

        // when a player moves, update the player data
        socket.on('playerMovement', function (movementData) {
            players[socket.id].x = movementData.x;
            players[socket.id].y = movementData.y;
            players[socket.id].rotation = movementData.rotation;
            // emit a message to all players about the player that moved
            //socket.to(players[socket.id].room).emit('playerMoved', players[socket.id]);
        });


        socket.on('updatePlayerInfo', (data, socket_id) => {
            if (data.microphoneStatus != null) players[socket_id].microphoneStatus = data.microphoneStatus;
            if (data.playerName != null) players[socket_id].playerName = data.playerName;
            if (data.nft != null) players[socket_id].nft = data.nft;
            if (data.textureId) players[socket_id].textureId = data.textureId;
            if (data.deafen != null) players[socket_id].deafen = data.deafen;
            io.to(players[socket.id].room).emit('updatePlayerInfo', players[socket_id]);
        });



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



        /**
         * SOCKET FOR MMORPG
         */
        socket.on('hitMonster', (monsterId) => {
            const damage = players[socket.id].weapon.damage;
            const monster = monstersList[monsterId];
            if (!monster) return;
            monster.hp -= damage;
            if (monster.hp <= 0) {
                coins[monster.id] = {
                    x: monster.x,
                    y: monster.y,
                    value: Math.floor(Math.random() * (10 - 1) + 1)
                };

                delete monstersList[monsterId];
                players[socket.id].killedMonsters++;

                io.to(players[socket.id].room).emit('updateRewardCoins', coins);
            }
        });

        socket.on('weaponShot', (data) => {
            socket.to(players[socket.id].room).emit('weaponShot', data);
        });

        socket.on('coinClaimed', (coinId) => {
            if (!coins[coinId] || !coins[coinId].value) return;
            players[socket.id].coins += coins[coinId].value;
            delete coins[coinId];

            socket.to(players[socket.id].room).emit('updateRewardCoins', coins);

            socket.emit('updatePlayerCoins', players[socket.id].coins);
        });

        socket.on('itemSelected', (category, itemId) => {
            if (category == 'weapons') {
                supabase.checkItem(players[socket.id].address, category, itemId).then(res => {
                    if (res && res.count) {
                        players[socket.id].weapon = weapons[itemId];
                        io.to(players[socket.id].room).emit('updatePlayerInfo', players[socket.id]);
                    }
                })
            }
        });



        socket.on('connectToRoom', (data) => {
            console.log("CONNECTING TO ROOM WITH DATA IS MY ROOM: ", data);
            if (data.isMyRoom) {
                if (players[socket.id].address) {
                    players[socket.id].isHome = true;
                    console.log(players[socket.id]);
                    socket.emit('connectToRoom', { mapId: 9, error: false });

                } else {
                    socket.emit('connectToRoom', { error: true, message: 'You should connect metamask to get your room' });
                }
            } else {
                players[socket.id].isHome = false;
                players[socket.id].planet = data.planetName;
                socket.emit('connectToRoom', { mapId: 4 });
            }
        });

        socket.on('updateTiles', (data) => {
            (async () => {
                var result = await supabase.updateRoom(players[socket.id].room, data)
                console.log(result);
            })();
        });

    });

    /**
     * MAIN INTERVAL
     * UPDATE PLAYERS AND MONSTERS (FOR MMORPG)
     */
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

    }, 50);

    /**
     * CREATING MONSTERS
     */
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


// UTIL FUNCTIONS
function getLeaderboard(socket) {
    supabase.getPlayersKilledMonster().then(result => {
        if (!result || !result.data) return
        // sort result by result.data.killed_monsters in descending order
        result = result.data.sort((a, b) => b.killed_monsters - a.killed_monsters);
        socket.emit('updateLeaderboard', result);
    })
}

function getItems(socket, address) {
    supabase.getPlayerItems(address).then(result => {
        if (!result || !result.data || !result.data[0] || !result.data[0].items) return
        var itemsForClient = [];
        result.data[0].items.forEach(itemData => {
            item = {
                category: itemData.category,
                count: itemData.count,
                itemId: itemData.item_id,
                ...items[itemData.category][itemData.item_id],
            }
            itemsForClient.push(item);
        });


        socket.emit('updatePlayerItems', itemsForClient);
    })
}