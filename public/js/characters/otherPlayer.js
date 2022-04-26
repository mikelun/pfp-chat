import Phaser from "phaser";
const spriteSpeed = 1.5;

export class OtherPlayer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, textureId) {
        super(scene, x, y, textureId);
        this.oldX = x;
        this.oldY = y;
        this.textureId = textureId.replace('characters', '');
    }
    update(x, y) {
        const textureFromInternet = this.textureId ? true : false;
        if (y < this.oldY) {
            if (textureFromInternet) {
                // DO SOMETHING
            } else {
                this.anims.play(`player-walk-up${this.textureId}`, true);
            }
        } else if (y > this.oldY) {
            if (textureFromInternet) {
                // DO SOMETHING
            } else {
                this.anims.play(`player-walk-down${this.textureId}`, true);
            }
        } else if (x < this.oldX) {
            if (textureFromInternet) {
                this.flipX = true;
            } else {
                this.anims.play(`player-walk-left${this.textureId}`, true);
            }
        } else if (x > this.oldX) {
            if (textureFromInternet) { 
                this.flipX = false;
            } else {
                this.anims.play(`player-walk-right${this.textureId}`, true);
            }
        }

        if (this.oldX === x && this.oldY === y) {
            this.anims.stop();
        }
        this.oldX = x;
        this.oldY = y;

    }
}

Phaser.GameObjects.GameObjectFactory.register('otherPlayer', function (x, y, textureId, self) {
    console.log(self.socket.id);
    var sprite = new OtherPlayer(this.scene, x, y, textureId).setScale(1);
    this.displayList.add(sprite);
    this.updateList.add(sprite);
    return sprite;
})