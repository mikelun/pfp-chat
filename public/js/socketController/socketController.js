import { initializeAudio, removePeer } from '../socketController/audioSocket';
import { initializePlayersSocket } from '../socketController/playerSocket';
import { io } from "socket.io-client";
import { currentPlayerDisconnected } from '../socketController/playerSocket';

/**
 * Initialize socket and connect to server by socket.io
 */
export function initializeSocket(self, peers) {

    self.socket = io();

    // Initialize audio stream for socket
    initializeAudio(self.socket, peers, self);

    // Initialize player socket
    initializePlayersSocket(self, peers);

    // IF PLAYER DISCONNECTED
    self.socket.on('disconnect', () => {
        self.errors = self.add.group();
        self.errors.add(self.add.rectangle(0, 0, 2000, 2000, 0x000000).setOrigin(0, 0).setAlpha(0.5));
        self.errors.add(self.add.text(self.player.x - 250, self.player.y - 100, 'Trying to reconnect...\n\nPlease check your internet\nconnection', { fontSize: '32px', fill: '#fff' }));
        const playerUI = self.playerUI[self.player.id];
        currentPlayerDisconnected(self.player.id);
        playerUI.playerText.destroy();
        playerUI.microphone.destroy();
        self.player.destroy();
        self.player = null;
    })
}