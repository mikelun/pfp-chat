// export function buildshipLevel2(self, Moralis) {
//     // MAKE GROUP FOR LEVEL
//     self.levelGroup = self.add.group();

import { createAnimForPlanet, createButton } from "../default-levels/level-utils";
import { showCurrentLevel, typeTextWithDelay } from "../default-levels/showLevels";


export function guestLevel1(self, Moralis) {
    // TEXT
    var text = "IT'S A GUEST TEST PLANET";
    self.levelGroup = self.add.group();
    self.label = self.add.text(330, 210, '', { fill: "#ffb900", fontSize: "35px", fontFamily: "PixelFont", align: "left" });
    self.levelGroup.add(self.label);
    typeTextWithDelay(self, text);

    self.button1 = createButton(self, 450, 450, 'CONTINUE', { left: 50, right: 50, top: 40, bottom: 50 });

    // SET BUTTONS INTERCTIVE
    self.button1.setInteractive().on('pointerdown', () => {
        if (self.step != 1) return;
        self.step = 2;
        showCurrentLevel(self);
    });
}
