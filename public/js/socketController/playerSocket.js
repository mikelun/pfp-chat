import { Player } from "../characters/player";
import { OtherPlayer } from "../characters/otherPlayer";
import { nicknames } from "../utils/nicknames";
import { sceneEvents } from '../Events/EventsCenter';

var peers;
var playersList = [];
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
                self.playerUI[otherPlayer.playerId].microphone.destroy();
                self.playerUI[otherPlayer.playerId].playerText.destroy();
                otherPlayer.destroy();
            }
        });
        console.log(playersList);

        for (let i = 0; i < playersList.length; i++) {
            if (playersList[i].id == playerId) {
                playersList.splice(i, 1);
            }
        }
        console.log(playersList);
    
        for (let socket_id in peers) {
            removePeer(socket_id)
        }
    });

    self.socket.on('updatePlayerInfo', (playerInfo) => {
        for (let i = 0; i < playersList.length; i++) {
            if (playersList[i].id == playerInfo.playerId) {
                playersList[i] = playerInfo;
                sceneEvents.emit('currentPlayers', playersList);
                break;
            } 
        }
    });
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

//////////////////// INTERECTING WITH GAME

function addPlayer(self, playerInfo) {
    self.textureId = playerInfo.textureId;
    self.player = self.add.player(playerInfo.x, playerInfo.y, `characters${playerInfo.textureId}`);
    self.cameras.main.startFollow(self.player, true, 0.02, 0.02);
    self.playerUI[self.socket.id] = {};
    const textColor = randColor();
    self.playerUI[self.socket.id].playerText = self.add.text(self.player.x, self.player.y, playerInfo.playerName, { fontSize: '36px', fontFamily: 'monospace', fill: textColor }).setScale(0.3);
    self.playerUI[self.socket.id].microphone = self.add.image(playerInfo.x + 20, playerInfo.y, "microphoneMuted").setScale(0.5);
    playersList.push({name: playerInfo.playerName, microphoneStatus: playerInfo.microphoneStatus, id: playerInfo.playerId, textColor:textColor});
    sceneEvents.emit("currentPlayers", playersList);
    // random nickname 
    //let playerName = nicknames[Math.floor(Math.random() * nicknames.length)];
    //self.socket.emit('updatePlayerInfo', {playerName: playerName}, self.socket.id);
    //self.add
}

function addOtherPlayers(self, playerInfo) {
    const otherPlayer = self.add.otherPlayer(playerInfo.x, playerInfo.y, `characters${playerInfo.textureId}`, self);
    //const otherPlayerName = self.add.text(playerInfo.x, playerInfo.y, playerInfo.account, { fontSize: '20px', color: '#ffffff' });
    otherPlayer.playerId = playerInfo.playerId;
    const textColor = randColor();
    self.playerUI[playerInfo.playerId] = {
        playerText: self.add.text(playerInfo.x, playerInfo.y, playerInfo.playerName, { fontSize: '24px', fontFamily: 'monospace', fill: textColor }).setScale(0.5)
    };
    self.otherPlayers.add(otherPlayer);
    let microphoneTexture = playerInfo.microphoneStatus ? "microphone" : "microphoneMuted";
    self.playerUI[playerInfo.playerId].microphone = self.add.image(playerInfo.x + 20, playerInfo.y, microphoneTexture).setScale(0.5);
    playersList.push({name: playerInfo.playerName, microphoneStatus: playerInfo.microphoneStatus, id: playerInfo.playerId});
    sceneEvents.emit('currentPlayers', playersList);
}

const randColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
}