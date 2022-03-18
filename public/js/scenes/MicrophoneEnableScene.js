import Phaser from 'phaser'


export class MicrophoneEnableScene extends Phaser.Scene {
    constructor() {
        super({ key: "microphone" });
    }

    create() {

        
        // ADDING MICROPHONE ACCESS BUTTONS
        this.button1 = this.add.image(325, 400, 'background-button').setScale(4, 3).setAlpha(0);
        this.text1 = this.add.text(225, 385, "ALLOW MICROPHONE", { fontSize: "20px", fill: "#000000" }).setAlpha(0).setInteractive().on('pointerdown', () => {
            navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
                localStorage.setItem('firstEnter', true);
                this.scene.start('MainScene', { stream: stream });
            })
        })
        this.button2 = this.add.image(325, 400 + 75, 'background-button').setAlpha(0).setScale(4, 3);
        this.text2 = this.add.text(225 + 20, 385 + 75, "NO, CONTINUE", { fontSize: "20px", fill: "#000000" }).setAlpha(0).setInteractive().on('pointerdown', () => {
            localStorage.setItem('firstEnter', false);
            this.scene.start('MainScene', { stream: false });
        });
        // END MICROPHONE ACCESS BUTTONS


        // ADDED TYPING TEXT
        var text = 'Hello from OpenMetaverse!\nHere you can chat and chill with other players\nIf you want to say something, we need your microphone access\n';
        this.label = this.add.text(200, 200, '', { fill: "#ffffff", fontSize: "24px" });

        this.input.on('pointerdown', () => {
            this.skip = true;
        });

         // CHECK IF USER HAS BEEN IN OPEN METAVERSE
         //localStorage.removeItem('firstEnter');
         if (localStorage.firstEnter == undefined || localStorage.firstEnter == "false") {
             this.typewriteText(text);
         }
         else if (localStorage.firstEnter == "true") {
             navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
                 localStorage.setItem('firstEnter', true);
                 this.scene.start('MainScene', { stream: stream });
             })
         }

    }
    typewriteText(text) {
        const length = text.length
        let i = 0
        this.time.addEvent({
            callback: () => {

                if (!this.skip) {
                    this.label.text += text[i];
                    ++i;
                }
                
                if (i == length - 1 || this.skip == true) {
                    this.button1.setAlpha(1);
                    this.text1.setAlpha(1);
                    this.button2.setAlpha(0.5);
                    this.text2.setAlpha(1);
                    this.label.text = text;
                }
            },
            repeat: length - 1,
            delay: 50
        });
    }

}