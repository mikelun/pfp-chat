import { Player } from "../characters/player";
import { OtherPlayer } from "../characters/otherPlayer";
import { sceneEvents } from '../Events/EventsCenter';
import { createParticles } from "../utils/particles";
import { addPlayer } from "../scenes/GameView/addPlayer";
import { loadTexture } from "../scenes/GameView/loadTexture";
import { addOtherPlayers } from "../scenes/GameView/addOtherPlayers";
import { addWeapon, changeWeapon, removeWeapon } from "../scenes/Weapons/weapon";
import { updateLeaderboard } from "../MapBuilding/Maps/map8";
import { updateNFTImage } from "../scenes/GameUI-elements/hud";
import { changeMap } from "../scenes/GameView/changeMap";
import { disconnectPlayer } from "../scenes/GameView/disconnectPlayer";
import { clearMap } from "../MapBuilding/showMap";
import { removeAllMonsters } from "./mmorpgSocket";
import { clearPlayerUI, createSpeakRequest, showEmotion, updatePlayerUI, updateSpeakerEffect, updateTalkingEffect } from "../scenes/GameView/playerUI";
import { createMapsSpecialElements } from "../scenes/GameView/mapsSpecialElements";
// import { sendFile } from "express/lib/response";

var peers;
var playersList = [];

var self;
export function initializePlayersSocket(anotherSelf, _peers, currentPlayers) {
    self = anotherSelf;
    peers = _peers;
    self.otherPlayers = self.physics.add.group();

    function showCurrentPlayers(players, data) {
        removeAllMonsters();
        
        Object.keys(players).forEach(function (id) {
            if (players[id].playerId === self.socket.id) {
                addPlayer(self, players[id]);
                createMapsSpecialElements(self, players[id]);
            } else {
                addOtherPlayers(self, players[id]);
            }
        });
    }

    showCurrentPlayers(currentPlayers);

    self.socket.on('currentPlayers', function (players, data) {
        showCurrentPlayers(players, data);
        if (data) {
            sceneEvents.emit('update-tiles-from-data', data);
        }
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
                clearPlayerUI(self, otherPlayer.playerId);
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
                updatePlayerUI(self, playerInfo);

                updateSpeakerEffect(self, playerInfo);

                playersList[i].name = playerInfo.playerName;

                // change mircrophone status
                playersList[i].microphoneStatus = playerInfo.microphoneStatus;


                if (self.player.id == playerInfo.playerId) {
                    changeWeapon(playerInfo.weapon);
                    if (playerInfo.nft) updateNFTImage(playerInfo.nft);
                }


                if (playerInfo.textureId) {
                    // TODO: ADD FUNCTION FOR LOADING TEXTURE
                    // get otherPlayer with id
                    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
                        if (playerInfo.playerId === otherPlayer.playerId) {
                            //const otherPlayerWeapon = self.playerUI[playerInfo.playerId].weapon;
                            //if (otherPlayerWeapon) otherPlayerWeapon.setTexture(playerInfo.weapon.texture);
                            
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


    self.socket.on('connectToRoom', (data) => {
        if (data.error) {
            sceneEvents.emit('createErrorMessage', 'TO USE THIS FUNCTION YOU SHOULD CONNECT METAMASK');
            return;
        }
        changeMap(self, {mapId: data.mapId, isHome: data.isHome});
    });

    /**
     * EFFECT IF PLAYER TALKING
     */
    self.socket.on('updateTalkingEffect', (data) => {
        if (self.playerUI.second[data.playerId]) {
            updateTalkingEffect(self, data.isTalking, data.playerId);
        }
    });

    /**
     * IF PLAYER CREATED SPACE CONNECT TO IT
     */ 
    self.socket.on('createSpace', (data) => {
        sceneEvents.emit('removeLoader');
        if (data.error) {
            sceneEvents.emit('createErrorMessage', 'ERROR WITH CREATING SPACE');
            return;
        }
        
        changeMap(self, {mapId: data.space.mapId, space: data.space});
    });

    /**
     * SPEAK REQUEST (IT SENDING TO HOST)
     */
    self.socket.on('createSpeakRequest', (data) => {
        if (self.playerUI.second[data.playerId]) {
            createSpeakRequest(self, data.playerId);
        }
    });

    /**
     * APPROVE SPEAK REQUEST, SENDING TO COHOST
     */
    self.socket.on('approveSpeakRequest', (data) => {
        if (self.talkRectangle) {
            self.talkRectangle.width = 10000;
            self.talkRectangle.height = 10000;
        }
    });

    /**
     * REMOVE COHOST, SENDING TO COHOST
     */
    self.socket.on('removeFromSpeakers', (data) => {
        if (self.talkRectangle) {
            self.talkRectangle.width = 0;
            self.talkRectangle.height = 0;
            sceneEvents.emit('muteMicrophone');
        }
    })

    /**
     * WHEN  OTHER PLAYER SHOWED AN EMOTION
     */
    self.socket.on('showEmotion', (data) => {
        showEmotion(self, data.playerId, data.emotionId); 
    });



    sceneEvents.on('connectToMyRoom', () => {
        self.socket.emit('connectToRoom', {isMyRoom: true});
    });

    sceneEvents.on('connectToPlanet', (planetName) => {
        self.socket.emit('connectToRoom', {planetName: planetName, isMyRoom: false});
    });

    sceneEvents.on('updateTiles', (data) => {
        self.socket.emit('updateTiles', data);
    });

    sceneEvents.on('updateTalkingEffect', (data) => {
        self.socket.emit('updateTalkingEffect', data);
    });

    sceneEvents.on('createSpace', (data) => {
        self.socket.emit('createSpace', data);
    });

    sceneEvents.on('addToAllPeers', () => {
        self.socket.emit('addToAllPeers');
    });

    sceneEvents.on('approveSpeakRequest', (data) => {
        self.socket.emit('approveSpeakRequest', data);
    });

    sceneEvents.on('removeFromTalk', (data) => {
        self.socket.emit('removeFromTalk', data);
    });

    sceneEvents.on('createSpeakRequest', () => {
        console.log("CREATE SPEAK REQUEST");
        self.socket.emit('createSpeakRequest');
    });

    sceneEvents.on('removeFromSpeakers', (data) => {
        self.socket.emit('removeFromSpeakers', data);
    });

    sceneEvents.on('showEmotion', (data) => {
        self.socket.emit('showEmotion', data);
    });

}



// IF PLAYER SELECTED ITEM FROM INVENTORY
export function itemSelected(category, itemId) {
    self.socket.emit('itemSelected',  category, itemId);
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
    self.player.destroy();
    self.player = null;
}


export const randColor = () => {
    // get random light color
    const colors = ['#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#FFFF33', '#0099FF', '#33FFCC', '#99FFCC', '#00FF99', '#33FF66', '#33FF33', '#99FF33', '#CCFF33'];
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
                // self.player.setInteractive().on('pointerdown', () => {
                //     // open link twitter
                //     window.open(`https://context.app/${domain}`);
                // })
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
