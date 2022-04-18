import { Player } from "../characters/player";
import { OtherPlayer } from "../characters/otherPlayer";
import { nicknames } from "../utils/nicknames";
import { sceneEvents } from '../Events/EventsCenter';
import { getPlayerNFT } from "../web3/GetPlayerNFT";
import { getEnsDomain } from "../web3/GetEnsDomain";
import { addPhysicsForScene } from "../MapBuilding/showMap";
// import { sendFile } from "express/lib/response";

var peers;
var playersList = [];

var self;
export function initializePlayersSocket(anotherSelf, _peers) {
    self = anotherSelf;
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
                otherPlayer.newX = playerInfo.x;
                otherPlayer.newY = playerInfo.y;
                //console.log(otherPlayer.newX, otherPlayer.x);
                //otherPlayer.setPosition(playerInfo.x, playerInfo.y);
                //otherPlayer.update(otherPlayer.x, otherPlayer.y);
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
        showPlayersToTalk()
        removePeer(playerId);
    });

    self.socket.on('updatePlayerInfo', (playerInfo) => {
        for (let i = 0; i < playersList.length; i++) {
            if (playersList[i].id == playerInfo.playerId) {
                self.playerUI[playerInfo.playerId].playerText.setText(playerInfo.playerName);
                self.playerUI[playerInfo.playerId].microphone.setTexture(playerInfo.microphoneStatus ? "microphone" : "microphoneMuted");
                playersList[i].name = playerInfo.playerName;
                playersList[i].microphoneStatus = playerInfo.microphoneStatus;
                playersList[i].nft = playerInfo.nft;

                showPlayersToTalk()
                break;
            }
        }
    });

    self.socket.on('removeFromTalk', (playerId) => {
        // remove peer from talk
        removePeer(playerId);
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

    console.log("NEW PLAYER ADDRESS + ", playerInfo.address);
    // TRIGGERS FOR TVS
    self.rectangleTrigger = self.add.rectangle(200, 630, 100, 60, 0xff0000).setAlpha(0);
    self.machineTrigger = self.add.rectangle(225, 680, 40, 40, 0xff0000).setAlpha(0);

    self.textureId = playerInfo.textureId;
    self.player = self.add.player(playerInfo.x + self.playerAddX, playerInfo.y + self.playerAddY, `characters${playerInfo.textureId}`);
    self.layer1.add(self.player);
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

    getPlayerNFT(self.moralis);

    getEnsDomain(self.moralis).then(domain => {
        playersList.forEach(player => {
            if (player.id == self.socket.id) {
                player.name = domain;
                self.socket.emit("updatePlayerInfo", { playerName: domain }, self.socket.id);
                sceneEvents.emit("currentPlayers", playersList);
            }
        });
    });

    addPhysicsForScene(self, self.mapId);

    self.talkRectangle = self.add.rectangle(self.player.x, self.player.y, 200, 200, 0x000000).setAlpha(0);

    self.connected = [];
    // // ADD BALL TO SCENE
    // self.physics.add.collider(self.player, self.ball);
    // self.physics.add.collider(self.wallsLayer, self.ball);
    // self.physics.add.collider(self.ball, self.stairsUpFloorLayer);
    // self.physics.add.collider(self.ball, self.objectsLayer);

    sceneEvents.on('nftSelected', nftSelected, this);
}

function nftSelected(nftImage) {
    playersList.forEach(player => {
        if (player.id == self.socket.id) {
            player.nft = nftImage;
            self.socket.emit("updatePlayerInfo", { nft: nftImage }, self.socket.id);
            sceneEvents.emit("currentPlayers", playersList);
        }
    });
}



function addOtherPlayers(self, playerInfo) {
    const otherPlayer = self.add.otherPlayer(playerInfo.x, playerInfo.y, `characters${playerInfo.textureId}`, self);
    //const otherPlayerName = self.add.text(playerInfo.x, playerInfo.y, playerInfo.account, { fontSize: '20px', color: '#ffffff' });
    otherPlayer.playerId = playerInfo.playerId;
    otherPlayer.name = playerInfo.playerName;
    const textColor = randColor();
    self.playerUI[playerInfo.playerId] = {
        playerText: self.add.text(playerInfo.x, playerInfo.y, playerInfo.playerName, { fontSize: '24px', fontFamily: 'monospace', fill: textColor }).setScale(0.5)
    };
    self.otherPlayers.add(otherPlayer);
    self.layer1.add(otherPlayer);
    let microphoneTexture = playerInfo.microphoneStatus ? "microphone" : "microphoneMuted";
    self.playerUI[playerInfo.playerId].microphone = self.add.image(playerInfo.x + 20, playerInfo.y, microphoneTexture).setScale(0.5);
    playersList.push({ name: playerInfo.playerName, microphoneStatus: playerInfo.microphoneStatus, id: playerInfo.playerId, nft: playerInfo.nft, textColor: textColor });
    showPlayersToTalk()
}

const randColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
}

export function currentPlayerDisconnected(playerId) {
    playersList = [];
    for (let socket_id in peers) {
        removePeer(socket_id)
    }
    showPlayersToTalk()
}

export function showPlayersToTalk() {
    // sort players by self.connected and playersList
    let sortedPlayersList = [];
    console.log('CONNECTED PLAYERS' + self.connected);
    playersList.forEach(player => {
        if (self.connected) {
            self.connected.forEach(otherPlayer => {
                if (player.id == otherPlayer.playerId) {
                    console.log('ADDED TO PLAYERS LIST' + player.id);
                    sortedPlayersList.push(player);
                }
            })
        }
        if (player.id == self.socket.id) {
            sortedPlayersList.push(player);
        }
    });
    sceneEvents.emit("currentPlayers", sortedPlayersList);
}