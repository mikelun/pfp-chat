class AnimatedTile {
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

export function addAnimationForMap(self, map, tileset) {
    let animations;
    for (let tileId in tileset.tileData) {
        animations = tileId;
    }

    const tileData = tileset.tileData;

    self.animatedTiles = [];
    for (let tileid in tileData) {
        map.layers.forEach(layer => {
            if (layer.tilemapLayer.type === "StaticTilemapLayer") return;
            layer.data.forEach(tileRow => {
                tileRow.forEach(tile => {
                    if (tile.index - tileset.firstgid === parseInt(tileid, 10)) {
                        self.animatedTiles.push(
                            new AnimatedTile(
                                tile,
                                tileData[tileid].animation,
                                tileset.firstgid
                            )
                        );
                    }
                });
            });
        });
    }
}