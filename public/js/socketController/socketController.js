import { initializeAudio, removePeer } from '../socketController/audioSocket';
import { destroyPlayer, initializePlayersSocket, loadTexture } from '../socketController/playerSocket';
import { io } from "socket.io-client";
import { currentPlayerDisconnected } from '../socketController/playerSocket';
import { initializeChatSocket } from './textChatSocket';
import { disconnectPlayerBadInternet } from '../scenes/GameView/disconnectPlayer';

/**
 * Initialize socket and connect to server by socket.io
 */
export function initializeSocket(self, peers) {

    // log port
    // log port
    const port = process.env.PORT || 3000;
    const site = window.location.hostname;
    const connectLink = site == 'localhost' ? `ws://localhost:${port}` : `wss://${site}`;

    self.socket = io(connectLink, { transports: ['websocket'] });

    // Initialize audio stream for socket
    initializeAudio(self.socket, peers, self);

    // Initialize player socket
    initializePlayersSocket(self, peers);

    // Initialize text chat socket
    initializeChatSocket(self);
    self.socket.on('connect', () => {
        console.log('Connected to server');
        if (localStorage.getItem('playerInfo')) {
            const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
            self.socket.emit('addPlayer', self.address, self.room, playerInfo);
        } else {
            self.socket.emit('addPlayer', self.address, self.room);
        }
    })

    self.socket.on('playerExists', () => {
        self.cameras.main.shake(500, 0.01);
        self.add.rectangle(0, 0, 5000, 5000, 0x000000).setAlpha(0.5);
        self.add.text(330, 300, "You have been logged in!\nPlease close other tab with this metaverse\nand reset the page", { fontSize: "30px", fill: "#ffffff", align: "center", fontFamily: "PixelFont" });
    });

    // IF PLAYER DISCONNECTED
    self.socket.on('disconnect', () => {
        disconnectPlayerBadInternet(self);
    })


}
