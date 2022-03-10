export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' })
    }

    preload() {
        for (let i = 0; i < 4; i++) {
            this.load.spritesheet(`characters${i}`,
                `assets/Other/${i}.png`,
                {
                    frameWidth: 32,
                    frameHeight: 32,
                    margin: 0,
                    spacing: 0
                });
        }
        this.load.image('tiles', 'assets/tiles/indoors.png');
        this.load.tilemapTiledJSON('dungeon', 'assets/tiles/mainmap.json');
        this.load.spritesheet(
            "characters",
            "assets/characterSprite.png",
            {
                frameWidth: 64,
                frameHeight: 64,
                margin: 1,
                spacing: 2
            }
        );

        this.load.image('map', 'assets/mainMap.jpeg');


        this.load.image('sprite', 'assets/spaceShips_001.png');

        this.load.image('star', 'assets/star_gold.png');
    }

    create() {
        this.scene.start('MainScene');
    }
}