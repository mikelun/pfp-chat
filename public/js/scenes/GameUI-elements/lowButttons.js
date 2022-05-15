import { createInventoryPanel } from "./inventoryPanel";

var self, height, width;


export function createButtons(newSelf) {
    self = newSelf;

    height = self.sys.game.config.height;
    width = self.sys.game.config.width;

    createButton1();
    createButton2();
    createButton3();
    createButton4();

}

function createButton1() {
    self.accountButton = self.add.image(width / 3 + 0 * (width / 8) - 30, height * 0.90, 'friends-button').setScale(2).setAlpha(0.8);
    makeButtonInteractive(self.accountButton, 'ACCOUNT', 0, 40);
}

function createButton2() {
    createInventoryPanel(self);

    self.inventoryButton = self.add.image(width / 3 + 1 * (width / 8) - 30, height * 0.90, 'inventory-button').setScale(2).setAlpha(0.8);
    makeButtonInteractive(self.inventoryButton, 'INVENTORY', 0, 40);

    self.inventoryButton.on('pointerdown', () => {
        // check if inventory panel is visible
        const visible = self.inventoryPanelGroup.getChildren()[0].visible;
        if (!visible) {
            self.inventoryPanelGroup.setVisible(true);
            self.inventoryButton.selected = true;
        } else {
            self.inventoryPanelGroup.setVisible(false);
            self.inventoryButton.selected = false;
            self.cellInfoGroup.setVisible(false);
        }
    });
}

function createButton3() {
    self.shopButton = self.add.image(width / 3 + 2 * (width / 8) - 30, height * 0.90, 'shop-button').setScale(2).setAlpha(0.8);
    makeButtonInteractive(self.shopButton,'SHOP', 0, 40);
}

function createButton4() {
    self.discordButton = self.add.image(width / 3 + 3 * (width / 8) - 30, height * 0.90, 'discord-button').setScale(2).setAlpha(0.8);
    makeButtonInteractive(self.discordButton, 'DISCORD', 0, 40);
    self.discordButton.on('pointerdown', () => {
        window.open('https://discord.gg/aU6QhyK8jZ');
    });
}

export function makeButtonInteractive(object, text, offsetX, offsetY, originZero = false) {
    const hooverText = self.add.text(object.x + offsetX, object.y + offsetY, text, { fontFamily: 'PixelFont', fontSize: '24px', color: '#ffffff' }).setOrigin(0.5).setAlpha(0);
    if (originZero) {
        hooverText.setOrigin(0, 0);
    }

    object.setInteractive().on('pointerover', () => {
        object.setAlpha(1);
        hooverText.setAlpha(1);
    }
    ).on('pointerout', () => {
        hooverText.setAlpha(0);
        if (object.selected) return;
        object.setAlpha(0.8);
    });
}