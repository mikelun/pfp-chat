import Phaser from 'phaser';
import { initializeSocket } from '../socketController/socketController';
import { initMainMap, updatePlayerPosition, initKeysForController } from '../utils/utils';
import { createAnimationForNFTBackround, createAnimationForPlayer } from "../anims/characterAnims";
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
import { initializeAudioStream, initializeUserOnOtherTab } from './Audio/audioMicrophoneStream';
import { initializeWeapon, updateWeapon } from './Weapons/weapon';
import { initialAnimations } from '../utils/initialAnimations';
import { initializePlayerEffects } from './GameView/playerEffects';
import { clearPlayerUI } from './GameView/addPlayersUtils';
/**
 * All peer connections
 */
let peers = {};

let currentPlayers;

export class MainScene extends Phaser.Scene {

    constructor(stream) {
        super({ key: 'MainScene' });
    }

    init(data) {
        this.microphoneEnabled = data.microphoneEnabled;

        this.room = data.room;

        // ADD MORALIS FOR BLOCKCHAIN
        this.moralis = data.moralis;

        // ADD METAMASK ADDRESS
        this.address = data.address;

        this.socket = data.socket;

        currentPlayers = data.currentPlayers;

        this.playerCoins = data.player.coins;
        this.mapId = data.player.mapId;
        this.nftImage = data.player.nft;

        this.isHome = data.player.isHome;

        this.changedTiles = data.changedTiles;
        this.playerName = data.player.playerName;

    }

    preload() {
        // INITIALIZE KEYS
        initKeysForController(this);

        // LOAD PLUGIN FOR VIRTUAL JOYSTICK
        this.load.plugin('rexvirtualjoystickplugin', VirtualJoystickPlugin);
    }
    create() {
        // Add Game Ui
        this.scene.run('game-ui', {
            mapId: this.mapId,
            playerCoins: this.playerCoins,
            nftImage: this.nftImage,
            isHome: this.isHome,
            playerName: this.playerName
        });

        initialAnimations(this);

        // first entrance
        this.firstEntrance = true;

        // add UI for each player (microphone, name, etc)
        this.playerUI = {};

        // MAIN 2 layers
        this.layer1 = this.add.layer();
        this.layer2 = this.add.layer();
        this.layer2.setDepth(100);

        // initialize with id
        showMap(this, this.mapId);

        // initializing server
        initializeSocket(this, peers, currentPlayers);

        // initialize effects : talking effect, host effect etc
        initializePlayerEffects(this);
        
        // if user of other tab, stop microphone stream
        initializeUserOnOtherTab(this);

        // INITIAlIZE AMPLITUDE (Util for analytics)
        initializeAmplitude();

        // add main camera zoom
        this.cameras.main.setZoom(2);

        initializeAudioStream(this);

        // add keyboard events
        keyboardEvents(this);;

        // Create Animations for guest characters
        for (let i = 0; i < 33; i++) {
            createAnimationForPlayer(this.anims, i);
        }

        createAnimationForNFTBackround(this.anims, 1);

        // add joystic if android
        addJoysticIfAndroid(this);

        // set timeout clear UI - FIXING BUG WITH NOT DELETING UI
        setInterval(() => {
            for (let playerId in this.playerUI) {
                var fl = false;
                if (this.otherPlayers) {
                    this.otherPlayers.getChildren().forEach(child => {
                        if (child.playerId == playerId) {
                            fl = true;
                            return;
                        }
                    });
                }
                if (this.player && playerId == this.player.id) fl = true;
                if (!fl) {
                    clearPlayerUI(this.playerUI[playerId]);
                }
            }
        }, 5000);
    }

    update(time, delta) {
        // animate tiles for main map
        if (this.animatedTiles) this.animatedTiles.forEach(tile => tile.update(delta));

        if (this.player) {
            // update function for map
            addUpdateForMap(this, this.mapId, time, delta);

            // update a player position
            updatePlayerPosition(this);

            // send player position to server after 25 ms
            sendPlayerPosition(this, time);

            // update players in player talk rectangle
            updatePeopleForTalk(this);

            // if weapon -> update weapon
            updateWeapon(this);

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
    if (!self.player) return;

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
    if (!self.player) return;

    let currentTime = Math.floor(time / 25);
    if (currentTime != self.lastTime) {
        emitPlayerPosition(self);
    }
    self.lastTime = currentTime;
}


function updatePeopleForTalk(self) {
    if (!self.player) return;

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