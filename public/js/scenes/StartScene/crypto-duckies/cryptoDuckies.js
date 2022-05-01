import {createAnimForPlanet, createButton } from "../default-levels/level-utils";
import { checkNFTForProject } from "../default-levels/web3-utils";
import { typeTextWithDelay } from "../default-levels/showLevels";

export function cryptoDuckiesLevel2(self, Moralis) {
    self.levelGroup = self.add.group();
    const text = 'PLANET: CRYPTO-DUCKIES\nMAP: ISLAND\nENTRANCE BY NFT: YES';
    self.label = self.add.text(530, 240, '', { fill: "#ffffff", fontSize: "35px", fontFamily: "PixelFont" });
    self.levelGroup.add(self.label);
    typeTextWithDelay(self, text);
    self.cryptoDuckiesPlanet = self.add.sprite(420, 300, 'crypto-duckies-planet').setScale(3);
    self.levelGroup.add(self.cryptoDuckiesPlanet);
    createAnimForPlanet(self, 'crypto-duckies-planet');
    self.cryptoDuckiesPlanet.play('crypto-duckies-planet');
    self.button1 = createButton(self, 480, 450, "START FLIGHT", { left: 20, right: 20, top: 40, bottom: 55 });
    self.button1.setInteractive().on('pointerdown', () => {
        if (self.step != 2) return;
        self.button1.setAlpha(0);
        self.label.setPosition(520, 480);
        self.cryptoDuckiesPlanet.destroy();
        self.label.text = 'CHECKING YOUR NFT...';
        const token_address = "0x922dc160f2ab743312a6bb19dd5152c1d3ecca33";
        checkNFTForProject(self, token_address, Moralis);
    });
}