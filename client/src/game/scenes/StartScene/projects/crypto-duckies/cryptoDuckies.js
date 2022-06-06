import {createAnimForPlanet, createButton } from "../../default-levels/level-utils";
import { checkNFTForProject } from "../../default-levels/web3-utils";
import { typeTextWithDelay } from "../../default-levels/showLevels";


function setUpYourPlanet() {

    // CHANGE VARIABLES
    const planetName = "CRYPTO-DUCKIES";

    const mapType = "ISLAND"; // id = 2 - apartments, id = 3 - island, id = 4 - cafe

    const planetTexture = 'crypto-duckies-planet'; // example: coffeebar-planet

    const token_address = "0x922dc160f2ab743312a6bb19dd5152c1d3ecca33"; // address of your NFT collection

    // END OF CHANGING

    return {planetName: planetName, mapType: mapType, planetTexture: planetTexture, token_address: token_address};


}

// change name of function to your collection name

export function cryptoDuckies(self, Moralis) {
    const settings = setUpYourPlanet();

    self.levelGroup = self.add.group();
    const text = `PLANET: ${settings.planetName}\nMAP: ${settings.mapType}\nENTRANCE BY NFT: YES`;
    
    self.label = self.add.text(530, 240, '', { fill: "#ffffff", fontSize: "35px", fontFamily: "PixelFont" });
    self.levelGroup.add(self.label);
    
    typeTextWithDelay(self, text);
    
    self.planet = self.add.sprite(420, 300, settings.planetTexture).setScale(3);
    self.levelGroup.add(self.planet);
    createAnimForPlanet(self, settings.planetTexture);
    self.planet.play(settings.planetTexture);

    self.button1 = createButton(self, 480, 450, "START FLIGHT", { left: 20, right: 20, top: 40, bottom: 55 });
    self.button1.setInteractive().on('pointerdown', () => {
        if (self.step != 2) return;
        self.button1.setAlpha(0);
        self.label.setPosition(520, 480);
        self.planet.destroy();
        self.label.text = 'CHECKING YOUR NFT...';
        const token_address = settings.token_address;
        checkNFTForProject(self, token_address, Moralis);
    });
}