import { sceneEvents } from "../../Events/EventsCenter";
import { createCellInfo } from "./inventoryUtils";
import { closeAllPanels, makeButtonInteractive } from "./lowButttons";

// all supported player NFTs
var playerNFTs;

var playerItems;


var self;

var nftsButton, chestButton, closeButton, leftButton, rightButton;
export function createInventoryPanel(newSelf) {
    self = newSelf;

    self.cellInfoGroup = self.add.group();
    self.inventoryPanelGroup = self.add.group();

    const panel = self.add.image(390, 80, 'inventory-panel').setOrigin(0, 0).setScale(2.5);
    const headerInventoryText = self.add.text(panel.x + 250, panel.y + 60, 'NFTS', { fontFamily: 'PixelFont', fontSize: '48px', color: '#ffffff' }).setOrigin(0.5, 0.5);

    self.nftPage = 0;
    self.itemsPage = 0;

    // add loading nfts
    addLoader(self);

    nftsButton = self.add.image(panel.x + 8, panel.y + 350, 'clothes-button').setOrigin(0, 0).setScale(2);
    chestButton = self.add.image(panel.x + 8, panel.y + 420, 'chest-button').setOrigin(0, 0).setScale(2).setAlpha(0.8);
    closeButton = self.add.image(panel.x + 405, panel.y + 0, 'close-button').setOrigin(0, 0).setScale(2).setAlpha(0.8);

    makeButtonInteractive(nftsButton, 'NFTS', -40, 20, true);
    makeButtonInteractive(chestButton, 'ITEMS', -50, 20, true);
    makeButtonInteractive(closeButton, 'CLOSE', 40, 0, true);

    nftSelected(self, nftsButton);
    chestSelected(self, chestButton);

    leftButton = self.add.image(panel.x + 160, panel.y + 435, 'button-left').setOrigin(0, 0).setScale(1).setAlpha(0);
    rightButton = self.add.image(panel.x + 310, panel.y + 435, 'button-right').setOrigin(0, 0).setScale(1).setAlpha(0);

    makeButtonInteractive(leftButton, 'PREVIOUS', -75, 0, true);
    makeButtonInteractive(rightButton, 'NEXT', 40, 0, true);

    leftButton.on('pointerdown', function () {
        if (nftsButton.selected && !playerNFTs) return;
        if (chestButton.selected && !playerItems) return;

        if (nftsButton.selected) {
            if (self.nftPage > 0) {
                self.nftPage--;
                createCellsWithNFTs(self);
                updatePageText();
            }
        } else {
            if (self.itemsPage > 0) {
                self.itemsPage--;
                createCellsWithItems(self);
                updatePageText();
            }
        }
        
    });

    rightButton.on('pointerdown', function () {
        if (nftsButton.selected && !playerNFTs) return;
        if (chestButton.selected && !playerItems) return;

        if (nftsButton.selected) {
            if (self.nftPage < Math.floor(playerNFTs.length / 12)) {
                self.nftPage++;
                createCellsWithNFTs(self);
                updatePageText();
            }
        } else {
            if (self.itemsPage < Math.floor(playerItems.length / 12)) {
                self.itemsPage++;
                createCellsWithItems(self);
                updatePageText();
            }
        }

        
    });

    // page text 
    self.pageText = self.add.text(panel.x + 250, panel.y + 447, '', { fontFamily: 'PixelFont', fontSize: '24px', color: '#ffffff' }).setOrigin(0.5, 0.5);

    self.inventoryPanelGroup.add(panel);
    self.inventoryPanelGroup.add(headerInventoryText);
    self.inventoryPanelGroup.add(nftsButton);
    self.inventoryPanelGroup.add(chestButton);
    self.inventoryPanelGroup.add(closeButton);
    self.inventoryPanelGroup.add(leftButton);
    self.inventoryPanelGroup.add(rightButton);
    self.inventoryPanelGroup.add(self.pageText);

    // make group invisible
    //

    closeButton.on('pointerdown', () => {
        closeAllPanels();
    });


    chestButton.on('pointerdown', () => {
        if (self.sizerCells) self.sizerCells.clear(true);

        headerInventoryText.text = 'ITEMS';
        chestButton.selected = true;
        nftsButton.selected = false;
        self.cellInfoGroup.setVisible(false);

        if (!playerItems) {
            self.loader.alpha = 1;
            disablePageController();
            return;
        }
        enablePageController();
        self.loader.alpha = 0;

        nftsButton.setAlpha(0.8);
        createCellsWithItems(self);
    });

    // at first nfts button selected
    nftsButton.selected = true;
    nftsButton.on('pointerdown', () => {
        if (self.sizerCells) self.sizerCells.clear(true);

        headerInventoryText.text = 'NFTS';
        nftsButton.selected = true;
        chestButton.selected = false;
        self.cellInfoGroup.setVisible(false);

        if (!playerNFTs) {
            self.loader.alpha = 1;
            disablePageController();
            return;
        }

        enablePageController();
        self.loader.alpha = 0;

        chestButton.setAlpha(0.8);
        createCellsWithNFTs(self);
    });




    sceneEvents.on('getNFTsFromPageResult', (result) => {
        playerNFTs = result;

        if (!nftsButton.selected) return;
        self.loader.alpha = 0;
        createCellsWithNFTs(self, playerNFTs);
        updatePageText();
        enablePageController();
    });

    sceneEvents.on('getItems', (items) => {
        playerItems = items;
        if (!chestButton.selected) return;
        createCellsWithItems(self);
        updatePageText();
        enablePageController();
    })

    // AT FIRST MAKE INVISIBLE
    self.inventoryPanelGroup.setVisible(false);
}

function enablePageController() {
    leftButton.setAlpha(0.8);
    rightButton.setAlpha(0.8);
    self.pageText.setAlpha(1);
    updatePageText();
}
function disablePageController() {
    leftButton.setAlpha(0);
    rightButton.setAlpha(0);
    self.pageText.setAlpha(0);
}
function updatePageText() {
    if (nftsButton.selected) {
        self.pageText.text = `${self.nftPage + 1}/${Math.floor(playerNFTs.length / 12) + 1}`;
    } else {
        self.pageText.text = `${self.itemsPage + 1}/${Math.floor(playerItems.length / 12) + 1}`;
    }
}
function nftSelected(self) {

}

function chestSelected(self) {

}


function createCellsWithNFTs(self) {
    const visible = self.inventoryPanelGroup.getChildren()[0].visible;

    createCells(self, 'nfts');

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

    self.inventoryPanelGroup.add(self.sizerCells);

    if (!visible) {
        self.inventoryPanelGroup.setVisible(false);
    }

}

function createCellsWithItems(self) {


    const visible = self.inventoryPanelGroup.getChildren()[0].visible;
    createCells(self, "items");

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (playerItems[self.itemsPage * 12 + i + j * 4]) {
                const image = self.add.image(self.sizerCells.x + i * 75.5 - 115, self.sizerCells.y + j * 75 - 115, playerItems[self.itemsPage * 12 + i + j * 4].texture).setOrigin(0.5, 0.5);
                // make size 40:40 px
                image.setScale(40 / Math.max(image.height, image.width));
                self.sizerCells.add(image);
            }
        }
    }

    self.inventoryPanelGroup.add(self.sizerCells);
}

function createCellInfoNFTs(self, nft) {
    // returns a proceed button

    const id =`#${nft.tokenId}`;
    const name = nft.name.split('#')[0];

    const proceedButton = createCellInfo(self, id, name, 'PROCEED TO SHOW OFF NFT TO OTHER PLAYERS');

    const dom = document.createElement('img');
    dom.src = nft.image;
    dom.style.width = '70px';
    dom.style.height = '70px';
    const nftDom = self.add.dom(865 + 55, 220 + 55, dom);

    self.cellInfoGroup.add(nftDom);
    
    proceedButton.on('pointerdown', function () {
        sceneEvents.emit('nftSelected', nft);
    });
}

function createCellInfoItems(self, item) {
    const count = item.count;
    const name = item.name;
    const description = item.description;
    const rarity = item.rarity;

    const proceedButton = createCellInfo(self, count, name, description, rarity);

    const image = self.add.image(865 + 55, 220 + 55, item.texture).setOrigin(0.5, 0.5);
    image.setScale(50 / Math.max(image.height, image.width));
    
    self.cellInfoGroup.add(image);  



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

function createCells(self, type) {
    // clear previous sizer
    if (self.sizerCells) self.sizerCells.clear(true);

    self.sizerCells = self.rexUI.add.gridSizer({
        x: 640, y: 365,
        width: 300, height: 300,
        column: 4, row: 4,
        columnProportions: 1, rowProportions: 1,
        space: {
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
            if (type == 'nfts') {
                cellNFT.setInteractive().on('pointerdown', function () {
                    if (playerNFTs[self.nftPage * 12 + x + y * 4]) {
                        createCellInfoNFTs(self, playerNFTs[self.nftPage * 12 + x + y * 4]);
                    }
                });
            } else {
                cellNFT.setInteractive().on('pointerdown', function () {
                    if (playerItems[self.itemsPage * 12 + x + y * 4]) {
                        console.log(playerItems[self.itemsPage * 12 + x + y * 4]);
                        createCellInfoItems(self, playerItems[self.itemsPage * 12 + x + y * 4]);
                    }
                });
            }
            return cellNFT;
        }
    })
        .layout();
}