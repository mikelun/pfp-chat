export function createAnimationForPlayer(anims, type) {
    anims.create({
        key: `player-walk-down${type}`,
        frames: anims.generateFrameNumbers("characters" + type, { start: 0, end: 2 }),
        frameRate: 8,
        repeat: -1
    });
    anims.create({
        key: `player-walk-up${type}`,
        frames: anims.generateFrameNumbers("characters" + type, { start: 9, end: 11}),
        frameRate: 8,
        repeat: -1
    });
    anims.create({
        key: `player-walk-left${type}`,
        frames: anims.generateFrameNumbers("characters" + type, { start: 3, end: 5 }),
        frameRate: 8,
        repeat: -1
    });
    anims.create({
        key: `player-walk-right${type}`,
        frames: anims.generateFrameNumbers("characters" + type, { start: 6, end: 8 }),
        frameRate: 8,
        repeat: -1
    });
}