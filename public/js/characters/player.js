import Phaser from "phaser";
const spriteSpeed = 1.5;

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
    }

    update(keyUp, keyDown, keyLeft, keyRight, jUp, jDown, jLeft, jRight, type, self) {

        if (keyUp.isDown || jUp.isDown) {
            this.y -= spriteSpeed;
        }
        if (keyDown.isDown || jDown.isDown) {
            this.y += spriteSpeed;
        }
        if (keyLeft.isDown || jLeft.isDown) {
            this.x -= spriteSpeed;
        }
        if (keyRight.isDown || jRight.isDown) {
            this.x += spriteSpeed;
        }
        if (keyUp.isDown || jUp.isDown) {
            this.anims.play(`player-walk-up${type}`, true);
        } else if (keyDown.isDown || jDown.isDown) {
            this.anims.play(`player-walk-down${type}`, true);
        } else if (keyLeft.isDown || jLeft.isDown) {
            this.anims.play(`player-walk-left${type}`, true);
        } else if (keyRight.isDown || jRight.isDown) {
            this.anims.play(`player-walk-right${type}`, true);
        }      

        if (!(keyUp.isDown || jUp.isDown) && !(keyDown.isDown || jDown.isDown) && !(keyLeft.isDown || jLeft.isDown) && !(keyRight.isDown || jRight.isDown)) {
            this.anims.stop();
        }

    }
}

Phaser.GameObjects.GameObjectFactory.register('player', function (x, y, texture,  frame) {
	var sprite = new Player(this.scene, x, y, texture, frame).setScale(1);
	this.displayList.add(sprite)
	this.updateList.add(sprite)
	return sprite;
})