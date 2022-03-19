import Phaser from 'phaser';
import { initializeSocket } from '../socketController/socketController';
import { initMainMap, updatePlayerPosition, initKeysForController } from '../utils/utils';
import { createAnimationForPlayer } from "../anims/characterAnims";
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import { sceneEvents } from '../Events/EventsCenter';


/**
 * All peer connections
 */
let peers = {};

// Speed of all players
const spriteSpeed = 2;

var drawBattle, cancelButton;

// ON OVERLAP EFFECTS
var shadowGroup;
var musicMachineGroup;

var audio;

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
        }
    }

    preload() {
        initKeysForController(this);
        this.load.plugin('rexvirtualjoystickplugin', VirtualJoystickPlugin);
    }
    create() {
        musicMachineGroup = this.add.group();

        audio = new Audio('assets/music/still-loving-you.mp3');
        audio.play();
        audio.volume = 0.2;

        this.playerUI = {};
        // Create Animations for heroes
        for (let i = 0; i < 4; i++) {
            createAnimationForPlayer(this.anims, i);
        }

        // Add Game Ui
        this.scene.run('game-ui');


        initMainMap(this);
        this.add.image(230, 680, 'machine').setScale(0.1);


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
                bullShit.destroy();
            };
        });

        const self = this;
        function addDomElement() {
            const iframe = document.createElement('iframe');
            iframe.src = "https://drawbattle.io";
            iframe.style.width = "600px";
            iframe.style.height = "370px";
            drawBattle = self.add.dom(310, 670, iframe);
            cancelButton = self.add.image(535, 440, 'x-button').setScale(0.3).setInteractive().on('pointerdown', () => {
                drawBattle.destroy();
                drawBattle = null;
                cancelButton.destroy();
            });
        }

        shadowGroup = this.add.group();

        var keyIframe = this.input.keyboard.addKey('X');  // Get key object
        keyIframe.on('down', function (event) {
            if (shadowGroup.getChildren().length) {
                if (!drawBattle) addDomElement();
                else {
                    drawBattle.destroy();
                    drawBattle = null;
                    cancelButton.destroy();
                }
            }
        });

    }

    checkOverlap(a, b) {
        var boundsA = a.getBounds();
        var boundsB = b.getBounds();

        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }

    addMusicMachine() {

        // TEST MUSIC MACHINE
        musicMachineGroup.add(this.add.image(230, 680, 'retro-background'));
        musicMachineGroup.add(this.add.text(100, 550, '8 BIT MUSIC MACHINE', { fontSize: "24px", fill: "#ffffff" }));
        var songsArtists = ['Elvis Presley', 'Red Hot Chilli Peppers', 'Scorpions'];
        var songsNames = ['Can\'t Help Falling In Love', 'Californication', 'Still loving you'];
        var songs = ['elvis.mp3', 'californication.mp3', 'still-loving-you.mp3'];
        musicMachineGroup.add(this.add.image(525, 543, 'x-button').setScale(0.3));
        for (let i = 0; i < songsArtists.length; i++) {
            musicMachineGroup.add(this.add.text(0, 600 + i * 60, songsArtists[i], { fontSize: "20px", fill: "#ffffff" }));
            musicMachineGroup.add(this.add.text(0, 620 + i * 60, songsNames[i], { fontSize: "14px", fill: "#ffffff" }));
            musicMachineGroup.add(this.add.image(400, 620 + i * 60, 'background-button').setScale(1.3)
            .setInteractive().on('pointerdown', () => {
                audio.pause();
                audio = new Audio(`assets/music/${songs[i]}`);
                audio.play();
                audio.volume = 0.2;
            }));
            musicMachineGroup.add(this.add.text(380, 610 + i * 60, 'PLAY', { fontSize: "14px", fill: "#000000" }));
        }
    }
    addShadow() {
        let x = 200;
        let y = 650;
        let w = 130;
        let h = 60;
        shadowGroup.add(this.add.rectangle(0, y + 500, 2000, 950, 0x000000).setAlpha(0.4));
        shadowGroup.add(this.add.rectangle(0, y - 145, 2000, 200, 0x000000).setAlpha(0.4));
        shadowGroup.add(this.add.rectangle(0, y - 10, 270, h + 10, 0x000000).setAlpha(0.4));
        shadowGroup.add(this.add.rectangle(x + w + 175, y - 10, 500, h + 10, 0x000000).setAlpha(0.4));
        shadowGroup.add(this.add.image(180, 650, 'play-button').setScale(0.1).setAlpha());
        shadowGroup.add(this.add.text(150, 700, 'PRESS X', { fill: "#ffffff" }));

    }

    update(time, delta) {
        if (audio) {
            console.log(audio.currentTime, audio.duration);
        }
        if (this.player) {
            this.animatedTiles.forEach(tile => tile.update(delta));
            if (this.checkOverlap(this.player, this.rectangleTrigger)) {
                if (!this.trigger) {
                    this.addShadow();
                }
                this.trigger = true;
            }
            else {
                this.trigger = false;
                shadowGroup.clear(true);
            }
            if (this.checkOverlap(this.player, this.machineTrigger)) {
                if (!this.trigger1) {
                    this.addMusicMachine();
                }
                this.trigger1 = true;
            }
            else {
                this.trigger1 = false;
                musicMachineGroup.clear(true);
            }
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
            if (!drawBattle) {
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


