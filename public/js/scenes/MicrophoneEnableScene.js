import Phaser from 'phaser'
import { Moralis } from 'moralis'

import { tryOr } from '../utils/utils';

export class MicrophoneEnableScene extends Phaser.Scene {
    constructor() {
        super({ key: "microphone" });
    }

    create() {
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
        if (localStorage.getItem('microphone') == 'true' && localStorage.getItem('Moralis') == 'true' && localStorage.getItem('nft') == 'true') {
            // TRY TO GET Moralis AND MICROPHONE
            try {
                navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
                    this.stream = stream;
                    this.startMoralis();
                    this.user = Moralis.User.current();
                    // const address = this.user.get('ethAddress');
                    // this.address 
                    this.progress.setAlpha(1);
                    this.label = this.add.text(500, 480, 'CHECKING YOUR NFT...', { fill: "#ffffff", fontSize: "24px", align: "center" });
                    this.checkNFT();
                    //this.scene.start('MainScene', { stream: this.stream, moralis: Moralis, address: address });
                });
            } catch (e) {
                alert(e);
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

        // ADD OPPORTUNITY TO SKIP TEXT
        this.skip = false;
        this.input.on('pointerdown', () => {
            this.skip = true;
        });

        // LOAD LEVELS
        if (this.step == 0) {
            this.level0();
        }
        if (this.step == 1) {
            this.level1();
        }
        if (this.step == 2) {
            this.level2();
        }
        if (this.step == 3) {
            const address = this.user.get('ethAddress');
            localStorage.setItem('nft', 'true');
            // go to mainscene
            this.scene.start('MainScene', { stream: this.stream, moralis: Moralis, address: address });

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

    level0() {
        // MAKE GROUP FOR LEVEL
        this.levelGroup = this.add.group();

        // TEXT
        var text = 'Hello from OpenMetaverse!\nHere you can chat and chill with other players\nIf you want to say something, we need your microphone access\n';
        this.label = this.add.text(200, 200, '', { fill: "#ffffff", fontSize: "24px" });
        this.levelGroup.add(this.label);
        this.typeTextWithDelay(text);

        // BUTTON WITH ALLOW TEXT
        this.button1 = this.rexUI.add.label({
            background: this.add.image(0, 0, 'background-button'),
            text: this.add.text(0, 0, 'ALLOW', { fill: "#000000", fontSize: "24px" }),
            space: {
                left: 90,
                right: 90,
                top: 20,
                bottom: 30
            }
        }).layout().setPosition(325, 350).setAlpha(0);

        // BUTTON WITH "NO, CONTINUE" TEXT
        this.button2 = this.rexUI.add.label({
            background: this.add.image(0, 0, 'background-button'),
            text: this.add.text(0, 0, 'NO, CONTINUE', { fill: "#000000", fontSize: "24px" }),
            space: {
                left: 40,
                right: 40,
                top: 20,
                bottom: 30
            }
        }).layout().setPosition(325, 420).setAlpha(0);

        // SET BUTTONS INTERCTIVE
        this.button1.setInteractive().on('pointerdown', () => {
            if (this.step != 0) return;
            try {
                navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
                    this.stream = stream;
                    localStorage.setItem('microphone', 'true');
                    this.step = 1;
                    this.showCurrentLevel();
                });
            } catch (e) {
                alert("YOUR MICROPHONE DOESN'T WORKING! " + e);
            }
        });

        this.button2.setInteractive().on('pointerdown', () => {
            if (this.step != 0) return;
            this.step = 1;
            this.stream = null;
            this.showCurrentLevel();
        });

    }

    level1() {
        // MAKE GROUP FOR LEVEL
        this.levelGroup = this.add.group();

        // TEXT
        var text = 'IF YOU WANT TO SHOW OFF YOUR NFT\nOR FIND YOUR NFT COMMUNITY ROOM\nPLEASE CONNECT METAMASK';
        this.label = this.add.text(200, 200, '', { fill: "#ffffff", fontSize: "24px" });
        this.levelGroup.add(this.label);
        this.typeTextWithDelay(text);

        // BUTTON WITH CONNECT TEXT
        this.button1 = this.rexUI.add.label({
            background: this.add.image(0, 0, 'background-button'),
            text: this.add.text(0, 0, 'CONNECT', { fill: "#000000", fontSize: "24px" }),
            space: {
                left: 100,
                right: 100,
                top: 20,
                bottom: 30
            }
        }).layout().setPosition(325, 350).setAlpha(0);

        // BUTTON WITH CONTINUE AS GUEST TEXT
        // this.button2 = this.rexUI.add.label({
        //     background: this.add.image(0, 0, 'background-button'),
        //     text: this.add.text(0, 0, 'CONTINUE AS GUEST', { fill: "#000000", fontSize: "24px" }),
        //     space: {
        //         left: 30,
        //         right: 40,
        //         top: 20,
        //         bottom: 30
        //     }
        // }).layout().setPosition(325, 420).setAlpha(0);

        const self = this;

        // SET BUTTONS INTERCTIVE
        this.button1.setInteractive().on('pointerdown', () => {
            if (this.step != 1) return;

            // connect to Moralis
            this.startMoralis();

            async function login() {
                var user = Moralis.User.current();
                self.progress.setAlpha(1);
                if (!user) {
                    self.label.setPosition(460, 460);
                    self.label.text = 'CONNECTING YOUR METAMASK...'
                    user = await Moralis.authenticate({
                        signingMessage: "Log in using Moralis",
                    })
                        .then(function (user) {
                            localStorage.setItem('Moralis', 'true');
                            self.step = 2;
                            self.user = user;
                            self.showCurrentLevel();
                            self.progress.setAlpha(0);
                        })
                        .catch(function (error) {
                            self.progress.setAlpha(0);
                            self.label.text = 'ERROR, TRY AGAIN'
                            alert(error);
                        });
                } else {
                    self.user = user;
                    localStorage.setItem('Moralis', 'true');
                    self.step = 2;
                    self.progress.setAlpha(0);
                    self.showCurrentLevel();
                }
            }
            login();
            self.button1.setAlpha(0);

        });
        // this.button2.setInteractive().on('pointerdown', () => {
        //     if (this.step != 1) return;
        //     this.step = 2;
        //     this.useMoralis = false;
        //     //Moralis = null;
        //     this.showCurrentLevel();
        // });

    }


    level2() {
        const self = this;

        // MAKE GROUP FOR LEVEL
        this.levelGroup = this.add.group();

        this.cats = this.add.image(500, 450, 'ailoverse-cats').setScale(0.2);
        this.robots = this.add.image(600, 600, 'ailoverse-robots').setScale(0.2);
        this.ailoverseText = this.add.text(500, 100, 'AILOVERSE', { fill: "#ffffff", fontSize: "48px", fontFamily: "PixelFont" });
        
        this.levelGroup.add(this.cats);
        this.levelGroup.add(this.robots);
        // TEXT
        var text = 'TO ENTER THE ROOM YOU SHOULD HAVE AILOVERSE NFT';
        this.label = this.add.text(200, 200, '', { fill: "#ffffff", fontSize: "24px" });
        this.levelGroup.add(this.label);
        this.typeTextWithDelay(text);

        // BUTTON WITH START TEXT
        this.button1 = this.rexUI.add.label({
            background: this.add.image(0, 0, 'background-button'),
            text: this.add.text(0, 0, 'CHECK NFT', { fill: "#000000", fontSize: "24px" }),
            space: {
                left: 90,
                right: 90,
                top: 20,
                bottom: 30
            }
        }).layout().setPosition(325, 300).setAlpha(0);

        // SET BUTTONS INTERCTIVE
        this.button1.setInteractive().on('pointerdown', () => {
            if (this.step != 2) return;

            self.progress.setAlpha(1);
            self.button1.setAlpha(0);
            self.label.setPosition(500, 480);
            this.cats.setAlpha(0);
            this.robots.setAlpha(0);
            self.label.text = 'CHECKING YOUR NFT...'
            this.checkNFT(self);
        });
    }

    async checkNFT() {
        // take nft from location query
        const ailoverse_token_address = "0xa0C7F1ae5B5A317B04e5b060c8fc1cfaCaB03F85";
        const buildship_early_bird = "0x35a31fc46eed1f29ba18977e8a963325da882609";

        // parse querystring
        const query = window.location.search.substring(1);
        const [ nft ] = query.split("&");
        const [ , token_address = ailoverse_token_address ] = nft.split("=");

        console.log('Checking NFT', token_address, `https://etherscan.io/address/${token_address}`)

        const { total } = await Moralis.Web3API.account.getNFTsForContract({ token_address });

        if (total > 0) {
            this.label.text = 'YOU HAVE AILOVERSE NFT'
            this.step = 3;
            this.showCurrentLevel();
            this.progress.setAlpha(0);
        } else {
            this.label.text = 'YOU DONT HAVE AILOVERSE NFT'
            //self.progress.setAlpha(0);
        }
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
    }

}