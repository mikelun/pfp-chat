import Phaser from "phaser";
const spriteSpeed = 1;

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
    }

    /**
     * 
     * @param {Phaser.numbers.Input.Keyboard.CursorKeys} cursors 
     */
    update(keyUp, keyDown, keyLeft, keyRight, type) {

        if (keyUp.isDown) {
            this.y -= spriteSpeed;
        }
        if (keyDown.isDown) {
            this.y += spriteSpeed;
        }
        if (keyLeft.isDown) {
            this.x -= spriteSpeed;
        }
        if (keyRight.isDown) {
            this.x += spriteSpeed;
        }

        if (keyUp.isDown) {
            this.anims.play(`player-walk-up${type}`, true);
        } else if (keyDown.isDown) {
            this.y += spriteSpeed;
            this.anims.play(`player-walk-down${type}`, true);
        } else if (keyLeft.isDown) {
            this.x -= spriteSpeed;
            this.anims.play(`player-walk-left${type}`, true);
        } else if (keyRight.isDown) {
            this.x += spriteSpeed;
            this.anims.play(`player-walk-right${type}`, true);
        }      

        if (!keyUp.isDown && !keyDown.isDown && !keyLeft.isDown && !keyRight.isDown) {
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