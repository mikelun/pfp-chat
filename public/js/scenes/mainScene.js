import Phaser from 'phaser';
import { initializeSocket } from '../socketController/socketController';
import { initMainMap, updatePlayerPosition, initKeysForController } from '../utils/utils';
import { createAnimationForPlayer } from "../anims/characterAnims";
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import { sceneEvents } from '../Events/EventsCenter';
import { addMusicMachine } from "./scene-elements/music-machine";
import { getPlayerNFT } from '../web3/GetPlayerNFT';


import web3 from 'web3'
/**
 * All peer connections
 */
let peers = {};

// Speed of all players
const spriteSpeed = 2;

var drawBattle, cancelButton;

// ON OVERLAP EFFECTS
var drawbattleGroup;

var musicMachineShadowGroup;


export class MainScene extends Phaser.Scene {

    constructor(stream) {
        super({ key: 'MainScene' });
    }

    init(data) {
        if (data.stream != false) {
            this.localStream = data.stream;
            let localStream = this.localStream;
            for (let index in localStream.getAudioTracks()) {
                const localStreamEnabled = localStream.getAudioTracks()[index].enabled;
                localStream.getAudioTracks()[index].enabled = !localStreamEnabled;
            }
            this.moralis = data.moralis;
            console.log("MORALIS", this.moralis);
        }
    }

    preload() {
        initKeysForController(this);
        this.load.plugin('rexvirtualjoystickplugin', VirtualJoystickPlugin);
    }
    create() {
        // const w3 = new web3(window.ethereum);
        // console.log(w3.eth.getAccounts());
        this.audio = null;
        this.musicMachineGroup = this.add.group();
        musicMachineShadowGroup = this.add.group();

        this.playerUI = {};
        // Create Animations for heroes
        for (let i = 0; i < 50; i++) {
            createAnimationForPlayer(this.anims, i);
        }

        // Add Game Ui
        this.scene.run('game-ui');


        initMainMap(this);
        this.add.image(230, 680, 'machine').setScale(0.1);
        this.musicMachineShadow();

        this.ball = this.physics.add.image(550, 910, 'ball').setScale(0.08).setBounce(0.9).setVelocity(0, 0);

        //this.ball.body.bounce.setTo(1, 1);
        // Set camera zoom to 3
        this.cameras.main.setZoom(1.5);
        //this.cameras.main.setBounds(0, 0, 1000, 1000);

        initializeSocket(this, peers);

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
            };
        });

        const self = this;
        function addDomElement() {
            const iframe = document.createElement('iframe');
            iframe.src = "https://funhtml5games.com/pacman/index.html";
            iframe.style.width = "350px";
            iframe.style.height = "370px";
            drawBattle = self.add.dom(230, 670, iframe);
            cancelButton = self.add.image(535, 440, 'x-button').setScale(0.3).setInteractive().on('pointerdown', () => {
                drawBattle.destroy();
                drawBattle = null;
                cancelButton.destroy();
            });
        }

        drawbattleGroup = this.add.group();

        var keyIframe = this.input.keyboard.addKey('X');  // Get key object
        keyIframe.on('down', function (event) {
            if (drawbattleGroup.getChildren().length) {
                if (!drawBattle) addDomElement();
                else {
                    drawBattle.destroy();
                    drawBattle = null;
                    cancelButton.destroy();
                }
            }
            if (musicMachineShadowGroup.getChildren().length) {
                if (!(self.musicMachineGroup.getChildren().length > 0)) {
                    addMusicMachine(self);
                } else {
                    self.musicMachineGroup.clear(true);
                }
            }


        });

        //this.addMusicMachine()
    }

    checkOverlap(a, b) {
        var boundsA = a.getBounds();
        var boundsB = b.getBounds();

        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }

    drawbattleShadow() {
        let x = 200;
        let y = 650;
        let w = 130;
        let h = 60;
        drawbattleGroup.add(this.add.rectangle(0, y + 500, 2000, 950, 0x000000).setAlpha(0.4));
        drawbattleGroup.add(this.add.rectangle(0, y - 145, 2000, 200, 0x000000).setAlpha(0.4));
        drawbattleGroup.add(this.add.rectangle(0, y - 10, 270, h + 10, 0x000000).setAlpha(0.4));
        drawbattleGroup.add(this.add.rectangle(x + w + 175, y - 10, 500, h + 10, 0x000000).setAlpha(0.4));
        drawbattleGroup.add(this.add.image(180, 650, 'play-button').setScale(0.1).setAlpha());
        drawbattleGroup.add(this.add.text(150, 700, 'PRESS X', { fill: "#ffffff" }));

    }

    musicMachineShadow() {
        let x = 225;
        let y = 680;
        musicMachineShadowGroup.add(this.add.image(x + 30, y - 40, 'comment').setScale(0.2));
        musicMachineShadowGroup.add(this.add.text(x - 9, y - 60, 'PRESS X\nTO INTERACT', { fontSize: "60px", fill: "#000000" }).setScale(0.2));
    }

    update(time, delta) {
        let audio = this.audio;
        if (audio && this.timeMusic && audio.duration) {
            let currentMin = Math.floor(audio.currentTime / 60);
            let currentSec = Math.floor(audio.currentTime) % 60;
            let durationMin = Math.floor(audio.duration / 60);
            let durationSec = Math.floor(audio.duration) % 60;
            if (currentSec < 10) currentSec = '0' + currentSec;
            this.timeMusic.setText(`${currentMin}:${currentSec}/${durationMin}:${durationSec}`)
        }
        if (this.player) {
            this.animatedTiles.forEach(tile => tile.update(delta));
            if (this.checkOverlap(this.player, this.rectangleTrigger)) {
                if (!this.trigger) {
                    this.drawbattleShadow();
                }
                this.trigger = true;
            }
            else {
                this.trigger = false;
                drawbattleGroup.clear(true);
            }
            if (this.checkOverlap(this.player, this.machineTrigger)) {
                if (!this.trigger1) {
                    this.musicMachineShadow();
                }
                this.trigger1 = true;
            }
            else {
                this.trigger1 = false;
                if (musicMachineShadowGroup) musicMachineShadowGroup.clear(true);
                //if (this.musicMachineGroup) this.musicMachineGroup.clear(true);
            }
            //console.log(this.player.x, this.player.y);
            // write text size of clibButton
            //console.log
            const playerUI = this.playerUI[this.socket.id];
            if (playerUI) {
                const playerText = playerUI.playerText;
                if (playerText) {
                    const textSize = playerText.text.length;
                    playerText.x = this.player.x - textSize * 3.5;
                    playerText.y = this.player.y - 27;
                }
                playerUI.microphone.x = this.player.x;
                playerUI.microphone.y = this.player.y - 32;
            }
            // update player position
            if (!drawBattle && !(this.musicMachineGroup.getChildren().length > 0)) {
                updatePlayerPosition(this);

                emitPlayerPosition(this);
            }
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
            let localStreamEnabled = localStream.getAudioTracks()[index].enabled;
            localStream.getAudioTracks()[index].enabled = !localStreamEnabled;

            localStreamEnabled = !localStreamEnabled;

            this.playerUI[this.socket.id].microphone.setTexture(localStreamEnabled ? 'microphone' : 'microphoneMuted');

            this.socket.emit("updatePlayerInfo", { microphoneStatus: localStreamEnabled }, this.socket.id);
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
