import { makeButtonInteractive } from "./lowButttons";


const rarityColors = {
    "COMMON": "#ffffff",
    "RARE": "#00ffff",
    "EPIC": "#ff00ff",
}
export function createCellInfo(self, idOrCount, name, description, rarity) {
    self.cellInfoGroup.getChildren().forEach(function (child) {
        child.destroy();
    });

    const backgroundInfo = self.add.image(815, 205, 'cell-info').setOrigin(0, 0).setScale(1.5, 2.43);
    const cellImageBackground = self.add.image(backgroundInfo.x + 50, backgroundInfo.y + 15, 'cell-panel').setOrigin(0, 0).setScale(5);

    // button with selecting NFT
    const proceedButton = self.rexUI.add.label({
        x: backgroundInfo.x + 110, y: backgroundInfo.y + 315,
        background: self.add.image(0, 0, 'long-button-yellow'),
        text: self.add.text(0, 0, 'PROCEED', { fontFamily: 'PixelFont', fontSize: '24px', color: '#ffffff' }).setOrigin(0, 0),
        space: {
            left: 20, right: 20, top: 10, bottom: 15
        }
    }).layout().setAlpha(0.8);

    makeButtonInteractive(proceedButton, '', 0, 0, true);

    const labelNumberNFT = self.rexUI.add.label({
        x: backgroundInfo.x + 105, y: backgroundInfo.y + 135,
        background: self.add.image(0, 0, 'long-button-yellow'),
        text: self.add.text(0, 0, `${idOrCount}`, { fontFamily: 'PixelFont', fontSize: '24px', color: '#ffffff' }).setOrigin(0, 0),
        space: {
            left: 5, right: 5, top: 0, bottom: 5
        }
    }).layout().setAlpha(1);

    if (name.length > 15) {
        name = name.substring(0, 15) + '...';
    }
    const nameText = self.add.text(backgroundInfo.x + 105, backgroundInfo.y + 160, name, { fontFamily: 'PixelFont', fontSize: '24px', color: '#ffffff' }).setOrigin(0.5, 0.5);


    const backgroundDescription = self.rexUI.add.roundRectangle(backgroundInfo.x + 15, backgroundInfo.y + 180, 190, 100, 5, 0x0e1420).setOrigin(0, 0).setAlpha(0.8);
    const descriptionText = self.rexUI.add.BBCodeText(backgroundInfo.x + 25, backgroundInfo.y + 185, description, {
        wrap: {
            mode: 'word',
            width:  180,
        },
        fontSize: '20px',
        fill: "#ffffff",
        fontFamily: 'PixelFont',
        maxLines: 5
    }).setOrigin(0, 0);

    const rarityDescription = self.add.text(backgroundInfo.x + 25, backgroundInfo.y + 250, `${rarity}`, { fontFamily: 'PixelFont', fontSize: '21px', color: rarityColors[rarity] }).setOrigin(0, 0);
    // self.add.text(backgroundInfo.x + 25, backgroundInfo.y + 185, description, { fontFamily: 'PixelFont', fontSize: '20px', color: '#ffffff' }).setOrigin(0, 0);

    self.cellInfoGroup.add(backgroundInfo);
    self.cellInfoGroup.add(cellImageBackground);
    self.cellInfoGroup.add(proceedButton);
    self.cellInfoGroup.add(labelNumberNFT);
    self.cellInfoGroup.add(nameText);
    self.cellInfoGroup.add(backgroundDescription);
    self.cellInfoGroup.add(descriptionText);
    self.cellInfoGroup.add(rarityDescription);

    return proceedButton;
}