import Phaser from "phaser";
import { artifactsCharacters } from "../Artifacts/artifacts";
import { animateMovement } from "./animateMovement";
const spriteSpeed = 1.5;

export class OtherPlayer extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, textureId) {
        super(scene, x, y, textureId);
        this.oldX = x;
        this.oldY = y;
        this.textureId = textureId.replace('characters', '');
        this.walkEffect = 0.025;
    }
    update(x, y) {
        // get direction of player
        var directionX, directionY;

        if (y < this.oldY) {
            directionY = "up";
        } else if (y > this.oldY) {
            directionY = "down";
        } else if (x < this.oldX) {
            directionX = "left";
        } else if (x > this.oldX) {
            directionX = "right";
        }
        if (directionX || directionY) {
            animateMovement(this, directionX, directionY, this.nftType);
        }
        
        if (this.oldX === x && this.oldY === y) {
            this.rotation = 0;
            if (!artifactsCharacters[this.texture.key]) this.anims.stop();
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