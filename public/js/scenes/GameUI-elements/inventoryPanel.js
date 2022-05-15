import { sceneEvents } from "../../Events/EventsCenter";
import { makeButtonInteractive } from "./lowButttons";

// all supported player NFTs
var playerNFTs;

var self;
export function createInventoryPanel(newSelf) {
    self = newSelf;

    self.cellInfoGroup = self.add.group();
    self.inventoryPanelGroup = self.add.group();

    const panel = self.add.image(390, 80, 'inventory-panel').setOrigin(0, 0).setScale(2.5);
    const nftText = self.add.text(panel.x + 175, panel.y + 40, 'INVENTORY', { fontFamily: 'PixelFont', fontSize: '48px', color: '#ffffff' }).setOrigin(0, 0);

    self.nftPage = 0;
    self.artifactsPage = 0;

    // add loading nfts
    addLoader(self);

    const nftsButton = self.add.image(panel.x + 8, panel.y + 350, 'clothes-button').setOrigin(0, 0).setScale(2);
    const chestButton = self.add.image(panel.x + 8, panel.y + 420, 'chest-button').setOrigin(0, 0).setScale(2).setAlpha(0.8);
    const closeButton = self.add.image(panel.x + 405, panel.y + 0, 'close-button').setOrigin(0, 0).setScale(2).setAlpha(0.8);

    makeButtonInteractive(nftsButton, 'NFTS', -40, 20, true);
    makeButtonInteractive(chestButton, 'INVENTORY', -80, 20, true);
    makeButtonInteractive(closeButton, 'CLOSE', 40, 0, true);

    nftSelected(self, nftsButton);
    chestSelected(self, chestButton);

    const leftButton = self.add.image(panel.x + 160, panel.y + 435, 'button-left').setOrigin(0, 0).setScale(1).setAlpha(0.8);
    const rightButton = self.add.image(panel.x + 310, panel.y + 435, 'button-right').setOrigin(0, 0).setScale(1).setAlpha(0.8);

    makeButtonInteractive(leftButton, 'PREVIOUS', -75, 0, true);
    makeButtonInteractive(rightButton, 'NEXT', 40, 0, true);

    leftButton.on('pointerdown', function () {
        if (!playerNFTs) return;
        if (self.nftPage > 0) {
            self.nftPage--;
        }
        createCellsWithNFTs(self);
        updatePageText();
    });

    rightButton.on('pointerdown', function () {
        if (!playerNFTs) return;
        if (self.nftPage < Math.floor(playerNFTs.length / 12)) {
            self.nftPage++;
        }
        createCellsWithNFTs(self);
        updatePageText();
    });

    // page text 
    self.pageText = self.add.text(panel.x + 250, panel.y + 445, '', { fontFamily: 'PixelFont', fontSize: '24px', color: '#ffffff' }).setOrigin(0.5, 0.5);

    self.inventoryPanelGroup.add(panel);
    self.inventoryPanelGroup.add(nftText);
    self.inventoryPanelGroup.add(nftsButton);
    self.inventoryPanelGroup.add(chestButton);
    self.inventoryPanelGroup.add(closeButton);
    self.inventoryPanelGroup.add(leftButton);
    self.inventoryPanelGroup.add(rightButton);
    self.inventoryPanelGroup.add(self.pageText);

    // make group invisible
    //

    closeButton.on('pointerdown', () => {
        self.inventoryPanelGroup.setVisible(false);
        self.cellInfoGroup.setVisible(false);
        self.inventoryButton.selected = false;
        self.inventoryButton.setAlpha(0.8);
    });


    chestButton.on('pointerdown', () => {
        chestButton.selected = true;
        nftsButton.setAlpha(0.8);
        nftsButton.selected = false;
    });

    // at first nfts button selected
    nftsButton.selected = true;
    nftsButton.on('pointerdown', () => {
        nftsButton.selected = true;
        chestButton.setAlpha(0.8);
        chestButton.selected = false;
    });




    sceneEvents.on('getNFTsFromPageResult', (result) => {
        playerNFTs = result;
        self.loader.setAlpha(0);
        createCellsWithNFTs(self, playerNFTs);
        updatePageText();
    });

    // AT FIRST MAKE INVISIBLE
    self.inventoryPanelGroup.setVisible(false);
}


function updatePageText() {
    self.pageText.text = `${self.nftPage + 1}/${Math.floor(playerNFTs.length / 12) + 1}`;
}
function nftSelected(self) {

}

function chestSelected(self) {

}

function createCellsWithNFTs(self) {
    // clear previous sizer
    if (self.sizerCells) self.sizerCells.clear(true);
    const visible = self.inventoryPanelGroup.getChildren()[0].visible;

    self.sizerCells = self.rexUI.add.gridSizer({
        x: 640, y: 365,
        width: 300, height: 300,
        column: 4, row: 4,
        columnProportions: 1, rowProportions: 1,
        space: {
            // top: 20, bottom: 20, left: 10, right: 10,
            column: 4, row: 4
        },
        createCellContainerCallback: function (scene, x, y, config) {
            config.expand = true;

            const cellNFT = scene.rexUI.add.label({
                background: scene.add.image(0, 0, 'cell-panel'),
                space: {
                    left: 13,
                    bottom: 5
                }
            }).layout();
            cellNFT.setInteractive().on('pointerdown', function () {
                if (playerNFTs[self.nftPage * 12 + x + y * 4]) {
                    createCellInfo(self, playerNFTs[self.nftPage * 12 + x + y * 4]);
                }
            });
            return cellNFT;
        }
    })
        .layout();

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (playerNFTs[self.nftPage * 12 + i + j * 4]) {
                const dom = document.createElement('img');
                dom.src = playerNFTs[self.nftPage * 12 + i + j * 4].image;
                dom.style.width = '40px';
                dom.style.height = '40px';
                self.sizerCells.add(self.add.dom(self.sizerCells.x + i * 75 - 115, self.sizerCells.y + j * 75 - 115, dom));
            }
        }
    }
    if (!visible) self.sizerCells.setVisible(false);

    self.inventoryPanelGroup.add(self.sizerCells);
}

function createCellInfo(self, nft) {

    self.cellInfoGroup.getChildren().forEach(function (child) {
        child.destroy();
    });

    const backgroundInfo = self.add.image(815, 205, 'cell-info').setOrigin(0, 0).setScale(1.5, 2.43);
    const cellImageBackground = self.add.image(backgroundInfo.x + 50, backgroundInfo.y + 15, 'cell-panel').setOrigin(0, 0).setScale(5);

    const dom = document.createElement('img');
    dom.src = nft.image;
    dom.style.width = '70px';
    dom.style.height = '70px';
    const nftDom = self.add.dom(cellImageBackground.x + 55, cellImageBackground.y + 55, dom);

    // button with selecting NFT
    const label = self.rexUI.add.label({
        x: backgroundInfo.x + 110, y: backgroundInfo.y + 315,
        background: self.add.image(0, 0, 'long-button-yellow'),
        text: self.add.text(0, 0, 'PROCEED', { fontFamily: 'PixelFont', fontSize: '24px', color: '#ffffff' }).setOrigin(0, 0),
        space: {
            left: 20, right: 20, top: 10, bottom: 15
        }
    }).layout().setAlpha(0.8);
    makeButtonInteractive(label, '', 0, 0, true);
    label.on('pointerdown', function () {
        sceneEvents.emit('nftSelected', nft);
    });

    var idText = nft.name.split('#')[1];
    const labelNumberNFT = self.rexUI.add.label({
        x: backgroundInfo.x + 105, y: backgroundInfo.y + 135,
        background: self.add.image(0, 0, 'long-button-yellow'),
        text: self.add.text(0, 0, `#${idText}`, { fontFamily: 'PixelFont', fontSize: '24px', color: '#ffffff' }).setOrigin(0, 0),
        space: {
            left: 5, right: 5, top: 0, bottom: 5
        }
    }).layout().setAlpha(1);

    var nameText = nft.name.split('#')[0];
    if (nameText.length > 15) {
        nameText = nameText.substring(0, 15) + '...';
    }
    const name = self.add.text(backgroundInfo.x + 110, backgroundInfo.y + 160, nameText, { fontFamily: 'PixelFont', fontSize: '24px', color: '#ffffff' }).setOrigin(0.5, 0.5);


    const backgroundDescription = self.rexUI.add.roundRectangle(backgroundInfo.x + 15, backgroundInfo.y + 180, 190, 100, 5, 0x0e1420).setOrigin(0, 0).setAlpha(0.8);
    const description = self.add.text(backgroundInfo.x + 25, backgroundInfo.y + 185, 'PROCEED TO SHOW OFF NFT\nTO OTHER PLAYERS', { fontFamily: 'PixelFont', fontSize: '20px', color: '#ffffff' }).setOrigin(0, 0);

    self.cellInfoGroup.add(backgroundInfo);
    self.cellInfoGroup.add(cellImageBackground);
    self.cellInfoGroup.add(label);
    self.cellInfoGroup.add(labelNumberNFT);
    self.cellInfoGroup.add(name);
    self.cellInfoGroup.add(backgroundDescription);
    self.cellInfoGroup.add(description);
    self.cellInfoGroup.add(nftDom);



}

function addLoader(self) {
    self.loader = self.add.text(650, 370, 'LOADING...', { fontFamily: 'PixelFont', fontSize: '24px', color: '#ffffff' }).setOrigin(0.5, 0.5);
    // animate loader
    self.tweens.add({
        targets: self.loader,
        scaleX: 1.5,
        scaleY: 1.5,
        ease: 'Sine.easeInOut',
        duration: 1000,
        repeat: -1,
        yoyo: true
    });

    self.inventoryPanelGroup.add(self.loader);

}