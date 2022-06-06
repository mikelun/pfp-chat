export function createAnimationForPlayer(anims, type) {
    anims.create({
        key: `${type}-down`,
        frames: anims.generateFrameNumbers("characters" + type, { start: 0, end: 2 }),
        frameRate: 8,
        repeat: -1
    });
    anims.create({
        key: `${type}-up`,
        frames: anims.generateFrameNumbers("characters" + type, { start: 9, end: 11}),
        frameRate: 8,
        repeat: -1
    });
    anims.create({
        key: `${type}-left`,
        frames: anims.generateFrameNumbers("characters" + type, { start: 3, end: 5 }),
        frameRate: 8,
        repeat: -1
    });
    anims.create({
        key: `${type}-right`,
        frames: anims.generateFrameNumbers("characters" + type, { start: 6, end: 8 }),
        frameRate: 8,
        repeat: -1
    });
}

export function createAnimationForNFTBackround(anims, type) {
    const key = 'nft-' + type;
    anims.create({
        key: `${key}-run`,
        frames: anims.generateFrameNumbers(key, { start: 0, end: 5 }),
        frameRate: 14,
        repeat: -1
    });
}

export function createAnimationForAnimal(anims, name) {
    anims.create({
        key: `${name}-Walk`,
        frames: `${name}-Walk`,
        frameRate: 12,
        repeat: -1
    });
    anims.create({
        key: `${name}-Idle`,
        frames: `${name}-Idle`,
        frameRate: 12,
        repeat: -1
    })
}