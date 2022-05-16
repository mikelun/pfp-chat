export function initialAnimations(self) {
    // create anim for coin1
    self.anims.create({
        key: 'coin1',
        frames: self.anims.generateFrameNumbers('coin1', { start: 0, end: 8 }),
        frameRate: 10,
        repeat: -1,
    })
}