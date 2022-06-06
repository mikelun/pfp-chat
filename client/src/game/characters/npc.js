import Phaser from "phaser";

export class NPC extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
    }

    update() {
        //animateMovement(this, directionX, directionY, this.nftType);
    }

    createSpeachText(scene, text) {
        if (!this.x) return;
        const background = scene.add.image(this.x, this.y, 'cell-info').setScale(2);
        
    }
}




Phaser.GameObjects.GameObjectFactory.register('npc', function (x, y, texture, frame) {
    var sprite = new NPC(this.scene, x, y, texture, frame).setScale(1);
    this.displayList.add(sprite);
    this.updateList.add(sprite);
    createIdleAnimation(this.scene, sprite, texture);
    addNPCName(this.scene, sprite);

    sprite.setScale(0.7);
    return sprite;
})

function createIdleAnimation(scene, sprite, texture) {
    // create iddle animation
    scene.anims.create({
        key: texture,
        frames: scene.anims.generateFrameNumbers(texture, { start: 0, end: scene.textures.get(texture).frameTotal - 3 }),
        frameRate: 10,
        repeat: -1
    });
    sprite.play(texture);
}

function addNPCName(scene, sprite) {
    var name = scene.add.text(sprite.x, sprite.y - 30, 'CATOMORPHEUS', {
        fontSize: '150px',
        fill: '#ff00ff',
        fontFamily: 'PixelFont',
        align: 'center'
    }).setScale(0.1).setOrigin(0.5, 0.5);
    // add followin to sprite
    sprite.addName = name;
}   
