import Phaser from 'phaser'
import { Moralis } from 'moralis'
import { ailoverseLevel0, ailoverseLevel1, ailoverseLevel2 } from './StartScene/ailoverse/ailoverse';
import { buildshipLevel0, buildshipLevel1, buildshipLevel2, updateBuildship } from './StartScene/buildship/buildship';

import { tryOr } from '../utils/utils';

const creators = ["0x59e1fac2faf72765ad41ae1bfac53d5cd80acb91", "0x7a5F6EA3be6dB9dbe2bf436715a278b284ADeF61", "0xffE06cb4807917bd79382981f23d16A70C102c3B", "0x653d8554B690d54EA447aD82C933A6851CC35BF2"];
export class MicrophoneEnableScene extends Phaser.Scene {
    constructor() {
        super({ key: "microphone" });
    }

    create() {

        var room = window.location.href.split('/');
        this.room = room[room.length - 1];

        this.progress = this.add.sprite(640, 300, 'loading').setScale(0.7).setAlpha(0);
        this.anims.create({
            key: 'loading',
            frames: this.anims.generateFrameNumbers('loading', { start: 0, end: 15 }),
            frameRate: 16,
            repeat: -1
        })
        this.progress.play('loading');
        // default stream is false
        this.stream = false;
        // check if lastVisit localStorage is true
        if (localStorage.getItem('microphone') == 'true' && localStorage.getItem('lastVisit') == 'true') {
            // TRY TO GET Moralis AND MICROPHONE
            try {
                navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
                    this.stream = stream;
                    this.startMoralis();
                    this.user = Moralis.User.current();
                    // const address = this.user.get('ethAddress');
                    // this.address 
                    this.step = 2;
                    this.showCurrentLevel();
                    // this.progress.setAlpha(1);
                    // this.label = this.add.text(500, 480, 'CHECKING YOUR NFT...', { fill: "#ffffff", fontSize: "24px", align: "center" });
                    // this.checkAiloverseNFT();
                    //this.scene.start('MainScene', { stream: this.stream, moralis: Moralis, address: address });
                });
            } catch (e) {
                // remove microphone localStorage
                localStorage.setItem('microphone', 'false');
            }

        } else {
            // adding steps(levels) of typing text
            this.step = 0;
            this.showCurrentLevel();
        }

    }

    // START Moralis
    startMoralis() {
        const serverUrl = "https://aehuzyu1u1bu.useMoralis.com:2053/server";
        const appId = "qjkycuFOWtZY1v6bpU8N2e4oxTqdvxNt6ajnsNIm";
        Moralis.start({ serverUrl, appId });
    }

    showCurrentLevel() {

        if (this.room == 'ailoverse') {
            this.levels = [ailoverseLevel0, ailoverseLevel1, ailoverseLevel2];
        } else {
            this.room = 'buildship';
            this.levels = [buildshipLevel0, buildshipLevel1, buildshipLevel2];
        }

        // CLEAR SCREEN FOR THE NEXT LEVEL(MESSAGE)
        if (this.levelGroup) {
            this.levelGroup.clear(true);
        }
        if (this.button1) {
            this.button1.destroy();
        }
        if (this.button2) {
            this.button2.destroy();
        }

        // ADD OPPORTUNITY TO SKIP TEXT
        this.skip = false;
        this.input.on('pointerdown', () => {
            this.skip = true;
        });

        // SHOW LEVELS
        if (this.step < this.levels.length) {
            for (let i = 0; i < this.levels.length; i++) {
                if (i == this.step) {
                    this.levels[i](this, Moralis);
                }
            }
        } else {
            const address = this.user.get('ethAddress');
            localStorage.setItem('lastVisit', 'true');
            // go to mainscene
            this.scene.start('MainScene', { stream: this.stream, moralis: Moralis, address: address, room: this.room });

        }

    }

    showButtons() {
        if (this.step == 0) {
            this.button1.setAlpha(1);
            this.button2.setAlpha(1);
        }
        if (this.step == 1) {
            this.button1.setAlpha(1);
            this.button2.setAlpha(1);
        }
        if (this.step == 2) {
            this.button1.setAlpha(1);
        }

    }

    async checkAiloverseNFT() {
        const address = this.user.get('ethAddress');
        
        // take nft from location query
        const ailoverse_token_address_robots = "0xa4ccd65a4d2b07b5f5573ba97876ac640a4d45a5";
        const ailoverse_token_address_cats = "0xb9288fc06e7e10f6a14c528d7f1f226810a81a1f";
        const buildship_early_bird = "0x35a31fc46eed1f29ba18977e8a963325da882609";

        // // parse querystring
        // const query = window.location.search.substring(1);
        // const [ nft ] = query.split("&");
        // const [, token_address = ailoverse_token_address ] = nft.split("=");
        //const token_address = ailoverse_token_address
        const result1 = await this.checkNFT(ailoverse_token_address_cats);
        const result2 = await this.checkNFT(ailoverse_token_address_robots)

        if (result1 || result2 || creators.includes(address)) {
            this.label.text = 'YOU HAVE AILOVERSE NFT'
            this.step = 3;
            this.showCurrentLevel();
            this.progress.setAlpha(0);
        } else {
            this.label.x -= 100;
            this.label.text = 'YOU DONT HAVE AILOVERSE NFT\nYOU CAN VISIT MAIN ROOM WITHOUT NFT'
            // BUTTON WITH HREF TEXT
            this.continueButton = this.rexUI.add.label({
                background: this.add.image(0, 0, 'background-button'),
                text: this.add.text(0, 0, 'CONTINUE', { fill: "#000000", fontSize: "24px" }),
                space: {
                    left: 90,
                    right: 90,
                    top: 20,
                    bottom: 30
                }
            }).layout().setPosition(650, 600);

            this.continueButton.setInteractive().on('pointerdown', () => {
                // load page href
                window.location.href = window.location.origin;
            });
            //self.progress.setAlpha(0);
        }
    }

    async checkNFT(token_address) {
        console.log('Checking NFT', token_address, `https://etherscan.io/address/${token_address}`)
        const { total } = await Moralis.Web3API.account.getNFTsForContract({ token_address });
        return total > 0;
    }

    typeTextWithDelay(text) {
        var i = 0;
        var delay = 50;
        const self = this;

        var timer = this.time.addEvent({
            delay: delay,
            callback: () => {
                this.label.text += text[i];
                i++;
                if (i >= text.length || this.skip == true) {
                    this.label.text = text;
                    self.showButtons();
                    timer.destroy();
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    update() {
        if (this.cats) {
            this.cats.x -= 0.5;
        }
        if (this.robots) {
            this.robots.x += 0.5;
        }
        updateBuildship(this);
    }

}