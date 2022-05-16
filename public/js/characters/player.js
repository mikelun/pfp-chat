import Phaser from "phaser";
import { artifactsCharacters } from "../Artifacts/artifacts";
import { animateMovement } from "./animateMovement";
var spriteSpeed = 100;

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.walkEffect = 0.05;
    }

    update(keyUp, keyDown, keyLeft, keyRight, jUp, jDown, jLeft, jRight, shift) {
        // if player doesn't moving
        const playerMoved = keyUp.isDown || jUp.isDown || keyDown.isDown || jDown.isDown || keyLeft.isDown || jLeft.isDown || keyRight.isDown || jRight.isDown;
        const type = this.texture.key;

        if (!playerMoved) {
            this.setVelocity(0, 0);
            this.rotation = 0;
            if (this.anims && !artifactsCharacters[type]) this.anims.stop();
            return;
        }

        let velY = 0;

        if (shift.isDown) {
            spriteSpeed = 150;
        } else {
            spriteSpeed = 100;
        }
        if (keyUp.isDown || jUp.isDown) {
            velY = -spriteSpeed;
        }
        if (keyDown.isDown || jDown.isDown) {
            velY = spriteSpeed;
        }

        if (keyUp.isDown || jUp.isDown) {
            this.setVelocity(0, -spriteSpeed);
        }
        if (keyDown.isDown || jDown.isDown) {
            this.setVelocity(0, +spriteSpeed)
        }
        if (keyLeft.isDown || jLeft.isDown) {
            this.setVelocity(-spriteSpeed, velY);
        }
        if (keyRight.isDown || jRight.isDown) {
            this.setVelocity(+spriteSpeed, velY);
        }

        if (this.anims) {
            // get direction of player
            var directionX, directionY;
            if (keyUp.isDown || jUp.isDown) {
                directionY = "up";
            }
            if (keyDown.isDown || jDown.isDown) {
                directionY = "down";
            }
            if (keyLeft.isDown || jLeft.isDown) {
                directionX = "left";
            }
            if (keyRight.isDown || jRight.isDown) {
                directionX = "right";
            }
            animateMovement(this, directionX, directionY, this.nftType);
        }
    }
}

Phaser.GameObjects.GameObjectFactory.register('player', function (x, y, texture, frame) {
    var sprite = new Player(this.scene, x, y, texture, frame).setScale(1);
    this.displayList.add(sprite);
    this.updateList.add(sprite);
    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
    sprite.setOffset(10, sprite.height * 0.7);
    sprite.setBodySize(sprite.width * 0.4, sprite.height * 0.4, false);
    sprite.startWidth = sprite.width;
    sprite.startHeight = sprite.height;
    return sprite;
})