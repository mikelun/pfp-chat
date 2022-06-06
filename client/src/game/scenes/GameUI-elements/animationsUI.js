export function createAnimationsUI(self) {
    // create animations for chest
    self.anims.create({
        key: 'chest1-idle',
        frames: self.anims.generateFrameNumbers('chests', { start: 0, end: 0 }),
        frameRate: 1,
        repeat: -1
    });

    self.anims.create({
        key: 'chest2-idle',
        frames: self.anims.generateFrameNumbers('chests', { start: 20, end: 20 }),
        frameRate: 1,
        repeat: -1
    });

    self.anims.create({
        key: 'chest3-idle',
        frames: self.anims.generateFrameNumbers('chests', { start: 30, end: 30 }),
        frameRate: 1,
        repeat: -1
    });

    // create background lighting animation
    self.anims.create({
        key: 'background-lighting',
        frames: self.anims.generateFrameNumbers('background-lighting', { start: 0, end: 19}),
        frameRate: 12,
        repeat: -1
    })

}