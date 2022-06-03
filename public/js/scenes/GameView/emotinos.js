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
export function createEmotion(self, emotionId, isMainPlayer) {

    const emotion = self.add.sprite(0, -20, `emotion${emotionId}`).setScale(2);

    createEmotionAnimation(self, emotion);

    return emotion;
}

function createEmotionAnimation(self, emotion) {
    if (!self.anims.get(emotion.texture.key)) {
        self.anims.create({
            key: emotion.texture.key,
            frames: self.anims.generateFrameNumbers(emotion.texture.key, { start: 0, end: self.textures.get(emotion.texture.key).frameTotal - 3 }),
            frameRate: 8,
            repeat: 0
        });
    }


    emotion.play(emotion.texture.key);
    emotion.on('animationcomplete', () => {
        emotion.setVisible(false);
        emotion.destroy();
    });   
}