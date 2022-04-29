import { showCurrentLevel } from "./showLevels";

export function createAnimForPlanet(self, key) {
    self.anims.create({
        key: key,
        frames: self.anims.generateFrameNumbers(key, { start: 0, end: 49 }),
        frameRate: 10,
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

export async function checkNFTForProject(self, token_address, Moralis) {
    const address = self.user.get('ethAddress');

    const result1 = await checkNFT(token_address, Moralis);

    if ((result1 || creators.includes(address))) {
        self.step = 3;
        showCurrentLevel(self);
    } else {
        self.label.x -= 125;
        self.label.y -= 100;
        self.label.text = 'YOU DONT HAVE NFT OF THIS COLLECTION\nYOU CAN VISIT MAIN ROOM WITHOUT NFT\n';
        self.linkText = self.add.text(self.label.x, self.label.y + 70, 'https://meet.buildship.xyz', { fill: "#ffb900", fontSize: "50px", fontFamily: "PixelFont" });
        self.linkText.setInteractive().on('pointerdown', () => {
            // load page origin
            window.location.href = window.location.origin;
        });
    }
}

async function checkNFT(token_address, Moralis) {
    console.log('Checking NFT', token_address, `https://etherscan.io/address/${token_address}`)
    const { total } = await Moralis.Web3API.account.getNFTsForContract({ token_address });
    return total > 0;
}