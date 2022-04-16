/**
 * Initialize main tile map
 * @param {Scene} self 
 */
import Phaser from "phaser";

export function initKeysForController(self) {
    self.keyUp = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    self.keyDown = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    self.keyLeft = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    self.keyRight = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    self.shift = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
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
            self.shift

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
            self.textureId,
            self.shift
        );
    }
}