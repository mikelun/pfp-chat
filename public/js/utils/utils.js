/**
 * Initialize main tile map
 * @param {Scene} self 
 */
import Phaser from "phaser";
export function initMainMap(self) {
    const dungeon = self.make.tilemap({ key: 'dungeon' });
    const tileset = dungeon.addTilesetImage('TilemapDay', 'tiles');
    dungeon.createStaticLayer('floor', tileset);
    dungeon.createStaticLayer('stairs-up-floor', tileset);
    dungeon.createStaticLayer('objects', tileset);
    dungeon.createStaticLayer('next-objects', tileset);
    const wallsLayer = dungeon.createStaticLayer('walls', tileset);
    wallsLayer.setCollisionByProperty({collides: true});

    const debugGraphics = self.add.graphics().setAlpha(0.7);
    wallsLayer.renderDebug(debugGraphics, 
        {tileColor: null,
        collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    });

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
            keyUp,
            keyDown,
            keyLeft,
            keyRight,
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