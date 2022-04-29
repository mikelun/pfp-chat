import { checkNFTForProject, createAnimForPlanet, createButton } from "../default-levels/level-utils";
import { typeTextWithDelay } from "../default-levels/showLevels";

// export function cryptoDuckiesLevel2(self, Moralis) {

//     // MAKE GROUP FOR LEVEL
//     self.levelGroup = self.add.group();

//     self.penguin = self.add.image(650, 520, 'duckies').setScale(0.25);
//     self.levelGroup.add(self.penguin);
//     //self.robots = self.add.image(600, 600, 'ailoverse-robots').setScale(0.2);
//     self.ailoverseText = self.add.text(400, 100, 'CRYPTO DUCKIES (on-chain)', { fill: "#ffffff", fontSize: "60px", fontFamily: "PixelFont" });
//     self.levelGroup.add(self.ailoverseText);
//     //self.levelGroup.add(self.cats);
//     //self.levelGroup.add(self.robots);
//     // TEXT
//     var text = 'TO ENTER THE ROOM YOU SHOULD HAVE CRYPTO DUCKIES (on-chain) NFT';
//     self.label = self.add.text(200, 200, '', { fill: "#ffffff", fontSize: "35px", align: "center", fontFamily: "PixelFont" });
//     self.levelGroup.add(self.label);
//     self.typeTextWithDelay(text);

//     // BUTTON WITH START TEXT
//     self.button1 = self.rexUI.add.label({
//         background: self.add.image(0, 0, 'background-button'),
//         text: self.add.text(0, 0, 'CHECK NFT', { fill: "#000000", fontSize: "35px", fontFamily: "PixelFont" }),
//         space: {
//             left: 90,
//             right: 90,
//             top: 20,
//             bottom: 40
//         }
//     }).layout().setPosition(650, 300).setAlpha(0);

//     // SET BUTTONS INTERCTIVE
//     self.button1.setInteractive().on('pointerdown', () => {
//         if (self.step != 2) return;
//         self.penguin.setAlpha(0);
//         self.progress.setAlpha(1);
//         self.button1.setAlpha(0);
//         self.label.setPosition(520, 480);
//         self.label.text = 'CHECKING YOUR NFT...';
//         const token_address = "0x922dc160f2ab743312a6bb19dd5152c1d3ecca33";
//         self.checkNFTForProject(token_address);
//     });
// }

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