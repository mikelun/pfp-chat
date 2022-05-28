const maps = require("./data/maps");
const mapsStartPoints = require("./data/mapsStartPoints");
const nicknames = require("./data/nicknames");
const weapons = require('./data/MMORPG/weapons.js');
const supabase = require("./supabase/supabase");

module.exports = {
    connectToRoom: async function (socket, players, rooms, initializePlayer) {
        // adding to rooms
        if (!rooms[players[socket.id].room]) {
            rooms[players[socket.id].room] = [socket.id];
        } else {
            if (!rooms[players[socket.id].room].includes(socket.id)) {
                rooms[players[socket.id].room].push(socket.id);
            }
        }

        var sortPlayers = sortPlayersBySocketId(players, socket.id);

        if (initializePlayer) {
            connectToHome(players, socket.id).then(data => {
                socket.emit('playerInitialized', sortPlayers, data ? data.changed_tiles : null);
            })

        } else {
            connectToHome(players, socket.id).then(data => {
                socket.emit('currentPlayers', sortPlayers, data ? data.changed_tiles : null);
            })
        }

        // update all other players of the new player
        socket.to(players[socket.id].room).emit('newPlayer', players[socket.id]);
    },
    addPlayer: function (bigData) {
        const {io, socket, players, peers, address, planet, playerInfo, rooms, firstEntrance, data, spaceId, spaces} = bigData;

        // disconnect player with this session
        for (var player in players) {
            if (players[player].session == socket.request.sessionID) {
                if (peers[player]) {
                    peers[player].disconnect();
                }
            }
        }

        players[socket.id] = createPlayerData({
            socket: socket,
            address: address,
            planet: planet,
            playerInfo: playerInfo,
            data: data,
            spaceId: spaceId,
            spaces: spaces,
        });


        socket.join(players[socket.id].room);


        this.connectToRoom(socket, players, rooms, firstEntrance, false);
    },
}


function createPlayerData(data) {
    var {socket, address, planet, playerInfo, data, spaceId, spaces} = data;

    // if player is guest or first entrance
    var x = mapsStartPoints[maps[planet]][0].x;
    var y = mapsStartPoints[maps[planet]][0].y;
    var mapId = maps[planet];

    var textureId = Math.floor(Math.random() * 33);
    var playerName = nicknames[Math.floor(Math.random() * nicknames.length)];
    var enterTime = Math.floor(Date.now() / 1000);
    var killedMonsters = 0;
    var coins = 0;
    var nft = null;
    var weapon = weapons[0];
    var weaponId = 0;
    var isHome = false;
    var space = null;

    if (data) {
        if (!data.space) {
            if (data.x) x = data.x;
            if (data.x) y = data.y;
            if (data.map_id) mapId = data.map_id;
        }
        if (data.killed_monsters) killedMonsters = data.killed_monsters;
        if (data.time_in_game) timeInGame = data.time_in_game;
        if (data.coins) coins = data.coins;
        if (data.textureId) textureId = data.textureId;
        if (data.nft) nft = data.nft;
        if (data.weapon_id) {
            weaponId = data.weapon_id;
            weapon = weapons[weaponId];
        }
        if (data.is_home) {
            isHome = data.is_home;
        }

        if (data.space) {
            //space = data.space;
        }
    } else {
        if (playerInfo) {
            x = playerInfo.x;
            y = playerInfo.y;
            textureId = playerInfo.textureId;
            playerName = playerInfo.playerName;
            mapId = playerInfo.mapId;
        }
    }

    var currentRoom = planet + '$' + mapId;

    if (isHome) {
        currentRoom = planet + '$' + address;
    }

    if (spaces[spaceId]) {
        mapId = spaces[spaceId].mapId; 
        x = mapsStartPoints[mapId][0].x;
        y = mapsStartPoints[mapId][0].y;
        currentRoom = spaces[spaceId].room;
    } else {
        spaceId = null;
    }




    console.log('connecting to room: ' + currentRoom);

    const player = {
        x: x,
        y: y,
        playerId: socket.id,
        microphoneStatus: false,
        deafen: false,
        playerName: playerName,
        textureId: textureId,
        nft: nft,
        address: address,
        room: currentRoom,
        mapId: mapId,
        weapon: weapon,
        killedMonsters: killedMonsters,
        enterTime: enterTime,
        planet: planet,
        coins: coins,
        weaponId: weaponId,
        isHome: isHome,
        session: socket.request.sessionID,
        space: space,
        spaceId: spaceId,
    }

    return player;

}

function sortPlayersBySocketId(players, socketId) {
    sortPlayers = [];
    for (var player in players) {
        if (players[player].room == players[socketId].room) {
            sortPlayers.push(players[player]);
        }
    }
    return sortPlayers;
}

function connectToHome(players, socketId) {
    return (async () => {
        if (players[socketId].isHome) {
            var result = await supabase.getRoom(players[socketId].room);

            var data = result ? result.data : null;
            if (data && !data.length) {
                result = await supabase.createRoom(players[socketId].room, players[socketId].address);
                data = result ? result.data : null;
                if (data) data = data[0];
                return data;

            } else {
                if (data) data = data[0];
                return data;
            }
        }
    })()
}