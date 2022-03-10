import { initiateAudio, removePeer } from '../audioSocket';
import { initializePlayersSocket } from '../playerSocket';
import Phaser from 'phaser';
import { io } from "socket.io-client";
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

        initKeysForMoving(this);

        initMainMap(this);

        this.cameras.main.setZoom(3);




        // ANIMS
        const anims = this.anims;
        anims.create({
            key: "player-walk",
            frames: anims.generateFrameNumbers("characters", { start: 46, end: 49 }),
            frameRate: 16,
            repeat: -1
        });
        anims.create({
            key: "player-walk-back",
            frames: anims.generateFrameNumbers("characters", { start: 65, end: 68 }),
            frameRate: 16,
            repeat: -1
        });


        var self = this;
        this.socket = io('ws://localhost:3000');
        socket = this.socket;


        // Initialize audio stream for socket
        initiateAudio(socket, peers);

        // Initialize player socket
        initializePlayersSocket(self, peers);


        socket.on('disconnected', (socket_id) => {
            console.log('disconnected');

            this.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (socket_id === otherPlayer.playerId) {
                    otherPlayer.destroy();
                }
            });
            for (let socket_id in peers) {
                removePeer(socket_id)
            }
        });
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
function initKeysForMoving(self) {
    keyUp = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyDown = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyLeft = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyRight = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
}

/**
 * Initialize main tile map
 * @param {Scene} self 
 */
function initMainMap(self) {
    const dungeon = self.make.tilemap({ key: 'dungeon' });
    const tileset = dungeon.addTilesetImage('indoors', 'tiles');
    dungeon.createStaticLayer('background', tileset);
    dungeon.createStaticLayer('structure', tileset);
}