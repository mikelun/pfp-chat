import Phaser from 'phaser'

import { sceneEvents } from '../Events/EventsCenter';

export class GameUi extends Phaser.Scene {
    constructor() {
        super({key:"game-ui"});
    }

    create() {
        this.nfts = [];
        this.playerList = this.add.group();

        // get the game width and height
        const width = this.game.config.width;
        const height = this.game.config.height;
        for (let i = 0; i < 4; i++) {
            this.add.image(width / 3 + i * (width / 8) , height * 0.90, 'player').setScale(2.5);
        }
        // this.add.image(150, height - 150, 'player').setScale(5);
        // this.add.image(150, height - 150, '1').setScale(0.5);
        // this.add.image(150, height -150, 'x').setScale(0.6).setAlpha(0.4);


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
    
        sceneEvents.on('newPlayerNFT', this.updateCurrentPlayers, this);
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
        for (let i = 0; i < this.nfts.length; i++) {
            this.nfts[i].destroy();
        }
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            console.log(player);
            this.playerList.add(this.add.image(120, 60 + i * 65, "pixel-box").setScale(0.3, 0.3))
            this.playerList.add(this.add.text(82, 60 + i * 65 - 5, player.name, {fontSize: '12px', fill: "#fffffff"}));
            this.playerList.add(this.add.image(190, 60 + i * 65, player.microphoneStatus ? "microphone" : "microphoneMuted").setScale(0.7));
            if (player.nft) {
                var dom = document.createElement('img');
                dom.src = player.nft;
                dom.style.width = '40px';
                dom.style.height = '40px';
                this.nfts.push(this.add.dom(60, 60 + i * 65, dom));
                //console.log(player.name + " HAS NFT");
            } else {
                this.playerList.add(this.add.rectangle(60, 60 + i * 65, 40, 40, 0x333333));
            }
        };
    }

    updatePlayerStatus(status) {
        console.log(this.playerList.getChildren());
    }
 
}