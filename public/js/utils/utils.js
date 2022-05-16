/**
 * Initialize main tile map
 * @param {Scene} self 
 */
import Phaser from "phaser";

var self;
export const tryOr = async (fn, defaultValue) => {
    try {
        return await fn();
    }
    catch (e) {
        return defaultValue;
    }
}

export function initKeysForController(newSelf) {
    self = newSelf;

    self.keyUp = {isDown: false};
    self.keyDown = {isDown: false};
    self.keyLeft = {isDown: false};
    self.keyRight = {isDown: false};
    self.shift = {isDown: false};

    self.blockedMovement = false;

    const keys = [self.keyUp, self.keyDown, self.keyLeft, self.keyRight, self.shift];
    const keysNames = ['W', 'S', 'A', 'D', 'SHIFT'];
    
    for (let i = 0; i < keys.length; i++) {
        self.input.keyboard.on('keydown-' + keysNames[i], function (event) {
            if (!self.blockedMovement) {
                keys[i].isDown = true;
                if (i < 4) keys[i + ((i % 2) == 0 ? 1 : -1)].isDown = false;
            }
        });
        self.input.keyboard.on('keyup-' + keysNames[i], function (event) {
            keys[i].isDown = false;
        });
    }


    // self.keyUp = self.input.keyboard.addKey('W');
    // self.keyDown = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    // self.keyLeft = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    // self.keyRight = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    // self.shift = self.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);   

}

export function blockMovement() {
    console.log("TRYING TO BLOCK MOVEMENT");
    self.blockedMovement = true;
}
export function unblockMovement() {
    console.log("TRYING TO UNBLOCK MOVEMENT");
    self.blockedMovement = false;
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
            self.shift,

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
            self.shift,
        );
    }
}
