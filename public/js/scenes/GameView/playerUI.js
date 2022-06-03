import { sceneEvents } from "../../Events/EventsCenter";
import { randColor } from "../../socketController/playerSocket";
import { makeButtonInteractive } from "../GameUI-elements/lowButttons";
import { createHostEffect, createSpeakerEffect, createTalkingEffect } from "./addEffectToPlayer";
import { createEmotion } from "./emotinos";


/**
 * ONE LEVEL DOWN FOR PLAYER (EFFECTS WILL BE ON BACK OF PLAYER)
 */
export function createPlayerUILevelDown(self, playerInfo) {
    //hostEffect.alpha = 0.3;
    const hostEffect = createHostEffect(self, 1, 23);
    if (playerInfo.isHost) hostEffect.setAlpha(1);

    const cohostEffect = createSpeakerEffect(self, 1, 23);
    cohostEffect.id = 'cohost-effect';

    const containerLevelDown = self.add.container(0, 0, [hostEffect, cohostEffect]);

    // set level of layer to 24
    containerLevelDown.setDepth(24);

    self.playerUI.first[playerInfo.playerId] = containerLevelDown;
}


/**
 * MAIN PLAYER UI - MICROPHONE, HEADPHONES
 */
export function createPlayerUI(self, playerInfo) {
    const textColor = randColor();

    let microphoneTexture = playerInfo.microphoneStatus ? "microphone1" : "microphone1-off";
    let headphonesTexture = playerInfo.deafen ? "headphones-off" : "headphones";

    const background = self.rexUI.add.roundRectangle(0 - 0.25, 0 - 5, playerInfo.playerName.length * 5 + 5, 8, 6, 0x000000).setAlpha(0.5);
    const playerText = self.add.text(0, -7, playerInfo.playerName, { fontSize: '125px', fontFamily: 'PixelFont', fill: textColor, align: 'center' }).setScale(0.1).setOrigin(0.5);
    const microphone = self.add.image(-4, -15, microphoneTexture).setScale(0.25);
    const headphones = self.add.image(4, -14, headphonesTexture).setScale(0.25);
    const talkingEffect = createTalkingEffect(self, 0, 20);
    const emotionsWheelGroup = createEmotionWheel(self);
    const container = self.add.container(0, 0, [background, playerText, microphone, headphones, talkingEffect, ...emotionsWheelGroup]);

    container.setDepth(26);

    self.playerUI.second[playerInfo.playerId] = container;
}

/**
 * IN CONTAINTER
 * 0 - background
 * 1 - playerText
 * 2 - microphone
 * 3 - headphones
 * 4 - talkingEffect
 * 5 - weapon
 */
export function updatePlayerUI(self, playerInfo) {
    const container = self.playerUI.second[playerInfo.playerId];

    if (container) {
        const background = container.getAt(0);
        const playerText = container.getAt(1);
        playerText.setText(playerInfo.playerName);

        background.width = playerInfo.playerName.length * 5 + 5;

        const microphone = container.getAt(2);
        const headphones = container.getAt(3);
        microphone.setTexture(playerInfo.microphoneStatus ? "microphone1" : "microphone1-off");
        headphones.setTexture(playerInfo.deafen ? "headphones-off" : "headphones");

        container.list.forEach(child => {
            if (child.id == 'weapon') {
                weapon.setTexture(playerInfo.weapon.texture);
            }
        });
    }
}


export function getWeaponFromUI(playerUI) {
    playerUI.list.forEach(child => {
        if (child.id == 'weapon') {
            return child;
        }
    });
}

export function updateTalkingEffect(self, isTalking, playerId) {
    console.log('updateing talking effect for player: ', playerId);
    if (!self.playerUI.second[playerId]) return;

    const talkingEffect = self.playerUI.second[playerId].getAt(4);
    talkingEffect.setAlpha(isTalking ? 1 : 0);
}


/**
 * BACKGROUND EFFECT FOR ALL SPEAKERS (NOT FOR HOST)
 */
export function updateSpeakerEffect(self, playerInfo) {
    if (!self.playerUI.first[playerInfo.playerId]) return;

    const cohostEffect = self.playerUI.first[playerInfo.playerId].getAt(1);
    cohostEffect.setAlpha(playerInfo.isSpeaker ? 1 : 0);

}
export function clearPlayerUI(self, playerId) {
    if (self.playerUI.second[playerId]) {
        self.playerUI.second[playerId].destroy();
        delete self.playerUI.second[playerId];
    }
    if (self.playerUI.first[playerId]) {
        self.playerUI.first[playerId].destroy();
        delete self.playerUI.first[playerId];
    }
}

export function showEmotion(self, playerId, type) {
    if (!self.playerUI.second[playerId]) return;

    const container = self.playerUI.second[playerId];
    const emotion = createEmotion(self, type);
    container.add(emotion);
}

export function createEmotionWheel(self, playerId) {

}

/**
 *  CREATE COHOST REQUEST PANEL ONLY FOR HOST
 */
export function createSpeakRequest(self, playerId) {
    const { x, y } = { x: 0, y: -25 };
    const panel = self.add.image(0, -25, 'cell-info').setScale(0.5, 0.2);

    const text = self.add.text(x, y - 10, 'SPEAK REQUEST', { fontSize: '120px', fontFamily: 'PixelFont', fill: '#ffffff', align: 'center' }).setOrigin(0.5).setScale(0.1);

    const yesBackground = self.add.image(x - 18, y + 5, 'long-button').setScale(0.4).setAlpha(0.8);
    const yesText = self.add.text(yesBackground.x, yesBackground.y - 2, 'Yes', { fontSize: '120px', fontFamily: 'PixelFont', fill: '#ffffff', align: 'center' }).setOrigin(0.5).setScale(0.1);

    const noBackground = self.add.image(x + 15, y + 5, 'long-button').setScale(0.4).setAlpha(0.8);
    const noText = self.add.text(noBackground.x, noBackground.y - 2, 'No', { fontSize: '120px', fontFamily: 'PixelFont', fill: '#ffffff', align: 'center' }).setOrigin(0.5).setScale(0.1);

    makeButtonInteractive(yesBackground, '', 0, 0);
    yesBackground.on('pointerdown', () => {
        sceneEvents.emit('approveSpeakRequest', { playerId: playerId });
        panel.destroy();
        yesBackground.destroy();
        yesText.destroy();
        noBackground.destroy();
        noText.destroy();
        text.destroy();
    })

    makeButtonInteractive(noBackground, '', 0, 0);
    noBackground.on('pointerdown', () => {
        panel.destroy();
        yesBackground.destroy();
        yesText.destroy();
        noBackground.destroy();
        noText.destroy();
        text.destroy();
    });

    self.playerUI.second[playerId].add(panel);
    self.playerUI.second[playerId].add(text);
    self.playerUI.second[playerId].add(yesBackground);
    self.playerUI.second[playerId].add(yesText);
    self.playerUI.second[playerId].add(noBackground);
    self.playerUI.second[playerId].add(noText);

}

/**
 * CREATE PLAYER INFO WITH TWITTER LINK AND REMOVE FROM COHOST INFO
 */
export function createPlayerInfo(self, playerInfo) {
    const { x, y } = { x: 0, y: -25 };
    const panel = self.add.image(0, -25, 'cell-info').setScale(0.5, 0.2);
    const removeBackground = self.add.image(x, y, 'long-button').setScale(0.5).setAlpha(0.8);
    const removeText = self.add.text(removeBackground.x, removeBackground.y - 2, 'MUTE', { fontSize: '120px', fontFamily: 'PixelFont', fill: '#ffffff', align: 'center' }).setOrigin(0.5).setScale(0.1);

    makeButtonInteractive(removeBackground, '', 0, 0);
    removeBackground.on('pointerdown', () => {
        sceneEvents.emit('removeFromSpeakers', { playerId: playerInfo.playerId });
        panel.destroy();
        removeBackground.destroy();
        removeText.destroy();
        closeButton.destroy();
    });

    const closeButton = self.add.image(x + 32, y - 12, 'close-button').setScale(0.75).setAlpha(0.8);
    makeButtonInteractive(closeButton, '', 0, 0);
    closeButton.on('pointerdown', () => {
        panel.destroy();
        removeBackground.destroy();
        removeText.destroy();
        closeButton.destroy();
    })

    self.playerUI.second[playerInfo.playerId].add(panel);
    self.playerUI.second[playerInfo.playerId].add(removeBackground);
    self.playerUI.second[playerInfo.playerId].add(removeText);
    self.playerUI.second[playerInfo.playerId].add(closeButton);
}

function createEmotionWheel(self) {
    const {x, y} = {x: 0, y: 10};

    const emotionsWheelBackground = self.add.image(x, y, 'emotions-wheel').setScale(0.5).setAlpha(0.6);
    emotionsWheelBackground.setVisible(false);
    emotionsWheelBackground.id = 'emotions-wheel';

    var emotions = [];
    // creaste 8 emotions on circle with radius 30
    for (let i = 0; i < 8; i++) {
        // create pos with radius 30
        const angle = i * (360 / 8);
        const xPos = x + Math.cos(angle * Math.PI / 180) * 55;
        const yPos = y + Math.sin(angle * Math.PI / 180) * 55;

        const emotion = self.add.sprite(xPos, yPos, `emotion${i + 1}`).setScale(0.5).setFrame(20).setAlpha(0.6);
        const backgroundRectangle = self.add.rectangle(xPos, yPos, 50, 50, 0x000000).setAlpha(0.0001).setInteractive();
        // add emotion on hoover event
        backgroundRectangle.on('pointerover', () => {
            emotion.setAlpha(1);
        });
        // remove emotion on hoover event
        backgroundRectangle.on('pointerout', () => {
            emotion.setAlpha(0.6);
        });

        backgroundRectangle.on('pointerdown', () => {
            showEmotion(self, self.player.id, i + 1);
        });

        emotions.push(emotion);
        emotion.setVisible(false);
        emotion.id = 'emotions-wheel';

        backgroundRectangle.setVisible(false);
        backgroundRectangle.id = 'emotions-wheel';
        emotions.push(backgroundRectangle);
    }
    return [emotionsWheelBackground, ...emotions];
}

export function showEmotionsWheelPanel(self, playerId) {
    if (!self.playerUI.second[playerId]) return;

    self.playerUI.second[playerId].list.forEach(child => {
        if (child.id == 'emotions-wheel') {
            child.setVisible(true);
        }
    })  
}

export function hideEmotionsWheelPanel(self, playerId) {
    if (!self.playerUI.second[playerId]) return;

    self.playerUI.second[playerId].list.forEach(child => {
        if (child.id == 'emotions-wheel') {
            child.setVisible(false);
        }
    })
}