/**
 * Initialize main tile map
 * @param {Scene} self 
 */
import Phaser from "phaser";
import { AnimatedTile } from "./AnimatedTile";


export function initMainMap(self) {

    /// DEBUG COLLISIONS
    const debugConfig = {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    };
    const debugGraphics = self.add.graphics().setAlpha(1);
    // END DEBUG

    const dungeon = self.make.tilemap({ key: 'dungeon' });
    const tileset = dungeon.addTilesetImage('TilemapDay', 'tiles');

    //console.log(tileset);
    //console.log(dungeon);
    dungeon.createStaticLayer('floor', tileset);
    self.stairsUpFloorLayer = dungeon.createStaticLayer('stairs-up-floor', tileset);
    self.stairsUpFloorLayer.setCollisionByProperty({ collides: true })//.renderDebug(debugGraphics, debugConfig);

    self.objectsLayer = dungeon.createDynamicLayer('objects', tileset);
    self.objectsLayer.setCollisionByProperty({ collides: true })//.renderDebug(debugGraphics, debugConfig);

    dungeon.createStaticLayer('next-objects', tileset);
    self.wallsLayer = dungeon.createStaticLayer('walls', tileset);
    self.wallsLayer.setCollisionByProperty({ collides: true })//.renderDebug(debugGraphics, debugConfig);

    let animations;
    for (let tileId in tileset.tileData) {
        animations = tileId;
    }

    const tileData = tileset.tileData;

    self.animatedTiles = [];
    for (let tileid in tileData) {
        dungeon.layers.forEach(layer => {
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
    //console.log(self.animatedTiles.init(dungeon));
}

export function initKeysForController(self) {
    self.keyUp = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    self.keyDown = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    self.keyLeft = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    self.keyRight = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
}

export function updatePlayerPosition(self) {
    if (self.cursorKeys) {
        self.player.update(
            false,
            false,
            false,
            false,
            self.cursorKeys.up,
            self.cursorKeys.down,
            self.cursorKeys.left,
            self.cursorKeys.right,
            self.textureId,

        );
    }
    else {
        self.player.update(
            self.keyUp,
            self.keyDown,
            self.keyLeft,
            self.keyRight,
            false,
            false,
            false,
            false,
            self.textureId
        );
    }
}