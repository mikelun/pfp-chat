import { initializeAudio, removePeer } from '../socketController/audioSocket';
import { destroyPlayer, initializePlayersSocket, loadTexture } from '../socketController/playerSocket';
import { io } from "socket.io-client";
import { currentPlayerDisconnected } from '../socketController/playerSocket';
import { initializeChatSocket } from './textChatSocket';
import { disconnectPlayerBadInternet } from '../scenes/GameView/disconnectPlayer';
import { initializeRPGSocket } from './mmorpgSocket';
import { sceneEvents } from '../Events/EventsCenter';


var playerInfo;

/**
 * Initialize socket and connect to server by socket.io
 */
export function initializeSocket(self, peers, currentPlayers) {
    // Initialize audio stream for socket
    initializeAudio(self.socket, peers, self);

    // Initialize player socket
    initializePlayersSocket(self, peers, currentPlayers);

    // initialize mmorrpg socket
    initializeRPGSocket(self);

    // Initialize text chat socket
    initializeChatSocket(self);

    self.socket.on('connect', () => {
        sceneEvents.emit('removeErrorDisconnectMessage');
        self.socket.emit('initializePlayer', self.address, self.room, false, playerInfo);
    })

    self.socket.on('playerExists', () => {
        self.cameras.main.shake(500, 0.01);
        self.add.rectangle(0, 0, 5000, 5000, 0x000000).setAlpha(0.5);
        self.add.text(330, 300, "You have been logged in!\nPlease close other tab with this metaverse\nand reset the page", { fontSize: "30px", fill: "#ffffff", align: "center", fontFamily: "PixelFont" });
    });

    // IF PLAYER DISCONNECTED
    self.socket.on('disconnect', () => {
        // if guest save to localstorage
        playerInfo = {
            playerName : self.playerName, 
            mapId : self.mapId,
            x : self.player.x,
            y : self.player.y,
            textureId : self.player.textureId,
        };

        disconnectPlayerBadInternet(self);
    })


}
