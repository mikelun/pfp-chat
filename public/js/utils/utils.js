/**
 * Initialize main tile map
 * @param {Scene} self 
 */
export function initMainMap(self) {
    const dungeon = self.make.tilemap({ key: 'dungeon' });
    const tileset = dungeon.addTilesetImage('indoors', 'tiles');
    dungeon.createStaticLayer('background', tileset);
    dungeon.createStaticLayer('structure', tileset);
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