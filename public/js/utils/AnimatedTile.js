export class AnimatedTile {
    constructor(tile, tileAnimationData, firstgid) {
        this.tile = tile;
        this.tileAnimationData = tileAnimationData;
        this.firstgid = firstgid;
        this.elapsedTime = 0;
        this.animationDuration = tileAnimationData[0].duration * tileAnimationData.length;
    }

    update(delta) {
        this.elapsedTime += delta;
        this.elapsedTime %= this.animationDuration;

        const animatonFrameIndex = Math.floor(this.elapsedTime / this.tileAnimationData[0].duration);
        this.tile.index = this.tileAnimationData[animatonFrameIndex].tileid + this.firstgid;
    }
}