import { sceneEvents } from "../../Events/EventsCenter";
var tipText;

export function createTalkIcons(self) {
    self.rexUI.add.roundRectangle(0, 695, 230, 50, 10, 0x191936);
    
    tipText = self.add.text(20, 630, '', { fill: "#ffffff", fontSize: "30px", fontFamily: "PixelFont", align: "center" });

    addHeadphones(self);
    addMicrophone(self);

    
}

function addHooverForObject(object, tint, tipText) {
    object.setInteractive().on('pointerover', () => {
        tint.alpha = 1;
        tipText.alpha = 1;
        tipText.setText(getTextByTexture(object));
    });
    object.setInteractive().on('pointerout', () => {
        tint.alpha = 0;
        tipText.alpha = 0;
    });
}

function getTextByTexture(object) {
    if (object.texture.key == 'headphones') {
        return 'Deafen';
    }
    if (object.texture.key == 'headphones-off') {
        return 'Undeafen';
    }
    if (object.texture.key == 'microphone1') {
        return 'Mute';
    }
    if (object.texture.key == 'microphone1-off') {
        return 'Unmute';
    }
}

function addHeadphones(self) {
    const hooverHeadphones = self.rexUI.add.roundRectangle(85 - 2, 695, 50, 50, 10, 0x666699).setAlpha(0);
    const headphones = self.add.image(85, 698, 'headphones').setScale(1.5);
    headphones.setInteractive().on('pointerdown', () => {
        if (headphones.texture.key == 'headphones') {
            sceneEvents.emit('setDeafen', true);
            headphones.setTexture('headphones-off');
        } else {
            sceneEvents.emit('setDeafen', false);
            headphones.setTexture('headphones');
        }
        tipText.setText(getTextByTexture(headphones));
    });
    addHooverForObject(headphones, hooverHeadphones, tipText);
    sceneEvents.on('updateDeafenStatus', (status) => {
        if (status) {
            headphones.setTexture('headphones-off');
        } else {
            headphones.setTexture('headphones');
        }
    });
}

function addMicrophone(self) {
    const hooverMicrophone = self.rexUI.add.roundRectangle(30 - 2, 695, 50, 50, 10, 0x666699).setAlpha(0);
    const microphone = self.add.image(30, 695, 'microphone1-off').setScale(1.5);
    microphone.setInteractive().on('pointerdown', () => {
        sceneEvents.emit('toggleMute');
    });
    addHooverForObject(microphone, hooverMicrophone, tipText);

    sceneEvents.on('updateMicStatus', (status) => {
        if (status) {
            microphone.setTexture('microphone1');
        } else {
            microphone.setTexture('microphone1-off');
        }
        tipText.setText(getTextByTexture(microphone));
    });

}