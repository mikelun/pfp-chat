// export function buildshipLevel2(self, Moralis) {
//     // MAKE GROUP FOR LEVEL
//     self.levelGroup = self.add.group();

import { createAnimForPlanet, createButton } from "../default-levels/level-utils";
import { showCurrentLevel, typeTextWithDelay } from "../default-levels/showLevels";


export function coffeebarLevel2(self, Moralis) {
    self.levelGroup = self.add.group();
    const text = 'PLANET: COFFEEBAR\nMAP: CAFFEEBAR\nENTRANCE BY NFT: NO';
    self.label = self.add.text(530, 240, '', { fill: "#ffffff", fontSize: "35px", fontFamily: "PixelFont" });
    self.levelGroup.add(self.label);
    typeTextWithDelay(self, text);
    self.buildshipPlanet = self.add.sprite(420, 300, 'coffeebar-planet').setScale(3);
    self.levelGroup.add(self.buildshipPlanet);
    createAnimForPlanet(self, 'coffeebar-planet');
    self.buildshipPlanet.play('coffeebar-planet');

    self.button1 = createButton(self, 480, 450, "START FLIGHT", { left: 20, right: 20, top: 40, bottom: 55 });
    self.button1.setInteractive().on('pointerdown', () => {
        if (self.step != 2) return;
        self.step = 3;
        showCurrentLevel(self);
    });
}