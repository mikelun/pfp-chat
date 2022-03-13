import Phaser from 'phaser'

import { sceneEvents } from '../Events/EventsCenter';

export class GameUi extends Phaser.Scene {
    constructor() {
        super({key:"game-ui"})
    }

    create() {
        // get the game width and height
        const width = this.game.config.width;
        const height = this.game.config.height;
        for (let i = 0; i < 4; i++) {
            this.add.image(width / 3 + i * (width / 8) , height * 0.90, 'player').setScale(2.5);
        }
        this.add.image(width / 3 + 0 * (width / 8) , height * 0.90 - 5, '1').setScale(0.2).setInteractive()
        .on('pointerdown', () => {
            sceneEvents.emit('toggleMute');
        });
        this.microphoneIsWorking = this.add.image(width / 3 + 0 * (width / 8) - 3, height * 0.90 - 5, 'x').setScale(0.3).setAlpha(0.4);
        this.add.image(width / 3 + 1 * (width / 8) , height * 0.90, '2').setScale(1.5);
        this.add.image(width / 3 + 2 * (width / 8) , height * 0.90, '3').setScale(1.5);
        this.add.image(width / 3 + 3 * (width / 8) , height * 0.90, '4').setScale(1.5);
        //this.add.image(120, 80, 'leaderboard-ui').setScale(0.7);
        sceneEvents.on('microphone-toggled', this.handleMicrophoneStatus, this)

    }

    handleMicrophoneStatus(status) {
        if (status) {
            this.microphoneIsWorking.alpha = 0;
        } else {
            this.microphoneIsWorking.alpha = 0.4;
        }
    }
 
}