import Phaser from "phaser";
import { artifactsCharacters } from "../Artifacts/artifacts";
import { animateMovement } from "./animateMovement";
var spriteSpeed = 100;

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.walkEffect = 0.05;
    }

    update() {
        //animateMovement(this, directionX, directionY, this.nftType);
    }
}


Phaser.GameObjects.GameObjectFactory.register('npc', function (x, y, texture, talkJson, frame) {
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