import Phaser from 'phaser';
import { initializeSocket } from '../socketController/socketController';
import { initMainMap } from '../utils/utils';
import { createCharacterAnims } from '../anims/characterAnims';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js'
/**
 * Socket.io socket
 */
let socket;

/**
 * All peer connections
 */
let peers = {};


// KEYS
var keyUp, keyDown, keyLeft, keyRight;

// Speed of all players
const spriteSpeed = 2;

// BACKGROUND
var map;

export class MainScene extends Phaser.Scene {

    constructor() {
        super({ key: 'MainScene' })
    }

    preload() {
        initKeysForController(this);
        this.load.plugin('rexvirtualjoystickplugin', VirtualJoystickPlugin);
    }
    create() {

        // Add Game Ui
        this.scene.run('game-ui');


        initMainMap(this);

        // Set camera zoom to 3
        this.cameras.main.setZoom(2);
        this.cameras.main.setBounds(0, 0, 1000, 1000);

        initializeSocket(this, peers);

        this.playerName = this.add.text(0, 0, 'sad.eth', { fontFamily: 'monospace', fill: '#CCFFFF'})
            .setInteractive()
            .on('pointerdown', () => {
                toggleMute(this);
        });

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

    }
    updateClickCountText(clickCount) {
        this.clickCountText.setText(`Button has been clicked ${clickCount} times.`);
    }
    update() {
        if (this.player) {
            // write text size of clibButton
            const textSize = this.playerName.text.length;
            this.playerName.x = this.player.x - textSize * 4;
            this.playerName.y = this.player.y - 35;
            // update player position
            updatePlayerPosition(this);

            emitPlayerPosition(this);
        }
    }
}

/**
* Enable/disable microphone
*/
function toggleMute(self) {
    let localStream = self.localStream;
    if (localStream) {
        for (let index in localStream.getAudioTracks()) {
            localStream.getAudioTracks()[index].enabled = !localStream.getAudioTracks()[index].enabled
            self.playerName.setText(localStream.getAudioTracks()[index].enabled ? "Unmuted" : "Muted");
        }
    }
}
/**
 * Intialize keys for controller
 * @param {Scene} self 
 */
function initKeysForController(self) {
    keyUp = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyDown = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyLeft = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyRight = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

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


function updatePlayerPosition(self) {
    if (self.cursorKeys) {
        self.player.update(
            keyUp,
            keyDown,
            keyLeft,
            keyRight, 
            self.cursorKeys.up,
            self.cursorKeys.down,
            self.cursorKeys.left,
            self.cursorKeys.right,
            self.textureId, 

        );
    }
    else {
        self.player.update(
            keyUp,
            keyDown,
            keyLeft,
            keyRight,
            false,
            false,
            false,
            false,
            self.textureId
        );
    }
}