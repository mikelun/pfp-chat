const maps = require("./data/maps");
const mapsStartPoints = require("./data/mapsStartPoints");
const nicknames = require("./data/nicknames");
const guns = require('./data/MMORPG/guns');

module.exports = {
    connectToRoom: function (socket, players, rooms, initializePlayer, connectingToOtherRoom) {
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

        // update all other players of the new player
        socket.to(players[socket.id].room).emit('newPlayer', players[socket.id]);
    },
    addPlayer: function (io, socket, players, address, room, playerInfo, rooms, initializePlayer, data) {
        // for (test in players) {
        //     if (players[test].address == address) {
        //         socket.emit('playerExists')
        //         return;
        //     }
        // }

        players[socket.id] = createPlayerData(socket, address, room, playerInfo, data);

        socket.join(players[socket.id].room);


        this.connectToRoom(socket, players, rooms, initializePlayer, false);
    }
}


function createPlayerData(socket, address, room, playerInfo, data) {

    // if player is guest or first entrance
    var x = mapsStartPoints[maps[room]][0].x;
    var y = mapsStartPoints[maps[room]][0].y;
    var mapId = maps[room];
    var textureId = Math.floor(Math.random() * 33);
    var playerName = nicknames[Math.floor(Math.random() * nicknames.length)];
    var enterTime = Math.floor(Date.now() / 1000);
    var killedMonsters = 0;

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


    if (data) {
        x = data.x;
        y = data.y;
        mapId = data.map_id;
        killedMonsters = data.killed_monsters;
        timeInGame = data.time_in_game;
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
        killedMonsters: killedMonsters,
        enterTime: enterTime,
        planet: room
    }

    return player;

}