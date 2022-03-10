import Phaser from 'phaser';
import {initializeSocket} from '../socketController/socketController';
import {initMainMap} from '../utils/utils';

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


    create() {

        initKeysForController(this);

        initMainMap(this);

        // Set camera zoom to 3
        this.cameras.main.setZoom(3);

        initializeSocket(this, peers);
   
    }

    update() {
        if (this.sprite) {

            var sprite = this.sprite;
            if (keyUp.isDown) {
                sprite.y -= spriteSpeed;
                //this.sprite.rotation = -3.14;
            }
            if (keyDown.isDown) {
                sprite.y += spriteSpeed;
                //this.sprite.rotation = 0;
            }
            if (keyLeft.isDown) {
                sprite.x -= spriteSpeed;
                //this.sprite.rotation = 3.14 / 2;
                sprite.setFlipX(true);
            }
            if (keyRight.isDown) {
                sprite.x += spriteSpeed;
                //this.sprite.rotation = -3.14 / 2;
                sprite.setFlipX(false);
            }

            if (keyLeft.isDown || keyRight.isDown || keyDown.isDown) {
                sprite.anims.play("player-walk", true);
            } else if (keyUp.isDown) {
                sprite.anims.play("player-walk-back", true);
            } else {
                sprite.anims.stop();
            }


            // emit player movement
            var x = this.sprite.x;
            var y = this.sprite.y;
            var r = this.sprite.rotation;
            if (this.sprite.oldPosition && (x !== this.sprite.oldPosition.x || y !== this.sprite.oldPosition.y || r !== this.sprite.oldPosition.rotation)) {
                this.socket.emit('playerMovement', { x: this.sprite.x, y: this.sprite.y, rotation: this.sprite.rotation });
            }
            // save old position data
            this.sprite.oldPosition = {
                x: this.sprite.x,
                y: this.sprite.y,
                rotation: this.sprite.rotation
            };
        }

    }
}

/**
 * Intialize keys for controller
 * @param {Scene} self 
 */
function initKeysForController(self) {
    console.log("HERE");
    keyUp = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyDown = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyLeft = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyRight = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    console.log(self);
}