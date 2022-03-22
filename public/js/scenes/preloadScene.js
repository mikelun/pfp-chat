export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' })
    }

    preload() {
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(250, 280, 740, 30);

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 + 40,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 100,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 740 * value, 30);
        });

        // this.load.on('fileprogress', function (file) {
        //     assetText.setText('Loading asset: ' + file.key);
        // });
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
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

        // GAME UI
        this.load.image('1', 'assets/game-ui/1.png');
        this.load.image('2', 'assets/game-ui/2.png');
        this.load.image('3', 'assets/game-ui/3.png');
        this.load.image('4', 'assets/game-ui/4.png');
        this.load.image('x', 'assets/game-ui/x.png');
        this.load.image('player', 'assets/game-ui/player.png');
        this.load.image('background-button', 'assets/game-ui/background-button.png')


        // LOADING MAP
        this.load.image('tiles', 'assets/tiles/TilemapDay.png');
        this.load.tilemapTiledJSON('dungeon', 'assets/tiles/map-bar.json');

        
        this.load.image('play-button', 'assets/game-ui/button-play.png');
    
        this.load.image('microphone',"assets/game-ui/microphone.png");
        this.load.image('microphoneMuted',"assets/game-ui/mute.png");
        this.load.image('x-button',"assets/game-ui/x-button.png");
        this.load.image('pixel-box',"assets/game-ui/pixel-box.png");
        // this.load.image('volume',"assets/game-ui/high-volume.png");
        this.load.image('machine', 'assets/machine.png');
        this.load.image('retro-background', "assets/retro-background.jpeg");

        this.load.image('comment', 'assets/game-ui/comment.png');

        this.load.image('ball', 'assets/ball.png');
    }

    create() {
        this.scene.start('microphone');
    }
}