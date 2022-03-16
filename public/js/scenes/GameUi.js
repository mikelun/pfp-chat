import Phaser from 'phaser'

import { sceneEvents } from '../Events/EventsCenter';

export class GameUi extends Phaser.Scene {
    constructor() {
        super({key:"game-ui"});
    }

    create() {
        this.playerList = this.add.group();

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
        for (let i = 0; i < 4; i++) {
            this.playerList.add(this.add.image(120, 60 + i * 65, "pixel-box").setScale(0.3, 0.3));
            this.playerList.add(this.add.text(50, 60 + i * 65 - 5, "Player" + i));
            this.playerList.add(this.add.image(180, 60 + i * 65, "microphoneMuted"));
        }
        this.playerList.clear(true);
        sceneEvents.on('microphone-toggled', this.handleMicrophoneStatus, this)

        sceneEvents.on('currentPlayers', this.updateCurrentPlayers, this);
    }

    handleMicrophoneStatus(status) {
        if (status) {
            this.microphoneIsWorking.alpha = 0;
        } else {
            this.microphoneIsWorking.alpha = 0.4;
        }
    }

    updateCurrentPlayers(players) {
        this.playerList.clear(true);
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            console.log(player.name);
            this.playerList.add(this.add.image(120, 60 + i * 65, "pixel-box").setScale(0.3, 0.3))
            this.playerList.add(this.add.text(50, 60 + i * 65 - 5, player.name, {fontSize: '14px', fill: "#fffffff"}));
            this.playerList.add(this.add.image(180, 60 + i * 65, player.microphoneStatus ? "microphone" : "microphoneMuted"));
        };
    }

    updatePlayerStatus(status) {
        console.log(this.playerList.getChildren());
    }
 
}