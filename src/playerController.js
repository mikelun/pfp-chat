const maps = require("./data/maps");
const mapsStartPoints = require("./data/mapsStartPoints");
const nicknames = require("./data/nicknames");
const guns = require('./data/MMORPG/guns');

module.exports = {
    addPlayer: function (io, socket, players, address, room, playerInfo, rooms, initializePlayer) {
        // for (test in players) {
        //     if (players[test].address == address) {
        //         socket.emit('playerExists')
        //         return;
        //     }
        // }

        players[socket.id] = createPlayerData(socket, address, room, playerInfo);

        socket.join(players[socket.id].room);

        // adding to rooms
        if (!rooms[players[socket.id].room]) {
            rooms[players[socket.id].room] = [socket.id];
        } else {
            if (!rooms[players[socket.id].room].includes(socket.id)) {
                rooms[players[socket.id].room].push(socket.id);
            }
        }

        var sortPlayers = [];
        for (var player in players) {
            if (players[player].room == players[socket.id].room) {
                sortPlayers.push(players[player]);
            }
        }
        if (initializePlayer) {
            socket.emit('playerInitialized', sortPlayers);
        } else {
             socket.emit('currentPlayers', sortPlayers);
        }

        console.log("ROOM",players[socket.id].room);

        // update all other players of the new player
        socket.to(players[socket.id].room).emit('newPlayer', players[socket.id]);
    }
}


function createPlayerData(socket, address, room, playerInfo) {


    var x = mapsStartPoints[maps[room]][0].x;
    var y = mapsStartPoints[maps[room]][0].y;
    var mapId = maps[room];
    var textureId = Math.floor(Math.random() * 33);
    var playerName = nicknames[Math.floor(Math.random() * nicknames.length)];

    if (playerInfo) {
        if (playerInfo.mapId) {
            x = mapsStartPoints[playerInfo.mapId][0].x;
            y = mapsStartPoints[playerInfo.mapId][0].y;
            mapId = playerInfo.mapId;
        }
        if (playerInfo.mapChanged) {
            if (mapsStartPoints[playerInfo.mapId][playerInfo.mapChanged]) {
                x = mapsStartPoints[playerInfo.mapId][playerInfo.mapChanged].x;
                y = mapsStartPoints[playerInfo.mapId][playerInfo.mapChanged].y;
            }
        } else if (playerInfo.x) {
            x = playerInfo.x;
            y = playerInfo.y;
        }
        if (playerInfo.textureId) textureId = playerInfo.textureId;
        if (playerInfo.playerName) playerName = playerInfo.playerName;
    }

    const currentRoom = room + '$' + mapId;

    const player = {
        x: x,
        y: y,
        playerId: socket.id,
        microphoneStatus: false,
        deafen: false,
        playerName: playerName,
        textureId: textureId,
        nft: null,
        address: address,
        room: currentRoom,
        mapId: mapId,
        weapon: guns[0],
        killedMonsters: 0,
        timeInGame: 0,
        enterTime:  Math.floor(Date.now() / 1000)
    }

    return player;

}