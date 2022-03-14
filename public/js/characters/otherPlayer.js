import Phaser from "phaser";
const spriteSpeed = 1.5;

export class OtherPlayer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, textureId, frame) {
        super(scene, x, y, textureId, frame);
        this.oldX = x;
        this.oldY = y;
        this.textureId = textureId.replace('characters', '');
    }
    update(x, y) {
        if (y < this.oldY) {
            this.anims.play(`player-walk-up${this.textureId}`, true);
        } else if (y > this.oldY) {
            this.anims.play(`player-walk-down${this.textureId}`, true);
        } else if (x < this.oldX) {
            this.anims.play(`player-walk-left${this.textureId}`, true);
        } else if (x > this.oldX) {
            this.anims.play(`player-walk-right${this.textureId}`, true);
        }      

        if (this.oldX === x && this.oldY === y) {
            this.anims.stop();
        }
        this.oldX = x;
        this.oldY = y;

    }
}

Phaser.GameObjects.GameObjectFactory.register('otherPlayer', function (x, y, textureId,  frame) {
	var sprite = new OtherPlayer(this.scene, x, y, textureId, frame).setScale(1);
	this.displayList.add(sprite)
	this.updateList.add(sprite)
	return sprite;
})