import Phaser from 'phaser'
import { Moralis } from 'moralis'
import { ailoverseLevel0, ailoverseLevel1, ailoverseLevel2 } from './StartScene/ailoverse/ailoverse';
import { buildshipLevel0, buildshipLevel1, buildshipLevel2, updateBuildship } from './StartScene/buildship/buildship';
import { pinguinLevel0, pinguinLevel1, pinguinLevel2 } from './StartScene/pinguins/pinguin';
import { witchesLevel0, witchesLevel1, witchesLevel2 } from './StartScene/witches/witches';
import { cryptoDuckiesLevel0, cryptoDuckiesLevel1, cryptoDuckiesLevel2 } from './StartScene/crypto-duckies/cryptoDuckies';
import { guestLevel0, guestLevel1 } from './StartScene/Guest/guest';
import { dobbyLevel0, dobbyLevel1 } from './StartScene/dobby/dobby';

const creators = ["0x59e1fac2faf72765ad41ae1bfac53d5cd80acb91", "0x7a5F6EA3be6dB9dbe2bf436715a278b284ADeF61", "0xffE06cb4807917bd79382981f23d16A70C102c3B", "0x653d8554B690d54EA447aD82C933A6851CC35BF2", "0xD74197Ed1535cfDAb59D6e6Ec8Abe92A1f31C6Dd"];
const rooms = ["guest", "buildship", "pudgy-penguins", "crypto-duckies", "cryptocoven", "dobey"];
export class MicrophoneEnableScene extends Phaser.Scene {
    constructor() {
        super({ key: "microphone" });
    }

    initializeRooms() {
        if (this.room == 'ailoverse') {
            this.levels = [ailoverseLevel0, ailoverseLevel1, ailoverseLevel2];
        } else if (this.room == 'pudgy-penguin' || this.room == 'pudgy-penguins') {
            this.levels = [pinguinLevel0, pinguinLevel1, pinguinLevel2];
        } else if (this.room == 'cryptocoven') {
            this.levels = [witchesLevel0, witchesLevel1, witchesLevel2];
        } else if (this.room == 'crypto-duckies') {
            this.levels = [cryptoDuckiesLevel0, cryptoDuckiesLevel1, cryptoDuckiesLevel2];
        } else if (this.room == 'buildship') {
            this.room = 'buildship';
            this.levels = [buildshipLevel0, buildshipLevel1, buildshipLevel2];
        } else if (this.room == 'dobey') {
            this.room = 'dobey';
            this.levels = [dobbyLevel0, dobbyLevel1];
        } else {      
            this.room = 'guest';
            this.levels = [guestLevel0, guestLevel1];
        }
    }
    create() {
        var room = window.location.href.split('/');
        this.room = room[room.length - 1];
        if (!rooms.includes(this.room)) {
            this.room = "guest";
        }

         // intialize levels of rooms
         this.initializeRooms();

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
                    if (this.room != 'guest' && this.room != 'dobey') 
                        this.step = 2;
                    else {
                        this.step = 1;
                    }
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
        if (this.otherRooms) {
            this.otherRooms.destroy();
        }

        if (this.step == -1) {
           this.showRooms();
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
            var address = null;
            if (this.user) {
                address = this.user.get('ethAddress');
                localStorage.setItem('lastVisit', 'true');
            }
            // go to mainscene
            console.log("HERE");
            this.scene.start('MainScene', { stream: this.stream, moralis: Moralis, address: address, room: this.room });

        }

        if (this.step == this.levels.length - 1) {
            // ADDING SHOW ROOMS TEXT
            this.otherRooms = this.rexUI.add.label({
                background: this.add.image(0, 0, 'background-button'),
                text: this.add.text(0, 0, 'SHOW OTHER ROOMS', { fill: "#000000", fontSize: "18px" }),
                space: {
                    left: 20,
                    right: 30,
                    top: 20,
                    bottom: 30
                }
            }).layout().setPosition(1100, 80).setAlpha(0.8);
            this.otherRooms.setInteractive()
            .on('pointerdown', () => {
                this.step = -1;
                this.showCurrentLevel();
            });
        }

    }

    showButtons() {
        if (this.button1) this.button1.setAlpha(1);
        if (this.button2) this.button2.setAlpha(1);

    }


    showRooms() {
        this.add.text(600, 50, 'ROOMS', { fill: "#ffffff", fontSize: "32px", align: "center", fontFamily: "PixelFont" });
        for (let i = 0; i < rooms.length; i++) {
            var text = rooms[i].toUpperCase();
            if (text == 'GUEST') {
                text = 'GUEST (NO METAMASK)';
            } else if (text == 'BUILDSHIP') {
                text = 'BUILDSHIP MAIN ROOM';
            }
            this.add.text(100, 140 + i * 100, text, { fill: "#ffffff", fontSize: "24px" });
            // BUTTON WITH CONNECT TEXT
            this.rexUI.add.label({
                background: this.add.image(0, 0, 'background-button'),
                text: this.add.text(0, 0, 'ENTER', { fill: "#000000", fontSize: "24px" }),
                space: {
                    left: 30,
                    right: 30,
                    top: 10,
                    bottom: 20
                }
            }).layout().setPosition(470, 140 + i * 100 + 17).setInteractive()
            .on('pointerdown', () => {
                // load page href
                window.location.href = window.location.origin + '/' + rooms[i];
            });
        }
    }

    async checkNFTForProject(token_address) {
        const address = this.user.get('ethAddress');

        const result1 = await this.checkNFT(token_address);

        if (result1 || creators.includes(address)) {
            this.label.text = 'YOU HAVE PUDGY PENGUIN NFT'
            this.step = 3;
            this.showCurrentLevel();
            this.progress.setAlpha(0);
        } else {
            this.label.x -= 100;
            this.label.text = 'YOU DONT HAVE PUDGY PENGUIN NFT\nYOU CAN VISIT MAIN ROOM WITHOUT NFT'
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