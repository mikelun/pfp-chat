import Phaser from 'phaser'

import { initializeMusicPlayerPanel } from './GameUI-elements/musicPanel';


var mapId, coinsCount, nftImage, spaceId, textureId;

export class GameUi extends Phaser.Scene {
    constructor() {
        super({ key: "game-ui" });
    }
    init(data) {
        mapId = data.mapId;
        coinsCount = data.playerCoins;
        nftImage = data.nftImage;
        this.isHome = data.isHome;
        this.playerName = data.playerName;
        spaceId = data.spaceId;
        textureId = data.textureId;
    }

    create() {
        initializeMusicPlayerPanel(this, mapId)
    }

    update(time, delta) {
        if (this.myAudio) {
            // to format XX:YY
            if (!this.myAudio.duration) {
                this.timeMusic.setText('LOADING...');
            } else {
                var timeText = Phaser.Utils.String.Pad(Math.floor(this.myAudio.currentTime / 60), 2, '0', 1) + ':' + Phaser.Utils.String.Pad(Math.floor(this.myAudio.currentTime % 60), 2, '0', 1) + ' / ' + Phaser.Utils.String.Pad(Math.floor(this.myAudio.duration / 60), 2, '0', 1) + ':' + Phaser.Utils.String.Pad(Math.floor(this.myAudio.duration % 60), 2, '0', 1);
                this.timeMusic.setText(timeText);
            }
        }
    }
}
