import { sceneEvents } from "../../Events/EventsCenter";
import { createAccountPanel, getAccountVisible } from "./accountPanel";
import { editHome } from "./editHome";
import { createInventoryPanel } from "./inventoryPanel";
import { createShopPanel } from "./shopPanel";

var self, height, width;


export function createButtons(newSelf) {
    self = newSelf;

    height = self.sys.game.config.height;
    width = self.sys.game.config.width;
    
    createInventoryPanel(self);
    createShopPanel(self);
    createAccountPanel(self);


    createButton1();
    createButton2();
    createButton3();
    createButton4();

    createGoHomeButton();
    createEditHomeButton();
    createPlanetsButton();
   
    createHomeButton();


}

function createButton1() {
    self.accountButton = self.add.image(width / 3 + 0 * (width / 8) - 30, height * 0.90, 'friends-button').setScale(2).setAlpha(0.8);
    makeButtonInteractive(self.accountButton, 'ACCOUNT', 0, 40);

    self.accountButton.on('pointerdown', () => {
        const visible = self.accountGroup.getChildren()[0].visible;
        if (!visible) {
            closeAllPanels();
            self.accountGroup.setVisible(true);
            self.accountButton.selected = true;
            self.accountButton.setAlpha(1);
        } else {
            self.accountGroup.setVisible(false);
            self.accountButton.selected = false;
        }
    });
}

function createButton2() {

    self.inventoryButton = self.add.image(width / 3 + 1 * (width / 8) - 30, height * 0.90, 'inventory-button').setScale(2).setAlpha(0.8);
    makeButtonInteractive(self.inventoryButton, 'INVENTORY', 0, 40);

    self.inventoryButton.on('pointerdown', () => {
        // check if inventory panel is visible
        const visible = self.inventoryPanelGroup.getChildren()[0].visible;
        if (!visible) {
            closeAllPanels();
            self.inventoryPanelGroup.setVisible(true);
            self.inventoryButton.selected = true;
            self.inventoryButton.setAlpha(1);
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

    self.shopButton.on('pointerdown', () => {
        // check if inventory panel is visible
        const visible = self.shopPanelGroup.getChildren()[0].visible;
        console.log(visible);

        if (!visible) {
            closeAllPanels();
            self.shopPanelGroup.setVisible(true);
            self.shopButton.selected = true;
            self.shopButton.setAlpha(1);
        }
        else {
            self.shopPanelGroup.setVisible(false);
            self.shopButton.selected = false;
        }
    });



}

function createButton4() {
    self.discordButton = self.add.image(width / 3 + 3 * (width / 8) - 30, height * 0.90, 'discord-button').setScale(2).setAlpha(0.8);
    makeButtonInteractive(self.discordButton, 'DISCORD', 0, 40);
    self.discordButton.on('pointerdown', () => {
        window.open('https://discord.gg/aU6QhyK8jZ');
    });
}

function createHomeButton() {
    self.homeButton =  self.add.image(width - 85, height - 85, 'home-button').setScale(4).setAlpha(0.8);
    makeButtonInteractive(self.homeButton, 'HOME', 0, 70);

    // if on hoover
    self.homeButton.on('pointerover', () => {
        slideHomeButtons();
    });

    // if not on hoover
    self.homeButton.on('pointerout', () => {
        hideHomeButtons();
    });

    hideHomeButtons();


}

function createGoHomeButton() {
    self.goHomeButton = self.rexUI.add.label({
        x: width - 200,
        y: height - 120,
        background: self.add.image(0, 0, 'long-button'),
        text: self.add.text(0, 0, 'HOME', {fontSize: '24px',fontFamily: 'PixelFont',color: '#ffffff'}),
        space: {left: 42,right: 42,top: 5,bottom: 10}
    }).setAlpha(0.8).layout();
    makeButtonInteractive(self.goHomeButton, '', 0, 0);

    self.goHomeButton.on('pointerout', () => {
        hideHomeButtons();
    });

    self.goHomeButton.on('pointerdown', () => {
        sceneEvents.emit('connectToMyRoom');
    });

}

function createEditHomeButton() {
    self.editHomeButton = self.rexUI.add.label({
        x: width - 200,
        y: height - 80,
        background: self.add.image(0, 0, 'long-button'),
        text: self.add.text(0, 0, 'EDIT HOME', {fontSize: '24px',fontFamily: 'PixelFont',color: '#ffffff'}),
        space: {left: 20,right: 20,top: 5,bottom: 10}
    }).setAlpha(0.8).layout();

    makeButtonInteractive(self.editHomeButton, '', 0, 0);

    self.editHomeButton.on('pointerout', () => {
        hideHomeButtons();
    });

    self.editHomeButton.on('pointerdown', () => {
        if (self.isHome) {
            editHome(self); 
        }
    });
}

function createPlanetsButton() {
    self.planetsButton = self.rexUI.add.label({
        x: width - 200,
        y: height - 40,
        background: self.add.image(0, 0, 'long-button'),
        text: self.add.text(0, 0, 'PLANETS', {fontSize: '24px',fontFamily: 'PixelFont',color: '#ffffff'}),
        space: {left: 27.5,right: 27.5,top: 5,bottom: 10}
    }).setAlpha(0.8).layout();

    makeButtonInteractive(self.planetsButton, '', 0, 0);

    self.planetsButton.on('pointerout', () => {
        hideHomeButtons();
    });

    self.planetsButton.on('pointerdown', () => {
        sceneEvents.emit('connectToPlanet', 'coffeebar');
    });
    

}
export function closeAllPanels() {
    self.inventoryPanelGroup.setVisible(false);
    self.cellInfoGroup.setVisible(false);
    self.shopPanelGroup.setVisible(false);
    self.discordButton.selected = false;
    self.inventoryButton.selected = false;
    self.accountButton.selected = false;
    self.shopButton.selected = false;

    self.inventoryButton.setAlpha(0.8);
    self.accountButton.setAlpha(0.8);
    self.shopButton.setAlpha(0.8);
    self.discordButton.setAlpha(0.8);

    self.accountGroup.setVisible(false);

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

function hideHomeButtons() {
    setTimeout(() => {
        if (self.goHomeButton.alpha != 1 && self.editHomeButton.alpha != 1 && self.homeButton.alpha != 1 && self.planetsButton.alpha != 1) {
            self.goHomeButton.setVisible(false);
            self.editHomeButton.setVisible(false);
            self.planetsButton.setVisible(false);
        } 
    }, 30);
}

function slideHomeButtons() {

    if (self.goHomeButton.visible == true) return;

    const finalX = 1080;

    self.goHomeButton.x = finalX + 100;
    self.editHomeButton.x = finalX + 100;
    self.planetsButton.x = finalX + 100;
    
    self.goHomeButton.setVisible(true);
    self.editHomeButton.setVisible(true);
    self.planetsButton.setVisible(true);

    self.tweens.add({
        targets: [self.goHomeButton, self.editHomeButton, self.planetsButton],
        x:  finalX,
        duration: 500,
        ease: 'Power1',
        delay: 100,
    });
}


export function hideAllButtons() {
    self.accountButton.setVisible(false);
    self.shopButton.setVisible(false);
    self.discordButton.setVisible(false);
    self.inventoryButton.setVisible(false);
    self.homeButton.setVisible(false);
    hideHomeButtons();

}

export function showAllButtons() {
    self.accountButton.setVisible(true);
    self.shopButton.setVisible(true);
    self.discordButton.setVisible(true);
    self.inventoryButton.setVisible(true);
    self.homeButton.setVisible(true);
    hideHomeButtons();
}