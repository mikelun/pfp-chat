export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' })
    }

    // LOAD YOUR PLANET SPRITE
    loadPlanets() {
        // coffeebar-planet
        this.load.spritesheet('coffeebar-planet', 'assets/projects/coffeebar/coffeebar-planet.png', {
            frameWidth: 50,
            frameHeight: 50,
        });

        // buildship-planet
        this.load.spritesheet('buildship-planet', 'assets/projects/buildship/buildship-planet.png', {
            frameWidth: 50,
            frameHeight: 50,
        });

        // crypto-duckies-planet
        this.load.spritesheet('crypto-duckies-planet', 'assets/projects/crypto-duckies/crypto-duckies-planet.png', {
            frameWidth: 50,
            frameHeight: 50,
        });
        
        // crypto-duckies-planet
        this.load.spritesheet('moonbirds-planet', 'assets/projects/moonbirds/moonbirds-planet.png', {
            frameWidth: 50,
            frameHeight: 50,
        });

    }

    loadMaps() {
        // for moonbirds planet
        this.load.tilemapTiledJSON('moonbirds-map', 'assets/tiles/moonbirds.json');
    }

    preload() {

        this.loadPlanets();
        this.loadMaps();

        // LOAD PLANETS
        this.load.spritesheet('planet0', 'assets/planets/planet0.png', {
            frameWidth: 50,
            frameHeight: 50, 
            margin: 0,
            spacing: 0
        });

        

        // LOADING ANIMALS
        const animalsFolders = ['cat1', 'dog2'];
        for (let i = 0; i < animalsFolders.length; i++) {
            for (let j = 0; j < 2; ++j) {
                var anim = 'Walk';
                if (j === 1) anim = 'Idle';
                this.load.spritesheet(`${animalsFolders[i]}-${anim}`, `assets/animals/${animalsFolders[i]}/${anim}.png`, {
                    frameWidth: 48,
                    frameHeight: 48,
                    margin: 0,
                    spacing: 0
                });
            }
        }

        // GAME UI
        this.load.image('helm', 'assets/game-ui/helm.png');
        this.load.image('headphones', 'assets/game-ui/headphones.png');
        this.load.image('headphones-off', 'assets/game-ui/headphones-off.png');
        this.load.image('microphone1', 'assets/game-ui/microphone1.png');
        this.load.image('microphone1-off', 'assets/game-ui/microphone1-off.png');
        this.load.image('button', 'assets/game-ui/button.png');
        this.load.image('buttonpress', 'assets/game-ui/buttonpress.png');
        this.load.image('instructions', 'assets/game-ui/instructions.png');
        this.load.image('1', 'assets/game-ui/1.png');
        this.load.image('2', 'assets/game-ui/2.png');
        this.load.image('3', 'assets/game-ui/3.png');
        this.load.image('4', 'assets/game-ui/4.png');
        this.load.image('x', 'assets/game-ui/x.png');
        this.load.image('player', 'assets/game-ui/player.png');
        this.load.image('background-button', 'assets/game-ui/background-button.png')

        this.load.image('arrow', 'assets/game-ui/arrow.png');

        this.load.image('background-nfts', 'assets/game-ui/background-nfts.jpg');

        // LOAD START SCENE ELEMENTS
        this.load.image('bg-1', 'assets/game-ui/bg-1.png');
        this.load.image('bg-2', 'assets/game-ui/bg-2.png');
        this.load.image('press-enter-text', 'assets/game-ui/press-enter-text.png');
        this.load.spritesheet('thunder', 'assets/thunder.png', {
            frameWidth: 64,
            frameHeight: 64,
            margin: 0,
            spacing: 0
        });

        // LOAD PROGRESS BAR
        this.load.spritesheet('loading', 'assets/game-ui/loading.png', {
            frameWidth: 512,
            frameHeight: 512});

        // LOADING MAIN DAY MAP
        this.load.image('tiles', 'assets/tiles/TilemapDay.png');
        this.load.tilemapTiledJSON('dungeon', 'assets/tiles/map-bar.json');

        // LOADING NIGHT MAP
        this.load.image('tiles-night', 'assets/tiles/TilemapNight.png');
        this.load.tilemapTiledJSON('map-night-home', 'assets/tiles/map-night-home.json');

        // LOAD SURF VIBE MAP
        //this.load.image('3_frame_animated_shoreline_and_cliffs', 'assets/tiles/surf-tiles/3_frame_animated_shoreline_and_cliffs.png');
        
        this.load.image('Animated_Doors', 'assets/tiles/surf-tiles/Animated_Doors_Extruded.png');
        this.load.image('Animated_Netting', 'assets/tiles/surf-tiles/Animated_Netting_Extruded.png');
        this.load.image('Animated_Pier', 'assets/tiles/surf-tiles/Animated_Pier_Extruded.png');
        this.load.image('Animated_Shore', 'assets/tiles/surf-tiles/Animated_Shore_Extruded.png');
        this.load.image('Animated_Deepwater', 'assets/tiles/surf-tiles/Animated_Deepwater_Extruded.png');
        this.load.image('MainTileMap', 'assets/tiles/surf-tiles/MainTileMap_Extruded.png');
        this.load.image('Animated_Boats', 'assets/tiles/surf-tiles/Animated_Boats_Extruded.png');
        this.load.image('Animated_Cliffs', 'assets/tiles/surf-tiles/Animated_Cliffs_Extruded.png');
        this.load.image('Animated_Dolphin', 'assets/tiles/surf-tiles/Animated_Dolphin.png');
        this.load.tilemapTiledJSON('surf-vibe', 'assets/tiles/surf-vibe.json');
        // END LOADING SURF VIBE MAP

        // LOADING COFFEEBAR MAP
        this.load.image('Bakery', 'assets/tiles/Bakery.png');
        this.load.image('Interior', 'assets/tiles/Interior.png');
        this.load.tilemapTiledJSON('cafe', 'assets/tiles/cafe.json');

        this.load.image('play-button', 'assets/game-ui/button-play.png');

        this.load.image('microphone', "assets/game-ui/microphone.png");
        this.load.image('microphoneMuted', "assets/game-ui/mute.png");
        this.load.image('x-button', "assets/game-ui/x-button.png");
        this.load.image('pixel-box', "assets/game-ui/pixel-box.png");
        // this.load.image('volume',"assets/game-ui/high-volume.png");
        this.load.image('machine', 'assets/machine.png');
        this.load.image('retro-background', "assets/retro-background.jpeg");

        this.load.image('comment', 'assets/game-ui/comment.png');

        this.load.image('ball', 'assets/ball.png');



        // THIS LOAD BUILDSHIP
        this.load.image('buildship', 'assets/projects/buildship/buildship.png');
        

        // THIS LOAD CRYPTO DUCKIES
        this.load.image('duckies', 'assets/projects/crypto-duckies/duckies.png');
        

        // LOAD TWITTER
        this.load.image('twitter', 'assets/game-ui/twitter.png');

        // LOAD GITHUB
        this.load.image('github', 'assets/game-ui/github.png');

        // LOAD CHARACTERS
        this.load.image('duckie', 'assets/characters/153.png');

        // LOAD SHADOW
        this.load.image('shadow', 'assets/shadow.png');

        // LOAD DISCORD ICON
        this.load.image('discord', 'assets/game-ui/discord.png');

        // LOAD SNOW PARTICLE
        this.load.image('snow-particle', 'assets/snow.png');
        // !!! LOAD EFFECTS
        this.load.spritesheet('fire-effect', 'assets/effects/fire-effect.png', {frameWidth: 100, frameHeight: 100});


        // LOAD ICONS
        this.load.spritesheet('icons', 'assets/game-ui/icons.png', {
            frameWidth: 16,
            frameHeight: 16,
            margin: 8,
            spacing: 8
        });


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

        // LOADING CHARACTERS
        for (let i = 0; i < 50; i++) {
            this.load.spritesheet(`characters${i}`,
                `assets/Other/${i}.png`,
                {
                    frameWidth: 32,
                    frameHeight: 32,
                    margin: 0,
                    spacing: 0
                });
        }

    }

    create() {
        this.scene.start('start');
    }
}