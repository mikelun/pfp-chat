import { hideEmotionsWheelPanel, showEmotionsWheelPanel } from "./playerUI";

export function initializeEmotionsWheel(self) {
    self.input.keyboard.on('keydown-Y', function (event) {
        if (!self.player || self.blockedMovement || !self.playerUI.second[self.player.id]) return;
        showEmotionsWheelPanel(self, self.player.id);
    });


    self.input.keyboard.on('keyup-Y', function (event) {
        hideEmotionsWheelPanel(self, self.player.id);
    });
}
export function createEmotion(self, type) {
    const emotion = self.add.sprite(20, 0, `emotion${type}`).setScale(0.5);
    
    createEmotionAnimation(self, emotion);

    return emotion;
}   

function createEmotionAnimation(self, emotion) {
    if (self.anims.get(emotion.texture.key)) {
        emotion.play(emotion.texture.key);
        return;
    }

    self.anims.create({
        key: emotion.texture.key,
        frames: self.anims.generateFrameNumbers(emotion.texture.key, { start: 0, end: 63 }),
        frameRate: 15,
        repeat: 0
    });

    emotion.on('animationcomplete', () => {
        emotion.setVisible(false);
        emotion.destroy();
    });

    emotion.play(emotion.texture.key);
}