import { showCurrentLevel } from "./showLevels";

export function createAnimForPlanet(self, key) {
    self.anims.create({
        key: key,
        frames: self.anims.generateFrameNumbers(key, { start: 0, end: 49 }),
        frameRate: 9,
        repeat: -1
    });
}

export function createButton(self, x, y, text, padding = {left: 0, right: 0, top: 0, bottom: 0}) {
    // BUTTON WITH ALLOW TEXT
    return self.rexUI.add.label({
        background: self.add.image(0, 0, 'buttonpress'),
        text: self.add.text(0, 0, text, { fill: "#ffffff", fontSize: "50px", fontFamily: "PixelFont" }),
        space: {
            left: padding.left,
            right: padding.right,
            top: padding.top,
            bottom: padding.bottom
        }
    }).layout().setPosition(x, y).setAlpha(0);
}

