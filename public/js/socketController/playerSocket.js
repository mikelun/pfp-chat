import { Player } from "../characters/player";
import { OtherPlayer } from "../characters/otherPlayer";
import { sceneEvents } from '../Events/EventsCenter';
import { createParticles } from "../utils/particles";
import { addPlayer } from "../scenes/GameView/addPlayer";
import { loadTexture } from "../scenes/GameView/loadTexture";
import { addOtherPlayers } from "../scenes/GameView/addOtherPlayers";
import { addWeapon, removeWeapon } from "../scenes/Weapons/weapon";
import { updateLeaderboard } from "../MapBuilding/Maps/map8";
import { updateNFTImage } from "../scenes/GameUI-elements/hud";
// import { sendFile } from "express/lib/response";

var peers;
var playersList = [];

var self;
export function initializePlayersSocket(anotherSelf, _peers, currentPlayers) {
    self = anotherSelf;
    peers = _peers;
    self.otherPlayers = self.physics.add.group();

    function showCurrentPlayers(players) {

        Object.keys(players).forEach(function (id) {
            if (players[id].playerId === self.socket.id) {
                addPlayer(self, players[id]);
            } else {
                addOtherPlayers(self, players[id]);
            }
        });
        // create snow effect 

        if (self.mapId == 4) {
            createParticles(self);
            sceneEvents.emit('changedMap', self.mapId);
        } else {
            sceneEvents.emit('changedMap', self.mapId);
        }
        

        if (self.mapId == 8) {
            addWeapon(self);
        } else {
            removeWeapon(self);
        }
        sceneEvents.emit('updateOnlinePlayers', playersList.length);
    }

    showCurrentPlayers(currentPlayers);

    self.socket.on('currentPlayers', function (players) {
        showCurrentPlayers(players);
    });

    self.socket.on('newPlayer', function (playerInfo) {
        addOtherPlayers(self, playerInfo);
        sceneEvents.emit('updateOnlinePlayers', playersList.length);
    });


    self.socket.on('updatePlayers', function(data) {
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (data[otherPlayer.playerId]) {
                otherPlayer.newX = data[otherPlayer.playerId].x;
                otherPlayer.newY = data[otherPlayer.playerId].y;
            }
        });
    });

    //DISCONNECT FUNCTION ONLY HERE
    self.socket.on('disconnected', function (playerId) {
        console.log('Other player disconnected');

        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (playerId === otherPlayer.playerId) {
                self.playerUI[otherPlayer.playerId].playerText.destroy();
                self.playerUI[otherPlayer.playerId].microphone.destroy();
                self.playerUI[otherPlayer.playerId].background.destroy();
                self.playerUI[otherPlayer.playerId].headphones.destroy();
                if (self.playerUI[otherPlayer.playerId].weapon) {
                    self.playerUI[otherPlayer.playerId].weapon.destroy();
                }
                otherPlayer.destroy();
            }
        });

        for (let i = 0; i < playersList.length; i++) {
            if (playersList[i].id == playerId) {
                playersList.splice(i, 1);
            }
        }

        // remove from self.connected
        for (let i = 0; i < self.connected.length; i++) {
            if (self.connected[i].playerId == playerId) {
                self.connected.splice(i, 1);
            }
        }
        showPlayersToTalk()
        removePeer(playerId);
        sceneEvents.emit('updateOnlinePlayers', playersList.length);
    });


    self.socket.on('updatePlayerInfo', (playerInfo) => {
        for (let i = 0; i < playersList.length; i++) {
            if (playersList[i].id == playerInfo.playerId) {
                // change player text
                if (self.playerUI[playerInfo.playerId].playerText.text != playerInfo.playerName) {
                    self.playerUI[playerInfo.playerId].playerText.setText(playerInfo.playerName);
                    self.playerUI[playerInfo.playerId].background.width = playerInfo.playerName.length * 6;
                    getInterectionForEns(playerInfo.playerId, playerInfo.playerName);
                }
                playersList[i].name = playerInfo.playerName;

                // change mircrophone status
                playersList[i].microphoneStatus = playerInfo.microphoneStatus;

                self.playerUI[playerInfo.playerId].microphone.setTexture(playerInfo.microphoneStatus ? "microphone1" : "microphone1-off");
                self.playerUI[playerInfo.playerId].headphones.setTexture(playerInfo.deafen ? "headphones-off" : "headphones");

                if (playerInfo.nft && self.player.id == playerInfo.playerId) {
                    updateNFTImage(playerInfo.nft);
                }


                if (playerInfo.textureId && playerInfo.textureId != playersList[i].textureId) {
                    // TODO: ADD FUNCTION FOR LOADING TEXTURE
                    // get otherPlayer with id
                    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                        if (playerInfo.playerId === otherPlayer.playerId) {
                            var textureFromInternet = isTextureFromInternet(playerInfo.textureId);
                            if (textureFromInternet) {
                                var type = 'crypto-duckies';
                                if (playerInfo.textureId.startsWith('https://buildship')) {
                                    type = 'moonbirds';
                                }
                                loadTexture(self, otherPlayer, playerInfo.textureId, type);
                            }
                        }
                    });
                }
                showPlayersToTalk()
                break;
            }
        }
    });

    self.socket.on('removeFromTalk', (playerId) => {
        // remove peer from talk
        removePeer(playerId);
    });

    self.socket.on("updateLeaderboard", data => {
        if (self.mapId == 8) updateLeaderboard(data);
    });

    self.socket.on('updatePlayerItems', (items) => {
        sceneEvents.emit('getItems', items);
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

// DESTROYING MAIN PLAYER
export function destroyPlayer() {
    const playerUI = self.playerUI[self.player.id];
    playerUI.playerText.destroy();
    playerUI.microphone.destroy();
    if (self.playerShadwow) {
        self.playerShadow.destroy();
    }
    self.player.destroy();
    self.player = null;
}


export const randColor = () => {
    // get random light color
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#FFFF33', '#0099FF', '#33FFCC', '#99FFCC', '#00FF99', '#33FF66', '#33FF33', '#99FF33', '#CCFF33'];
    const rand = Math.floor(Math.random() * colors.length);
    return colors[rand];
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
    sceneEvents.emit("currentPlayers", sortedPlayersList, self.playerName);
}

export function isTextureFromInternet(texture) {
    return (texture + '').startsWith('https');
}

export function pushToPlayerList(playerInfo) {
    playersList.push({ name: playerInfo.playerName, microphoneStatus: playerInfo.microphoneStatus, id: playerInfo.playerId, nft: playerInfo.nft, textColor: playerInfo.textColor, textureId: playerInfo.textureId });
}

export function updateEnsInPlayerList(domain) {
    playersList.forEach(player => {
        if (player.id == self.socket.id) {
            if (domain) { 
                player.name = domain;
                self.playerName = domain;
                self.player.setInteractive().on('pointerdown', () => {
                    // open link twitter
                    window.open(`https://context.app/${domain}`);
                })
            }
            self.socket.emit("updatePlayerInfo", { playerName: domain }, self.socket.id);
            showPlayersToTalk();
        }
    });
}

export function updateNFTInPlayerList(nftImage, id, link) {
    playersList.forEach(player => {
        if (player.id == self.socket.id) {
            player.nft = nftImage;
            const textureId = id ? link : null;
            
            self.socket.emit("updatePlayerInfo", { nft: nftImage, textureId: textureId }, self.socket.id);
        }
    });
}

export function getInterectionForEns(id, domain) {
    // if ends on .eth
    if (!domain.endsWith('.eth')) return;

    // find in other players
    self.otherPlayers.getChildren().forEach(otherPlayer => {
        if (otherPlayer.playerId == id) {
            otherPlayer.setInteractive().on('pointerdown', () => {
                // open link twitter
                window.open(`https://context.app/${domain}`);
            });
        }
    });
}
