import { makeButtonInteractive } from "./lowButttons";

export function createInventoryPanel(self) {
    self.inventoryPanelGroup = self.add.group();
    const panel = self.add.image(390, 80, 'inventory-panel').setOrigin(0, 0).setScale(2.5);
    const nftText = self.add.text(panel.x + 175, panel.y + 40, 'INVENTORY', { fontFamily: 'PixelFont', fontSize: '48px', color: '#ffffff' }).setOrigin(0, 0);
    
    const nftsButton = self.add.image(panel.x + 425, panel.y + 350, 'clothes-button').setOrigin(0, 0).setScale(2);
    const chestButton = self.add.image(panel.x + 425, panel.y + 420, 'chest-button').setOrigin(0, 0).setScale(2).setAlpha(0.8);
    const closeButton = self.add.image(panel.x + 405, panel.y + 0, 'close-button').setOrigin(0, 0).setScale(2).setAlpha(0.8);
    
    makeButtonInteractive(nftsButton, 'NFTs', 70, 20, true);
    makeButtonInteractive(chestButton, 'Inventory', 70, 20, true);
    makeButtonInteractive(closeButton, 'Close', 40, 0, true);

    nftSelected(self, nftsButton);
    chestSelected(self, chestButton);

    self.inventoryPanelGroup.add(panel);
    self.inventoryPanelGroup.add(nftText);
    self.inventoryPanelGroup.add(nftsButton);
    self.inventoryPanelGroup.add(chestButton);
    self.inventoryPanelGroup.add(closeButton);

    // make group invisible
    self.inventoryPanelGroup.setVisible(false);

    closeButton.on('pointerdown', () => {
        self.inventoryPanelGroup.setVisible(false);
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
}

function nftSelected(self) {

}

function chestSelected(self) {

}

