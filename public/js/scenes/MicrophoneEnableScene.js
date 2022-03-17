import Phaser from 'phaser'


export class MicrophoneEnableScene extends Phaser.Scene {
    constructor() {
        super({ key: "microphone" });
    }

    create() {
        console.log("HERE");
        var text = 'Hello from OpenMetaverse!\nHere you can chat and chill with other players\nIf you want to say something, we need your microphone access\n';
        this.label = this.add.text(200, 200, '', { fill: "#ffffff", fontSize: "24px"});
        this.typewriteText(text);
    }
    typewriteText(text) {
        const length = text.length
        let i = 0
        this.time.addEvent({
            callback: () => {
                this.label.text += text[i]
                ++i
                if (i == length - 1) {
                    this.add.image(325, 400, 'background-button').setScale(4, 3);
                    this.add.text(225, 385, "ALLOW MICROPHONE", {fontSize: "20px", fill: "#000000"}).setInteractive().on('pointerdown', () => {
                        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
                            this.scene.start('MainScene', stream);  
                        })
                    })
                    this.add.image(325, 400 + 75, 'background-button').setScale(4, 3).setAlpha(0.5);
                    this.add.text(225 + 20, 385 + 75, "NO, CONTINUE", {fontSize: "20px", fill: "#000000"}).setInteractive().on('pointerdown', () => {
                        this.scene.start('MainScene');
                    });
                    
                }
            },
            repeat: length - 1,
            delay: 50
        });
    }

}