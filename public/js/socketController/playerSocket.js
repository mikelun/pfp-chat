import { Player } from "../characters/player"; 
import { OtherPlayer } from "../characters/otherPlayer";
import { nicknames } from "../utils/nicknames";
var peers;
export function initializePlayersSocket(self, _peers) {
    peers = _peers;
    self.otherPlayers = self.physics.add.group();

    self.socket.on('currentPlayers', function (players) {
        Object.keys(players).forEach(function (id) {
        if (players[id].playerId === self.socket.id) {
            addPlayer(self, players[id]);
        } else {
            addOtherPlayers(self, players[id]);
        }
        });
    });

    self.socket.on('updatePlayerInfo', (player) => {
        if (self.socket.id === player.playerId) {
            console.log("Change own nickname by" + player.playerName);
        }
        else {
            console.log("Change other nickname by" + player.playerName);
        }
    });
    self.socket.on('newPlayer', function (playerInfo) {
        addOtherPlayers(self, playerInfo);
    });
    
    self.socket.on('playerMoved', function (playerInfo) {
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
            otherPlayer.setPosition(playerInfo.x, playerInfo.y);
            otherPlayer.update(otherPlayer.x, otherPlayer.y);
        }
        });
    });

    //DISCONNECT FUNCTION ONLY HERE
    self.socket.on('disconnected', function (playerId) {
        console.log('disconnected');

        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
            otherPlayer.destroy();
        }
        });
        for (let socket_id in peers) {
            removePeer(socket_id)
        }
    });
}

function addPlayer(self, playerInfo) {
    self.textureId = playerInfo.textureId;
    self.player = self.add.player(playerInfo.x - 100, playerInfo.y - 100,  `characters${playerInfo.textureId}`);
    self.cameras.main.startFollow(self.player, true, 0.02, 0.02);

    // random nickname 
    let playerName = nicknames[Math.floor(Math.random() * nicknames.length)];
    self.socket.emit('updatePlayerInfo', {playerName: playerName}, self.socket.id);
}

function addOtherPlayers(self, playerInfo) {
    const otherPlayer = self.add.otherPlayer(playerInfo.x - 100, playerInfo.y - 100, `characters${playerInfo.textureId}`, 4, 0);
    //const otherPlayerName = self.add.text(playerInfo.x, playerInfo.y, playerInfo.account, { fontSize: '20px', color: '#ffffff' });
    otherPlayer.playerId = playerInfo.playerId;
    self.otherPlayers.add(otherPlayer);
}


function removePeer(socket_id) {

    let videoEl = document.getElementById(socket_id)
    if (videoEl) {

        const tracks = videoEl.srcObject.getTracks();

        tracks.forEach(function (track) {
            track.stop()
        })

        videoEl.srcObject = null
        videoEl.parentNode.removeChild(videoEl)
    }
    if (peers[socket_id]) peers[socket_id].destroy()
    delete peers[socket_id]
}
