import Phaser from 'phaser'
import moralis from 'moralis'

export class MicrophoneEnableScene extends Phaser.Scene {
    constructor() {
        super({ key: "microphone" });
    }

    create() {

        // adding steps(levels) of typing text
        this.step = 0;

        // ADDED TYPING TEXT
        var text = 'Hello from OpenMetaverse!\nHere you can chat and chill with other players\nIf you want to say something, we need your microphone access\n';

        this.addTypingText();

        // CHECK IF USER HAS BEEN IN OPEN METAVERSE
        //localStorage.removeItem('firstEnter');
        //if (localStorage.firstEnter == undefined || localStorage.firstEnter == "false") {
        this.typewriteText(text, 0);
        // }
        // else if (localStorage.firstEnter == "true") {
        //     navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
        //         localStorage.setItem('firstEnter', true);
        //         this.scene.start('MainScene', { stream: stream });
        //     })
        // }

    }

    addTypingText() {
        // ADDING MICROPHONE ACCESS BUTTONS
        this.button1 = this.add.image(325, 400, 'background-button').setScale(4, 3).setAlpha(0).setInteractive().on('pointerdown', () => {
            navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
                this.typewriteText("PLEASE CONNECT METAMASK", 1);
                this.stream = stream;
                // localStorage.setItem('firstEnter', true);
                // this.scene.start('MainScene', { stream: stream });
            })
        });

        this.text1 = this.add.text(225, 385, "ALLOW MICROPHONE", { fontSize: "20px", fill: "#000000" }).setAlpha(0);
        this.button2 = this.add.image(325, 400 + 75, 'background-button').setAlpha(0).setScale(4, 3).setInteractive().on('pointerdown', () => {
            this.typewriteText("PLEASE CONNECT METAMASK", 1);
            // localStorage.setItem('firstEnter', false);
            // this.scene.start('MainScene', { stream: false });
        });
        this.text2 = this.add.text(225 + 20, 385 + 75, "NO, CONTINUE", { fontSize: "20px", fill: "#000000" }).setAlpha(0);
        // END MICROPHONE ACCESS BUTTONS


        this.label = this.add.text(200, 200, '', { fill: "#ffffff", fontSize: "24px" });

        this.input.on('pointerdown', () => {
            this.skip = true;
        });
    }

    typewriteText(text, step) {
        const length = text.length
        this.label.text = '';
        let i = 0;
        this.skip = false;

        // ADDING METAMASK
        if (step == 1) {
            if (this.getMetamask) return;
            this.getMetamask = true;
            this.button1.setAlpha(1);
            this.button1.setInteractive().on('pointerdown', () => {
                // ADDING METAMASK
                const serverUrl = "https://aehuzyu1u1bu.usemoralis.com:2053/server";
                const appId = "qjkycuFOWtZY1v6bpU8N2e4oxTqdvxNt6ajnsNIm";
                moralis.start({ serverUrl, appId });
                var user;
                async function login() {
                    user = moralis.User.current();
                    if (!user) {
                        user = await moralis.authenticate({
                            signingMessage: "Log in using Moralis",
                        })
                            .then(function (user) {
                                console.log("logged in user:", user);
                                console.log(user.get("ethAddress"));
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }
                }
                login().then(() => {
                    console.log(user);
                    if (user) {
                        localStorage.setItem('firstEnter', this.stream ? true : false);
                        this.scene.start('MainScene', { stream: this.stream ? this.stream : false, moralis: moralis });
                    } else {
                        this.label.text = "YOU HAVEN'T METAMASK IN YOUR BROWSER OR RELOAD THE PAGE";
                    }
                })
            });

            this.text1.setAlpha(1);
            this.text1.setText("CONNECT");
            this.button1.y -= 100;
            this.text1.y = this.text1.y - 100;
            this.text1.x = this.text1.x + 50;
            this.button2.setAlpha(0);
            this.text2.setAlpha(0);
        }
        this.time.addEvent({
            callback: () => {
                if (this.step == step) {
                    if (!this.skip) {
                        this.label.text += text[i];
                        ++i;
                    }
                    if ((i == length - 1 || this.skip == true)) {
                        if (step == 0) {
                            this.step = step + 1;
                            this.button1.setAlpha(1);
                            this.text1.setAlpha(1);
                            this.button2.setAlpha(0.5);
                            this.text2.setAlpha(1);
                            this.label.text = text;
                        } else {
                            this.label.text = text;
                        }
                    }

                }
            },
            repeat: length - 1,
            delay: 50
        });
    }
    update() {
    }

}