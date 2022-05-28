import Phaser from 'phaser'
import { sendEventToAmplitude } from '../Analytics/amplitude';

import { sceneEvents } from '../Events/EventsCenter';
import { createAnimationsUI } from './GameUI-elements/animationsUI';
import { initalizeCopyLinkButton } from './GameUI-elements/copyLinkButton';
import { editHome } from './GameUI-elements/editHome';
import { initializeErrors } from './GameUI-elements/errorPanel';
import { initializeHUD } from './GameUI-elements/hud';
import { initializeLoadingPanel } from './GameUI-elements/loadingPanel';
import { createButtons } from './GameUI-elements/lowButttons';
import { initializeMusicPlayerPanel } from './GameUI-elements/musicPanel';
import { buildVoiceChatPanel, playersInVoiceChat, updateVoiceChatPanel } from './GameUI-elements/playersInVoiceChat';
import { initialiezeSpacePanel } from './GameUI-elements/spacePanel';
import { createTalkIcons } from './GameUI-elements/talkIcons';
import { addTextBox } from './GameUI-elements/textBox';
import { addChat } from './GameUI-elements/textChat';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

var mapId, playerCoins, nftImage, spaceId;

export class GameUi extends Phaser.Scene {
    constructor() {
        super({ key: "game-ui" });
    }
    init(data) {
        mapId = data.mapId;
        playerCoins = data.playerCoins;
        nftImage = data.nftImage;
        this.isHome = data.isHome;
        this.playerName = data.playerName;
        spaceId = data.spaceId;
    }

    create() {

        createAnimationsUI(this);

        // initialize popup errors
        initializeErrors(this);

        // initializing loading panel
        initializeLoadingPanel(this);

        // initializing player hud
        initializeHUD(this, playerCoins, nftImage);

        initializeMusicPlayerPanel(this, mapId)

        buildVoiceChatPanel(this);

        createButtons(this);

        initialiezeSpacePanel(this);

        initalizeCopyLinkButton(this, {spaceId: spaceId});


        // tip how to open text chat
        this.tipOpenChat = this.add.text(18, 620, 'Press enter to open chat', { fontSize: '24px', fill: '#ffffff', fontFamily: 'PixelFont' }).setAlpha(0.8);

        // write count of online players 
        this.onlinePlayers = this.add.text(1000, 650, 'Online: 1', { fontSize: '24px', fill: '#00FF66', fontFamily: 'PixelFont' }).setAlpha(0);

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
        

        // SCENE EVENTS
        sceneEvents.on('microphone-toggled', this.handleMicrophoneStatus, this)

        sceneEvents.on('currentPlayers', this.updateCurrentPlayers, this);

        sceneEvents.on('newPlayerNFT', this.updateCurrentPlayers, this);

        sceneEvents.on('newMessage', this.addMessageToChat, this)

        sceneEvents.on('updateOnlinePlayers', this.updateOnlinePlayers, this);

        sceneEvents.on('updateIsHome', this.updateIsHome, this);

        sceneEvents.on('updatePlayerName', (name) => {
            this.playerName = name;
        });

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

    updateIsHome(isHome) {
        this.isHome = isHome;
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

    updateCurrentPlayers(players) {
        updateVoiceChatPanel(this, players);
    }
}
