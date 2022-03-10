import Phaser from 'phaser';
import {initializeSocket} from '../socketController/socketController';
import {initMainMap} from '../utils/utils';
import {createCharacterAnims} from '../anims/characterAnims';
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
    }
    create() {
        
        //createCharacterAnims(this.anims);
       

        initMainMap(this);

        // Set camera zoom to 3
        this.cameras.main.setZoom(2);
        this.cameras.main.setBounds(0, 0, 1000, 1000);

        initializeSocket(this, peers);
   
    }

    update() {
        if (this.player) {
            this.player.update(keyUp, keyDown, keyLeft, keyRight, this.textureId); 
            emitPlayerPosition(this);
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