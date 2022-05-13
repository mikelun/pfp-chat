import Phaser from "phaser";
const spriteSpeed = 1.5;

export class Monster extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, hp) {
        super(scene, x, y, texture, hp);
        this.maxHp = hp;
        this.hp = hp;
    }
    update(x, y, hp) {
        // make a monster running to player
        this.x = x;
        this.y = y;
        
        this.hp = hp;
        this.hpBackground.setPosition(this.x - 30, this.y - 30);
        this.hpBar.setPosition(this.x - 30, this.y - 30);
        this.hpBar.width = this.hp / this.maxHp * 60;

    }
}

Phaser.GameObjects.GameObjectFactory.register('monster', function (x, y, texture, hp) {
    var sprite = new Monster(this.scene, x, y, texture, hp).setScale(1);
    this.displayList.add(sprite);
    this.updateList.add(sprite);
    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
    sprite.setOffset(30, 30);
    sprite.setScale(2);
    sprite.setBodySize(sprite.width * 0.7, sprite.height * 0.7, false);
    
    addUIToMonster(this.scene, sprite);

    createAnimationsForMonster(this.scene, sprite);
    sprite.destroyMonster = destroyMonster;
    return sprite;
});


function createAnimationsForMonster(scene, sprite) {
    scene.anims.create({
        key: 'monster1-fly',
        frames: scene.anims.generateFrameNumbers('monster1', { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: 'monster1-dead',
        frames: scene.anims.generateFrameNumbers('monster1', { start: 10, end: 15 }),
        frameRate: 10,
        repeat: 0
    });
    sprite.play('monster1-fly');
}


function addUIToMonster(scene, sprite) {
    var hpBackground = scene.rexUI.add.roundRectangle(0, 0, 60, 6, 4, 0x333333).setOrigin(0, 0);
    var hpBar = scene.rexUI.add.roundRectangle(0, 0, 40, 6, 4, 0xCC0000).setOrigin(0, 0);
    
    sprite.hpBackground = hpBackground;
    sprite.hpBar = hpBar;
}

function updateHpMonster(sprite, hp) {
    
}

function destroyMonster(sprite) {
    // remove collider 
    sprite.setBodySize(0.1, 0.1, false);
    // player animation and after destroy
    sprite.hpBar.destroy();
        sprite.hpBackground.destroy();
    sprite.play('monster1-dead', true);
    // after animation destroy
    sprite.on('animationcomplete', function () {
        
        sprite.destroy();
    })
}