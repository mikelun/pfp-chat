import Phaser from 'phaser'
import { sendEventToAmplitude } from '../Analytics/amplitude';

import { sceneEvents } from '../Events/EventsCenter';
import { createAnimationsUI } from './GameUI-elements/animationsUI';
import { initializeHUD } from './GameUI-elements/hud';
import { createButtons } from './GameUI-elements/lowButttons';
import { initializeMusicPlayerPanel } from './GameUI-elements/musicPanel';
import { buildVoiceChatPanel, playersInVoiceChat, updateVoiceChatPanel } from './GameUI-elements/playersInVoiceChat';
import { createTalkIcons } from './GameUI-elements/talkIcons';
import { addTextBox } from './GameUI-elements/textBox';
import { addChat } from './GameUI-elements/textChat';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

var mapId, playerCoins, nftImage;

export class GameUi extends Phaser.Scene {
    constructor() {
        super({ key: "game-ui" });
    }
    init(data) {
        mapId = data.mapId;
        playerCoins = data.playerCoins;
        nftImage = data.nftImage;
    }

    create() {

        createAnimationsUI(this);
        
        // initializing player hud
        initializeHUD(this, playerCoins, nftImage);

        initializeMusicPlayerPanel(this, mapId)

        buildVoiceChatPanel(this);

        createButtons(this);
        // tip how to open text chat
        this.tipOpenChat = this.add.text(1000, 630, 'Press enter to open chat', { fontSize: '24px', fill: '#ffffff', fontFamily: 'PixelFont' });

        // write count of online players 
        this.onlinePlayers = this.add.text(1000, 650, 'Online: 1', { fontSize: '24px', fill: '#00FF66', fontFamily: 'PixelFont' });

        // NFTs dom objects on page
        this.currentNFTs = [];

        // icons for players list
        this.playerNFTIcons = [];

        // player list with microphone status
        this.playerList = this.add.group();

        // background for nfts(when nft is loading)
        this.backgroundNFTs = this.add.group();

        // panel for nfts
        this.panelNFTs = this.add.group();

        // get the game width and height
        const width = this.game.config.width;
        const height = this.game.config.height;


        // ADD ROOM TEXT
        this.roomText = this.add.text(width / 2 - 50, 40, '', { fontSize: '40px', fill: "#ffffff", fontFamily: 'PixelFont', align: 'center' });

        // add background for bottom buttons
        for (let i = 0; i < 4; i++) {
            //this.add.image(width / 3 + i * (width / 8), height * 0.90, 'new-ui-button').setScale(4);
        }


        // add microphone
        // this.add.image(width / 3 + 0 * (width / 8) - 2, height * 0.90 - 5, 'coffeebar-planet').setScale(1).setInteractive()
        //     .on('pointerdown', () => {
        //         toggleMusicPanel(this);
        // });

        // if microphone doesn't work show a red icon
        //this.microphoneIsWorking = this.add.image(width / 3 + 0 * (width / 8) - 3, height * 0.90 - 5, 'x').setScale(0.3).setAlpha(0.4);

        // add nft panel
        // this.add.image(width / 3 + 1 * (width / 8), height * 0.90 - 5, '2').setScale(1.5).setInteractive()
        //     .on('pointerdown', () => {
        //         if (this.backgroundNFTs) {
        //             this.backgroundNFTs.clear(true);
        //         }
        //         if (!this.getNFTPanelStatus()) {
        //             //this.roomText.setAlpha(0);
        //             this.blockNFTs = false;
        //             this.panelNFTs.getChildren().forEach(child => {
        //                 child.alpha = 1;
        //             });
        //             sceneEvents.emit('getNFTsFromPage', this.page);
        //         } else {
        //             this.panelNFTs.getChildren().forEach(child => {
        //                 child.setAlpha(0);
        //             })
        //             this.currentNFTs.forEach(nft => {
        //                 nft.destroy();
        //             });
        //         }
        //     });

        // add next buttons (dont make sense)
        // this.add.image(width / 3 + 2 * (width / 8), height * 0.90 - 3, 'github').setScale(0.08).setInteractive()
        //     .on('pointerdown', () => {
        //         // open twitter link
        //         window.open('https://github.com/mikelun/open-metaverse');
        //     });

        // this.add.image(width / 3 + 3 * (width / 8), height * 0.90 - 5, 'discord').setScale(0.25).setInteractive()
        //     .on('pointerdown', () => {
        //         // open twitter link
        //         sendEventToAmplitude('Tap on discord button');
        //         window.open('https://discord.gg/aU6QhyK8jZ');
        // });



        // SCENE EVENTS
        sceneEvents.on('microphone-toggled', this.handleMicrophoneStatus, this)

        sceneEvents.on('currentPlayers', this.updateCurrentPlayers, this);

        sceneEvents.on('newPlayerNFT', this.updateCurrentPlayers, this);

        sceneEvents.on('newMessage', this.addMessageToChat, this)

        sceneEvents.on('updateOnlinePlayers', this.updateOnlinePlayers, this);

        // ADD TEXT CHAT
        addChat(this);

        // create microphone and headphones
        createTalkIcons(this);

    }

    update(time, delta) {
        if (this.myAudio) {
            // to format XX:YY
            if (!this.myAudio.duration) {
                this.timeMusic.setText('LOADING...');
            } else {
                var timeText = Phaser.Utils.String.Pad(Math.floor(this.myAudio.currentTime / 60), 2, '0', 1) + ':' + Phaser.Utils.String.Pad(Math.floor(this.myAudio.currentTime % 60), 2, '0', 1) + ' / ' + Phaser.Utils.String.Pad(Math.floor(this.myAudio.duration / 60), 2, '0', 1) + ':' + Phaser.Utils.String.Pad(Math.floor(this.myAudio.duration % 60), 2, '0', 1);
                this.timeMusic.setText(timeText);
            }
        }
    }
    addMessageToChat(message, playerName) {

    }

    handleMicrophoneStatus(status) {
        if (status) {
            this.microphoneIsWorking.alpha = 0;
        } else {
            this.microphoneIsWorking.alpha = 0.4;
        }
    }

    updateOnlinePlayers(onlinePlayers) {
        this.onlinePlayers.setText(`Online: ${onlinePlayers}`);
    }

    updateCurrentPlayers(players, playerName) {
        updateVoiceChatPanel(this, players, playerName);
    }



}
