import { makeButtonInteractive } from "./lowButttons";
import { setVisibleSpacePanel } from "./spacePanel";

var self;

export function createAccountPanel(newSelf) {
    self = newSelf;

    self.accountGroup = self.add.group();

    return;

    const panel = self.add.image(390, 80, 'inventory-panel').setOrigin(0, 0).setScale(2.5);
    const header = self.add.text(panel.x + 250, panel.y + 60, 'ACCOUNT', { fontFamily: 'PixelFont', fontSize: '48px', color: '#ffffff' }).setOrigin(0.5, 0.5);

    const closeButton = self.add.image(panel.x + 405, panel.y + 0, 'close-button').setOrigin(0, 0).setScale(2).setAlpha(0.8);
    makeButtonInteractive(closeButton, '', 0, 0);

    closeButton.on('pointerdown', () => {
        self.accountGroup.setVisible(false);
        self.accountButton.selected = false;
        self.accountButton.setAlpha(0.8);
    });

    const createSpace = self.rexUI.add.label({
        x: panel.x + 250,
        y: panel.y + 300,
        background: self.add.image(0, 0, 'long-button'),
        text: self.add.text(0, 0, 'CREATE SPACE', { fontFamily: 'PixelFont', fontSize: '35px', color: '#ffffff' }),
        space: { left: 20, right: 20, top: 20, bottom: 25 }
    }).setAlpha(0.8).layout();

    makeButtonInteractive(createSpace, '', 0, 0);

    createSpace.on('pointerdown', () => {
        self.accountGroup.setVisible(false);
        self.accountButton.selected = false;
        setVisibleSpacePanel();
    })

    self.accountGroup.add(panel);
    self.accountGroup.add(closeButton);
    self.accountGroup.add(header);
    self.accountGroup.add(createSpace);

}