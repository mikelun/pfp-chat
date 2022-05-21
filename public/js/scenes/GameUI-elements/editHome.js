import { hideAllButtons, makeButtonInteractive, showAllButtons } from "./lowButttons";

var closeButton;

var self;

export function editHome(newSelf) {
    self = newSelf;

    self.editHomeGroup = self.add.group();

    // hide low buttons
    hideAllButtons();

    closeButton = self.add.image(1150, 100, 'close-button').setScale(4).setAlpha(0.5);
 
    makeButtonInteractive(closeButton, '', 0, 40);

    closeButton.on('pointerdown', () => {
        showAllButtons()
        closeButton.destroy();  
        self.editHomeGroup.clear(true);
    });

    self.editHomeGroup.add(closeButton);
}