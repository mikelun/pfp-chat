import { Player } from "../characters/player";
import { OtherPlayer } from "../characters/otherPlayer";
import { nicknames } from "../utils/nicknames";
import { sceneEvents } from '../Events/EventsCenter';
import { getPlayerNFT } from "../web3/GetPlayerNFT";
// import { sendFile } from "express/lib/response";

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
        console.log('Other player disconnected');

        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (playerId === otherPlayer.playerId) {
                self.playerUI[otherPlayer.playerId].microphone.destroy();
                self.playerUI[otherPlayer.playerId].playerText.destroy();
                otherPlayer.destroy();
            }
        });

        for (let i = 0; i < playersList.length; i++) {
            if (playersList[i].id == playerId) {
                playersList.splice(i, 1);
            }
        }
        removePeer(playerId);
    });

    self.socket.on('updatePlayerInfo', (playerInfo) => {
        for (let i = 0; i < playersList.length; i++) {
            if (playersList[i].id == playerInfo.playerId) {
                playersList[i].name = playerInfo.playerName;
                playersList[i].microphoneStatus = playerInfo.microphoneStatus;
                playersList[i].nft = playerInfo.nft;
                
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
    // IF PLAYER DISCONNECTED AND AFTER RECONNECTED
    if (self.errors) {
        if (self.errors.getChildren().length > 0) {
            self.errors.clear(true);
        }
        self.errors = null;
    }

    // TRIGGERS FOR 
    self.rectangleTrigger = self.add.rectangle(200, 630, 100, 60, 0xff0000).setAlpha(0);
    self.machineTrigger = self.add.rectangle(225, 680, 40, 40, 0xff0000).setAlpha(0);

    self.textureId = playerInfo.textureId;
    self.player = self.add.player(playerInfo.x, playerInfo.y, `characters${playerInfo.textureId}`);
    self.cameras.main.startFollow(self.player);

    self.player.id = playerInfo.playerId;

    // ADD PLAYER UI
    self.playerUI[self.socket.id] = {};
    const textColor = randColor();
    self.playerUI[self.socket.id].playerText = self.add.text(self.player.x, self.player.y, playerInfo.playerName, { fontSize: '36px', fontFamily: 'monospace', fill: textColor }).setScale(0.3);
    self.playerUI[self.socket.id].microphone = self.add.image(playerInfo.x + 20, playerInfo.y, "microphoneMuted").setScale(0.5);

    playersList.push({ name: playerInfo.playerName, microphoneStatus: playerInfo.microphoneStatus, id: playerInfo.playerId, textColor: textColor, nft: playerInfo.nft });
    
    // END PLAYER UI

    sceneEvents.emit("currentPlayers", playersList);

    getPlayerNFT(self.moralis).then(nfts => {
        nfts = nfts.filter(nft => nft != undefined);
        
        // get random nft
        const nft = nfts[Math.floor(Math.random() * nfts.length)];

        playersList.forEach(player => {
            if (player.id == self.socket.id) {
                player.nft = nft;
                self.socket.emit("updatePlayerInfo", {nft: nft},self.socket.id);
                sceneEvents.emit("currentPlayers", playersList);
            }
        });
        
    });

    self.physics.add.collider(self.player, self.wallsLayer);

    self.physics.add.collider(self.player, self.stairsUpFloorLayer);
    self.physics.add.collider(self.player, self.objectsLayer);

    // ADD BALL TO SCENE
    self.physics.add.collider(self.player, self.ball);
    self.physics.add.collider(self.wallsLayer, self.ball);
    self.physics.add.collider(self.ball, self.stairsUpFloorLayer);
    self.physics.add.collider(self.ball, self.objectsLayer);
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
    playersList.push({ name: playerInfo.playerName, microphoneStatus: playerInfo.microphoneStatus, id: playerInfo.playerId, nft: playerInfo.nft, textColor: textColor });
    sceneEvents.emit('currentPlayers', playersList);
}

const randColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
}

export function currentPlayerDisconnected(playerId) {
    playersList = [];
    for (let socket_id in peers) {
        removePeer(socket_id)
    }
    sceneEvents.emit('currentPlayers', playersList);
}