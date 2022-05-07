import Phaser from 'phaser'
import { goToPlanet, lastVisitSetup, microphoneWasInitialized, playerWasAtPlanet, showCurrentLevel } from './StartScene/default-levels/showLevels';
import { initializeRooms } from './StartScene/initializeRooms';

var bg1, bg2;
var tilePosition = 0;
var gameWidth, gameHeight;
export class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: "start" });
    }

    create() {
        // initialize room
        initializeRooms(this);

        // step = 0
        this.step = 0;

        // get game width and height
        gameWidth = this.sys.game.config.width;
        gameHeight = this.sys.game.config.height;

        // create background for start scene
        bg1 = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'bg-1').setOrigin(0).setScale(3.4);
        this.addPlanet();
        // add thunder
        this.addThunder();
        bg2 = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'bg-2').setOrigin(0).setScale(3.4);


        // Add Open Metaverse text
        this.addOpenMetaverseText();

        // add levels for text
        this.addLevelsPanel();

        // ADD OPPORTUNITY TO SKIP TEXT
        this.skip = false;
        this.input.on('pointerdown', () => {
            this.skip = true;
        });
        
        // this.step = 3;
        // showCurrentLevel(this);
        
        // IF PLAYER WAS AT PLANET
        if (localStorage.getItem('microphone') == 'true' && localStorage.getItem('lastVisit') == 'true') {
            playerWasAtPlanet(this);
        }
        // add enter text
        this.addEnterText();

        // add key events
        this.addKeyEvents();


    }

    update() {
        // update background position
        if (bg2) {
            bg2.setTilePosition(tilePosition, 0);
            tilePosition += 0.4;
        }

        // if first tap enter 
        if (this.moveText) {
            // move text to left corner
            //this.oText.x = 49;
            this.oText.x -= 10;
            this.mText.x -= 13.7;
            this.oText.y -= 2.5;
            this.mText.y -= 2.5;
            this.oText.scale -= 0.015;
            this.mText.scale -= 0.015;
            this.levelsPanel.y -= 13;
            if (this.oText.x < 50) {
                this.levelsPanel.y = 2;
                this.moveText = false;
                showCurrentLevel(this);
            }
        }


    }

    addOpenMetaverseText() {
        this.oText = this.add.text(400, 100, 'PFP', { fill: "#00cfe5", fontSize: "220px", align: "center", fontFamily: "PixelFont" });
        this.oText.setShadow(5, 5, "#00cfe5", 0);

        this.mText = this.add.text(650, 100, 'CHAT', { fill: "#c200db", fontSize: "220px", align: "center", fontFamily: "PixelFont" });
        this.mText.setShadow(3, 3, "#c200db", 0);
    }

    addEnterText() {
        this.enterText = this.add.image(660, 500, 'press-enter-text').setScale(2);

        // every 0.5 secs call the function
        this.time.addEvent({
            delay: 500,
            callback: () => {
                this.enterText.setAlpha(this.enterText.alpha ? 0 : 1);
            },
            loop: true
        })
    }

    addThunder() {
        this.thunder = this.add.sprite(100, 50, 'thunder').setOrigin(0).setScale(8);
        // animate thunder
        this.anims.create({
            key: 'thunder',
            frames: this.anims.generateFrameNumbers('thunder', { start: 0, end: 11 }),
            frameRate: 10,
        });
        this.thunder.play('thunder');
        // when anim is done, destroy it
        this.thunder.on('animationcomplete', () => {
            this.thunder.alpha = 0;
        });
        this.time.addEvent({
            delay: 4000,
            callback: () => {
                this.thunder.alpha = 1;
                this.thunder.play('thunder');
                this.thunder.x = Math.random() * gameWidth;
            },
            loop: true
        });
    }


    addPlanet() {
        this.planet = this.add.sprite(1100, 150, 'planet0').setScale(4).setAlpha(0.7);
        this.anims.create({
            key: 'planet0',
            frames: this.anims.generateFrameNumbers('planet0', { start: 0, end: 29 }),
            frameRate: 6,
            repeat: -1,
        })
        this.planet.play('planet0', 2, true);
    }

    addKeyEvents() {
        // if enter has tapped
        this.input.keyboard.on('keydown-ENTER', () => {
            this.enterText.destroy();
            // move text to left corner
            this.moveText = true;

            // destroy keydown
            this.input.keyboard.off('keydown-ENTER');
        });
    }

    addLevelsPanel() {
        this.levelsPanel = this.add.image(1620, 600, 'instructions').setScale(5);
    }
}