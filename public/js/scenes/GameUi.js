import Phaser from 'phaser'
import { sendEventToAmplitude } from '../Analytics/amplitude';

import { sceneEvents } from '../Events/EventsCenter';
import { initializeMusicPlayerPanel } from './GameUI-elements/musicPanel';
import { createTalkIcons } from './GameUI-elements/talkIcons';
import { addTextBox } from './GameUI-elements/textBox';
import { addChat } from './GameUI-elements/textChat';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export class GameUi extends Phaser.Scene {
    constructor() {
        super({ key: "game-ui" });
    }

    create() {

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

        initializeMusicPlayerPanel(this);

        // ADD ROOM TEXT
        this.roomText = this.add.text(width / 2 - 50, 50, '', { fontSize: '40px', fill: "#ffffff", fontFamily: 'PixelFont', align: 'center' });

        // add background for bottom buttons
        for (let i = 0; i < 4; i++) {
            this.add.image(width / 3 + i * (width / 8), height * 0.90, 'player').setScale(2.5);
        }


        // add microphone
        this.add.image(width / 3 + 0 * (width / 8) - 2, height * 0.90 - 5, 'coffeebar-planet').setScale(1).setInteractive()
            .on('pointerdown', () => {

            });

        // if microphone doesn't work show a red icon
        //this.microphoneIsWorking = this.add.image(width / 3 + 0 * (width / 8) - 3, height * 0.90 - 5, 'x').setScale(0.3).setAlpha(0.4);

        // add nft panel
        this.add.image(width / 3 + 1 * (width / 8), height * 0.90 - 5, '2').setScale(1.5).setInteractive()
            .on('pointerdown', () => {
                if (this.backgroundNFTs) {
                    this.backgroundNFTs.clear(true);
                }
                if (!this.getNFTPanelStatus()) {
                    //this.roomText.setAlpha(0);
                    this.panelNFTs.getChildren().forEach(child => {
                        child.alpha = 1;
                    });
                    sceneEvents.emit('getNFTsFromPage', this.page);
                } else {
                    //this.roomText.setAlpha(1);
                    this.panelNFTs.getChildren().forEach(child => {
                        child.alpha = 0;
                    })
                    this.currentNFTs.forEach(nft => {
                        nft.destroy();
                    });
                }
            });

        // add next buttons (dont make sense)
        this.add.image(width / 3 + 2 * (width / 8), height * 0.90 - 3, 'github').setScale(0.08).setInteractive()
            .on('pointerdown', () => {
                // open twitter link
                window.open('https://github.com/mikelun/open-metaverse');
            });

        this.add.image(width / 3 + 3 * (width / 8), height * 0.90 - 5, 'discord').setScale(0.25).setInteractive()
            .on('pointerdown', () => {
                // open twitter link
                sendEventToAmplitude('Tap on discord button');
                window.open('https://discord.gg/aU6QhyK8jZ');
            });



        // SCENE EVENTS
        sceneEvents.on('microphone-toggled', this.handleMicrophoneStatus, this)

        sceneEvents.on('currentPlayers', this.updateCurrentPlayers, this);

        sceneEvents.on('newPlayerNFT', this.updateCurrentPlayers, this);

        sceneEvents.on('makeNFTsPanel', this.addInitialNFTPage, this);

        sceneEvents.on('getNFTsFromPageResult', this.addNFTsForPage, this);

        sceneEvents.on('updateRoomText', this.updateRoomText, this);

        sceneEvents.on('newMessage', this.addMessageToChat, this)

        sceneEvents.on('updateOnlinePlayers', this.updateOnlinePlayers, this);
        // ADD PANEL FOR NFTS
        this.makePanelForNFTs();

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

    updateRoomText(room) {
        this.roomText.x -= room.length * 4;
        this.roomText.setText(`Room:${room.toUpperCase()}`);
    }
    getNFTPanelStatus() {
        return this.panelNFTs.getChildren()[0].alpha == 0 ? false : true;
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
        this.playerName = playerName;

        // CLEAR ALL PLAYER LIST
        this.playerNFTIcons.forEach(nft => {
            nft.destroy();
        });
        this.playerList.clear(true);


        const self = this;
        // ADD PLAYERS
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            const playerNameText = player.name;
            this.playerList.add(this.add.image(120, 60 + i * 65, "pixel-box").setScale(0.3, 0.3))
            if (player.nft) {
                const nft = player.nft;
                const dom = document.createElement('img');
                dom.src = nft;
                dom.style.width = '40px';
                dom.style.height = '40px';
                const playerNFT = self.add.dom(60, 60 + i * 65, dom);
                this.playerNFTIcons.push(playerNFT);
                this.playerList.add(this.add.text(82, 60 + i * 65 - 15, playerNameText, { fontSize: '24px', fill: "#fffffff", fontFamily: 'PixelFont' }));
                //console.log(player.name + " HAS NFT");
            } else {
                this.playerList.add(this.add.text(50, 60 + i * 65 - 15, playerNameText, { fontSize: '24px', fill: "#fffffff", fontFamily: 'PixelFont' }));
            }
        }
    }

    // MAKE PANEL
    makePanelForNFTs() {
        // PAGE FOR YOUR NFTs
        this.page = 1;

        // ADD PANEL UI
        this.panelNFTs.add(this.add.image(675, 300, 'background-nfts').setScale(2.5,));
        this.panelNFTs.add(this.add.text(580, 40, "YOUR NFTs", { fontSize: '35px', fill: '#ffffff', fontFamily: 'PixelFont' }));
        this.panelNFTs.add(this.loadingText = this.add.text(570, 260, 'LOADING...', { fontSize: '50px', fill: '#ffffff', fontFamily: 'PixelFont' }));
        this.pageText = this.add.text(635 - (0) * 7, 523, '0/0', { fontSize: '30px', fill: '#ffffff', fontFamily: 'PixelFont' });
        this.panelNFTs.add(this.pageText);

        const self = this;

        // PAGINATION
        this.panelNFTs.add(this.add.image(570, 543, 'arrow').setScale(1.5).setInteractive()
            .on('pointerdown', () => {
                if (!this.pageIsReady) return;
                if (this.backgroundNFTs) {
                    this.backgroundNFTs.clear(true);
                }
                if (this.page > 1) {
                    this.page--;

                    // UPDATE PAGE TEXT
                    this.pageText.setText(this.page + '/' + this.lastPage);

                    // SET LOADING TEXT
                    self.loadingText.alpha = 1;

                    this.addNFTsForPage(this.page);

                    this.currentNFTs.forEach(nft => {
                        nft.destroy();
                    });
                    this.currentNFTs = [];
                    this.pageIsReady = false;
                    sceneEvents.emit('getNFTsFromPage', this.page);

                }
            }))

        this.panelNFTs.add(this.add.image(725, 543, 'arrow').setScale(1.5).setFlipX(true).setInteractive()
            .on('pointerdown', () => {
                if (!this.pageIsReady) return;

                if (this.backgroundNFTs) {
                    this.backgroundNFTs.clear(true);
                }
                if (this.page < this.lastPage) {
                    this.page++;

                    // UPDATE PAGE TEXT
                    let text = this.page + '/' + this.lastPage;
                    this.pageText.setText(text);
                    this.pageText.x = 630 - (text.length - 3) * 7;

                    // SET LOADING TEXT
                    self.loadingText.alpha = 1;

                    this.addNFTsForPage(this.page);

                    this.currentNFTs.forEach(nft => {
                        nft.destroy();
                    });
                    this.currentNFTs = [];

                    this.pageIsReady = false;
                    sceneEvents.emit('getNFTsFromPage', this.page);


                }
            }))


        // HIDE PANEL NFTs
        this.panelNFTs.getChildren().forEach(child => {
            child.setAlpha(0)
        });
    }

    /**
     * 
     * @param {length of nft result} nftsLength 
     */
    addInitialNFTPage(nftsLength) {
        // 12 nfts at page
        const lastPage = Math.floor(nftsLength / 12) + ((nftsLength % 12) > 0 ? +1 : +0);
        this.lastPage = lastPage;
        let text = this.page + '/' + this.lastPage;
        this.pageText.setText(text);
        this.pageText.x = 630 - (text.length - 3) * 7;

        // get nfts from page 1
        sceneEvents.emit('getNFTsFromPage', 1);
    }

    /**
     * 
     * @param {nfts from current page(this.page)} nfts 
     * @returns 
     */
    addNFTsForPage(nfts) {
        if (!this.getNFTPanelStatus()) return;
        this.pageIsReady = true;
        this.loadingText.alpha = 0;
        for (let i = 0; i < nfts.length; i++) {
            const dom = document.createElement('img');
            dom.src = nfts[i].image;
            dom.style.width = "100px";
            dom.style.height = "100px";
            //this.add.rectangle(370 + (i % 4) * 200, 130 + (Math.floor(i / 4)) * 150, 100, 100, 0x333333);
            let nft = this.add.dom(370 + (i % 4) * 200, 130 + (Math.floor(i / 4)) * 150, dom).setInteractive()
            let nftBackground = this.add.rectangle(370 + (i % 4) * 200, 130 + (Math.floor(i / 4)) * 150, 100, 100, 0x333333).setInteractive().on('pointerdown', () => {
                sceneEvents.emit('nftSelected', nfts[i]);
            });
            this.backgroundNFTs.add(nftBackground);
            let nftName = this.add.text(320 + (i % 4) * 200, 190 + (Math.floor(i / 4)) * 150, nfts[i].name, { fontSize: '24px', fill: '#ffffff', fontFamily: 'PixelFont' });
            this.currentNFTs.push(nft);
            this.currentNFTs.push(nftName);
        }
    }
}
