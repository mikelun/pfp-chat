import Phaser from "phaser";
import { sceneEvents } from "../../Events/EventsCenter";
import { nextSong, pauseMusic, previousSong, resumeMusic, startPlayingMusic } from "./musicLogic";
export function initializeMusicPlayerPanel(self) {
    self.panelBackground = self.rexUI.add.roundRectangle(0, 0, 300, 200, 8, 0xece6db).setOrigin(0);
    const panelOutline = self.rexUI.add.roundRectangle(-2, -2, 300, 200, 8, 0x000000).setOrigin(0).setScale(1.01);
    
    // add shadow for self.panelBackground
    const panelBackgroundShadow = self.rexUI.add.roundRectangle(5, 5, 300, 200, 8, 0x333333).setOrigin(0).setAlpha(0.8);

    const panelLine1 = self.add.rectangle(150, 30, 270, 1, "#000000");
    const panelLine2 = self.add.rectangle(150, 70, 270, 1, "#000000");
    
    // love at center
    self.panelX = getIconFromSpritesheet(self, 150, 30, 3)

    const text1 = self.add.text(200, 5, 'OPEN FM', { fill: "#000000", fontSize: "20px", fontFamily: "PixelMonoFont", align: "center" });
    
    const text5 = self.add.text(15, 45, 'CHANNEL: LOFI HIP HOP', { fill: "#000000", fontSize: "16px", fontFamily: "PixelMonoFont", align: "center" });


    self.timeMusic = self.add.text(15, 80, '00:01 / 06:17', { fill: "#000000", fontSize: "12px", fontFamily: "PixelMonoFont", align: "center" });
    
    const text3 = self.add.text(15, 100, 'LOFI CHILL & RELAX', { fill: "#000000", fontSize: "18px", fontFamily: "PixelMonoFont", align: "center" });

    const text4 = self.add.text(15, 127, 'LOFI AUTHOR', { fill: "#000000", fontSize: "12px", fontFamily: "PixelMonoFont", align: "center" });
    
    sceneEvents.on('newSong', (name, author) => {
        // to upper text
        text3.setText(name.toUpperCase());
        text4.setText(author.toUpperCase());
    });

    const arrowIconId = 21 * 3 + 13 - 1;
    const arrowIcon1 = getIconFromSpritesheet(self, 30, 170, arrowIconId);
    arrowIcon1.setScale(2);
    arrowIcon1.rotation = -Math.PI / 2;
    const hvArrowIcon1 = addHoverForIcon(self, arrowIcon1, 30, 170);
    onLeftArrowPointerDown(arrowIcon1, self);

    const arrowIcon2 = getIconFromSpritesheet(self, 130, 170, arrowIconId);
    arrowIcon2.setScale(2);
    arrowIcon2.rotation = Math.PI / 2;
    const hvArrowIcon2 = addHoverForIcon(self, arrowIcon2, 130, 170);
    onRightArrowPointerDown(arrowIcon2, self);

    const twitterIconId = 3 * 21 - 4;
    const twitterIcon = getIconFromSpritesheet(self, 230, 170, twitterIconId);
    twitterIcon.setScale(2);
    const hvTwitterIcon = addHoverForIcon(self, twitterIcon, 230, 170);
    onTwitterPointerDown(twitterIcon);

    const instagramIconid = 21 - 4;
    const instagramIcon = getIconFromSpritesheet(self, 270, 170, instagramIconid);
    instagramIcon.setScale(2);
    const hvInstagramIcon = addHoverForIcon(self, instagramIcon, 270, 170);
    onInstagramPointerDown(instagramIcon);

    const playIconId = 21 + 1;
    const playIcon = getIconFromSpritesheet(self, 80, 170, playIconId);
    playIcon.setScale(2);
    const hvPlayIcon = addHoverForIcon(self, playIcon, 80, 170);
    onPlayMusicPointerDown(playIcon, self);

    var musicContainer = self.add.container(0, 0, [panelBackgroundShadow, panelOutline, self.panelBackground, hvArrowIcon1, hvArrowIcon2, hvPlayIcon, hvTwitterIcon, hvInstagramIcon, panelLine1, panelLine2, self.panelX, text1, self.timeMusic, text3, text4, text5, arrowIcon1, playIcon, arrowIcon2, twitterIcon, instagramIcon]);
    musicContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, self.panelBackground.width, self.panelBackground.height), Phaser.Geom.Rectangle.Contains);
    self.input.setDraggable(musicContainer);

    musicContainer.on('drag', function (pointer, dragX, dragY) {

        this.x = dragX;
        this.y = dragY;

    });

    musicContainer.x = 900;
    musicContainer.y = 70;

    startPlayingMusic(self);
}

function getIconFromSpritesheet(self, x, y, id) {
    const icon = self.add.image(x, y, 'icons');
    // get the 10 frame from the spritesheet
    // 21 columns 
    icon.setInteractive();
    icon.setFrame(id);
    return icon;
}

function addHoverForIcon(self, object, x, y) {
    const shadowIcon = self.rexUI.add.roundRectangle(x, y, 40, 40, 10, 0x000000).setAlpha(0);
    // if point on object
    object.on('pointerover', function (pointer) {
        console.log('here');
        shadowIcon.setAlpha(0.3);
    });
    object.on('pointerout', function (pointer) {
        shadowIcon.setAlpha(0);
    });

    return shadowIcon;
}

function onTwitterPointerDown(object) {
    object.on('pointerdown', function (pointer) {
        // open twitter page
        window.open('https://twitter.com/mikelun_eth');
    });
}

function onInstagramPointerDown(object) {
    object.on('pointerdown', function (pointer) {
        // open twitter page
        window.open('https://www.instagram.com/mikelun.eth/');
    });
}

function onLeftArrowPointerDown(object, self) {
    object.on('pointerdown', function (pointer) {
        previousSong(self);
    });
}

function onRightArrowPointerDown(object, self) {
    object.on('pointerdown', function (pointer) {
        nextSong(self);
    });
}

function onPlayMusicPointerDown(object, self) {
    object.on('pointerdown', function (pointer) {
        if (self.myAudio) {
            if (!self.myAudio.paused) {
                console.log("TRYING TO PAUSE MUSIC");
                pauseMusic(self);
            } else {
                resumeMusic(self);
            }
        }
    });
    
}