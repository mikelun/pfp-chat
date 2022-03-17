import Phaser from 'phaser';
import { initializeSocket } from '../socketController/socketController';
import { initMainMap, updatePlayerPosition, initKeysForController } from '../utils/utils';
import { createAnimationForPlayer } from "../anims/characterAnims";
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import { sceneEvents } from '../Events/EventsCenter';
import e from 'cors';


/**
 * All peer connections
 */
let peers = {};

// Speed of all players
const spriteSpeed = 2;

// BACKGROUND
var map;

export class MainScene extends Phaser.Scene {

    constructor(stream) {
        super({ key: 'MainScene' });
    }

    init(stream) {
        this.localStream = stream;
        this.toggleMute();
    }

    preload() {
        initKeysForController(this);
        this.load.plugin('rexvirtualjoystickplugin', VirtualJoystickPlugin);
    }
    create() {
        this.playerUI = {};
        // Create Animations for heroes
        for (let i = 0; i < 4; i++) {
            createAnimationForPlayer(this.anims, i);
        }

        // Add Game Ui
        this.scene.run('game-ui');


        initMainMap(this);
        
        // Set camera zoom to 3
        this.cameras.main.setZoom(1.5);
        //this.cameras.main.setBounds(0, 0, 1000, 1000);

        initializeSocket(this, peers);

        this.playerName = this.add.text(0, 0, 'sad.eth', { fontFamily: 'monospace', fill: '#CCFFFF' })

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
            this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
                x: 400,
                y: 470,
                radius: 50,
                base: this.add.circle(0, 0, 50, 0x888888),
                thumb: this.add.circle(0, 0, 25, 0xcccccc),
                // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
                // forceMin: 16,
                // enable: true
            });
            this.cursorKeys = this.joyStick.createCursorKeys();
        }

        sceneEvents.on('toggleMute', () => {
            if (this.localStream) {
                this.toggleMute();
            } else {
                navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
                    this.localStream = stream;
                    if (this.localStream) {
                        this.toggleMute();
                    }
                });
            }
        });

    }
    update() {
        if (this.player) {
            //console.log(this.player.x, this.player.y);
            // write text size of clibButton
            //console.log
            const playerUI = this.playerUI[this.socket.id];
            const playerText = playerUI.playerText;
            const textSize = playerText.text.length;
            playerText.x = this.player.x - textSize * 3.5;
            playerText.y = this.player.y - 27;

            playerUI.microphone.x = this.player.x;
            playerUI.microphone.y = this.player.y - 32;

            // update player position
            updatePlayerPosition(this);

            emitPlayerPosition(this);
        }
        if (this.otherPlayers) {
            this.otherPlayers.getChildren().forEach(otherPlayer => {
                const playerUI = this.playerUI[otherPlayer.playerId];
                const otherPlayerText = playerUI.playerText;
                otherPlayerText.x = otherPlayer.x - otherPlayerText.text.length * 3.5;
                otherPlayerText.y = otherPlayer.y - 25;
                playerUI.microphone.x = otherPlayer.x;
                playerUI.microphone.y = otherPlayer.y - 32;
            });
        }
    }

    toggleMute() {
        let localStream = this.localStream;
        for (let index in localStream.getAudioTracks()) {
            const localStreamEnabled = localStream.getAudioTracks()[index].enabled;
            localStream.getAudioTracks()[index].enabled = !localStreamEnabled;
            this.playerUI[this.socket.id].microphone.setTexture( localStreamEnabled ? 'microphone' :'microphoneMuted');
            // /console.log(localStreamEnabled);
            this.socket.emit("updatePlayerInfo", { microphoneStatus: localStreamEnabled}, this.socket.id);
            sceneEvents.emit("microphone-toggled", localStreamEnabled);
        }
    }
}



/**
 * Send player position to server
 * @param {this.player} player 
 */
function emitPlayerPosition(self) {
    var player = self.player;
    var socket = self.socket;
    // emit player movement
    var x = player.x;
    var y = player.y;
    var r = player.rotation;
    if (player.oldPosition && (x !== player.oldPosition.x || y !== player.oldPosition.y || r !== player.oldPosition.rotation)) {
        socket.emit('playerMovement', { x: player.x, y: player.y, rotation: player.rotation });
    }
    // save old position data
    player.oldPosition = {
        x: player.x,
        y: player.y,
        rotation: player.rotation
    };
}


