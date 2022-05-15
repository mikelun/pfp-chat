import { sceneEvents } from "../../Events/EventsCenter";
var tipText;

export function createTalkIcons(self) {
    
    self.add.image(70, 680, 'long-button').setScale(1.8, 1.6).setAlpha(0.8);
    tipText = self.add.text(20, 625, '', { fill: "#ffffff", fontSize: "30px", fontFamily: "PixelFont", align: "center" });

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
    const hooverHeadphones = self.rexUI.add.roundRectangle(90, 683 - 3, 45, 38, 10, 0x27324f).setAlpha(0);
    const headphones = self.add.image(90, 683, 'headphones').setScale(1.3);
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
    const hooverMicrophone = self.rexUI.add.roundRectangle(45, 683 - 3, 45, 38, 10, 0x27324f).setAlpha(0);
    const microphone = self.add.image(45, 678, 'microphone1-off').setScale(1.2);
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