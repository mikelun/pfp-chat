import Phaser from "phaser";
/**
 * Intialize keys for controller
 * @param {Scene} self 
 */
 export function initKeysForController(self) {
    console.log("HERE");
    self.keyUp = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    self.keyDown = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    self.keyLeft = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    self.keyRight = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    console.log(self);
}

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
