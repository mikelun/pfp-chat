export function addEffect(self, x, y, key) {
    const effect = self.add.sprite(x, y, key);
    createAnim(self, key);
    effect.play(key);
    return effect;
}

export function createTalkingEffect(self, x, y) {
    var key = 'effect1';
    const effect = addEffect(self, x, y, key);
    effect.setAlpha(0).setScale(0.2);
    return effect;
}

export function createHostEffect(self, x, y) {
    var key = 'effect7';
    const effect = addEffect(self, x, y, key);
    effect.setAlpha(1).setScale(0.2);
    return effect;
}

function createAnim(self, key) {
    if (self.anims.get(key)) return;

    self.anims.create({
        key: key,
        frames: self.anims.generateFrameNumbers(key, { start: 0, end: 14 }),
        frameRate: 10,
        repeat: -1
    });
}