import Phaser from 'phaser';
import { initializeSocket } from '../socketController/socketController';
import { initMainMap, updatePlayerPosition, initKeysForController } from '../utils/utils';
import { createAnimationForPlayer } from "../anims/characterAnims";
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import { sceneEvents } from '../Events/EventsCenter';
import { addJoysticIfAndroid } from '../utils/pluginJoystic';
import { addIframeGameAndMusicMachine } from '../utils/addIframeGameAndMusicMachine';
import { addPlayerOverlap, checkOverlap } from '../utils/playerOverlap';
import { updateOtherPlayersPositions } from '../utils/updatePlayersPositions';
import { addFollowingUI } from '../utils/addFollowingUi';
import { addAudioTimer } from '../utils/addAudioTimer';
import { addUpdateForMap, showMap } from '../MapBuilding/showMap';
import { showPlayersToTalk } from '../socketController/playerSocket';
import { initializeAmplitude } from '../Analytics/amplitude';
import { initializeAudioStream } from './Audio/audioMicrophoneStream';
/**
 * All peer connections
 */
let peers = {};


export class MainScene extends Phaser.Scene {

    constructor(stream) {
        super({ key: 'MainScene' });
    }

    init(data) {
        if (data.stream) {
            // local stream of user microphone
            this.localStream = data.stream;

            // DISABLE MICROPHONE AT FIRST
            for (let index in this.localStream.getAudioTracks()) {
                this.localStream.getAudioTracks()[index].enabled = false;
            }
        }

        this.room = data.room;
        // ADD MORALIS FOR BLOCKCHAIN
        this.moralis = data.moralis;

        // ADD METAMASK ADDRESS
        this.address = data.address;
    }

    preload() {
        // INITIALIZE KEYS
        initKeysForController(this);

        // LOAD PLUGIN FOR VIRTUAL JOYSTICK
        this.load.plugin('rexvirtualjoystickplugin', VirtualJoystickPlugin);
    }
    create() {

        

        var myAudio = new Audio('https://cdn.pixabay.com/download/audio/2021/12/15/audio_2c108c888f.mp3?filename=notes-piano-lofi-hiphop-12209.mp3');
        if (typeof myAudio.loop == 'boolean') {
            myAudio.loop = true;
        }
        else {
            myAudio.addEventListener('ended', function () {
                this.currentTime = 0;
                this.play();
            }, false);
        }
        // add speed 4x
        //myAudio.playbackRate = 10;
        myAudio.play();

        // INITIAlIZE AMPLITUDE (Util for analytics)
        initializeAmplitude();

        if (this.room == 'buildship') {
            this.mapId = 2;
        } else if (this.room == 'coffeebar') {
            this.mapId = 4;
        } else {
            this.mapId = 3;
        }
        localStorage.removeItem('playerInfo');
        //localStorage.clear();
        this.layer1 = this.add.layer();
        this.layer2 = this.add.layer();

        // add main camera zoom
        this.cameras.main.setZoom(2);

        initializeAudioStream(this);

        // add keyboard events
        keyboardEvents(this);
        // fix problem with touching space
        //var keyObj = this.input.keyboard.addKey('SPACE');  // Get key object
        //keyObj.on('down', function (event) { });

        // add UI for each player (microphone, name, etc)
        this.playerUI = {};

        // Create Animations for heroes
        for (let i = 0; i < 50; i++) {
            createAnimationForPlayer(this.anims, i);
        }

        // Add Game Ui
        this.scene.run('game-ui');

        // initialize with id
        showMap(this, this.mapId);


        // Initialize socket for client - server application
        initializeSocket(this, peers);

        // add joystic if android
        addJoysticIfAndroid(this);

    }

    update(time, delta) {
        // animate tiles for main map
        if (this.animatedTiles) this.animatedTiles.forEach(tile => tile.update(delta));

        if (this.player) {
            // update function for map
            addUpdateForMap(this, this.mapId, time, delta);

            // update a position of player UI
            addFollowingUI(this);

            // update a player position
            updatePlayerPosition(this);

            // send player position to server after 25 ms
            sendPlayerPosition(this, time);

            updatePeopleForTalk(this);

            // update local storage every 1 second
            updateLocalStorage(this, time);

            // if player on scene
            updatePlayerScenePositon(this);

        }

        // update other players positions with interpolation
        if (this.otherPlayers) {
            updateOtherPlayersPositions(this, delta);
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

function sendPlayerPosition(self, time) {
    let currentTime = Math.floor(time / 25);
    if (currentTime != self.lastTime) {
        emitPlayerPosition(self);
    }
    self.lastTime = currentTime;
}


function updatePeopleForTalk(self) {
    // if player turn off headphones(deafen mode)
    if (self.deafen) return;

    // update player rectangle
    if (self.player) {
        self.talkRectangle.x = self.player.x;
        self.talkRectangle.y = self.player.y;
    }

    self.connected.forEach(otherPlayer => {
        if (!checkOverlap(otherPlayer, self.talkRectangle)) {
            // remove from connected)
            self.socket.emit('removeFromTalk', otherPlayer.playerId);
            self.connected.splice(self.connected.indexOf(otherPlayer), 1);
            showPlayersToTalk();
        }
    });

    if (self.otherPlayers) {
        self.otherPlayers.getChildren().forEach(otherPlayer => {
            if (checkOverlap(otherPlayer, self.talkRectangle) && !self.connected.includes(otherPlayer)) {
                // add to connected
                self.socket.emit('addToTalk', otherPlayer.playerId);
                console.log('player with id: ' + otherPlayer.name + ' is in talk rectangle');
                self.connected.push(otherPlayer);
                showPlayersToTalk();
            }
        });
    }
}

export function removeAllPeopleFromTalk(self) {
    self.connected.forEach(otherPlayer => {
        self.socket.emit('removeFromTalk', otherPlayer.playerId);
    });
    self.connected = [];
    showPlayersToTalk();
}

function updateLocalStorage(self, time) {
    let currentTime = Math.floor(time / 1000);
    if (currentTime != self.lastTimeLocalStorage) {
        const playerInfo = {
            x: self.player.x,
            y: self.player.y,
            textureId: self.textureId,
            nft: self.nft,
            room: self.room,
        };
        localStorage.setItem('playerInfo', JSON.stringify(playerInfo));
        console.log(playerInfo.x, playerInfo.y);
    }
    self.lastTimeLocalStorage = currentTime;
}

function updatePlayerScenePositon(self) {
    // if (!self.scene) return;
    // if (checkOverlap(self.player, self.scene)) {
    //     if (self.onScene) return;
    //     self.onScene = true;
    //     //self.socket.emit('AddToAllPeers');
    // } else {
    //     self.onScene = false;
    // }
}

function keyboardEvents(self) {
    //TODO: ADD ZOOM OUT AND ZOOM IN FOR CAMERA, IF KEY V TAPPED
}