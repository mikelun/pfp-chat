import Phaser from 'phaser'
import {Moralis} from 'moralis'

export class MicrophoneEnableScene extends Phaser.Scene {
    constructor() {
        super({ key: "microphone" });
    }

    create() {
        // default stream is false
        this.stream = false;

        // adding steps(levels) of typing text
        this.step = 0;
        this.showCurrentLevel();
        // check if lastVisit localStorage is true
        if (localStorage.getItem('microphone') == 'true' && localStorage.getItem('Moralis') == 'true') {
            // TRY TO GET Moralis AND MICROPHONE
            try {
                navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
                    this.stream = stream;
                    this.startMoralis();
                    this.scene.start('MainScene', { stream: this.stream, moralis: Moralis });
                });
            } catch (e) {
                alert(e);
            }

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
            this.button1.clear(true);
        }
        if (this.button2) {
            this.button2.clear(true);
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
            localStorage.setItem('lastVisit', 'true');
            // go to mainscene
            this.scene.start('MainScene', { stream: this.stream, moralis: this.useMoralis == false ? Moralis : null});

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
        this.button2 = this.rexUI.add.label({
            background: this.add.image(0, 0, 'background-button'),
            text: this.add.text(0, 0, 'CONTINUE AS GUEST', { fill: "#000000", fontSize: "24px" }),
            space: {
                left: 30,
                right: 40,
                top: 20,
                bottom: 30
            }
        }).layout().setPosition(325, 420).setAlpha(0);

        const self = this;

        // SET BUTTONS INTERCTIVE
        this.button1.setInteractive().on('pointerdown', () => {
            if (this.step != 1) return;

            // connect to Moralis
            this.startMoralis();

            async function login() {
                self.user = Moralis.User.current();
                if (!self.user) {
                    self.label.text = 'CONNECTING YOUR METAMASK...'
                    self.user = await Moralis.authenticate({
                        signingMessage: "Log in using Moralis",
                    })
                        .then(function (user) {
                            localStorage.setItem('Moralis', 'true');
                            self.step = 2;
                            self.showCurrentLevel();
                        })
                        .catch(function (error) {
                            alert(error);
                            self.label.text = 'ERROR, TRY AGAIN'
                        });
                } else {
                    localStorage.setItem('Moralis', 'true');
                    self.step = 2;
                    self.showCurrentLevel();
                }
            }
            login();

        });
        this.button2.setInteractive().on('pointerdown', () => {
            if (this.step != 1) return;
            this.step = 2;
            this.useMoralis = false;
            //Moralis = null;
            this.showCurrentLevel();
        });

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
    }

}