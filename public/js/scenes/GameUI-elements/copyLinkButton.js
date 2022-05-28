import { sceneEvents } from "../../Events/EventsCenter";
import { makeButtonInteractive } from "./lowButttons";

var self;
var copyLinkButtonGroup;

var addFriendsButton;

export function initalizeCopyLinkButton(newSelf, data) {
    self = newSelf;

    copyLinkButtonGroup = self.add.group(); 

    sceneEvents.on('createCopyLinkButton', (spaceRoom) => {
        destroyCopyLinkButton();
        createCopyLinkButton(spaceRoom);
    });

    sceneEvents.on('destroyCopyLinkButton', () => {
        destroyCopyLinkButton();
    });

    if (data.spaceId) {
        createCopyLinkButton(data.spaceId);
    }


}

function createCopyLinkButton(spaceRoom) {
    const link = 'localhost:3000/' + spaceRoom.replace('space$', '');

    addFriendsButton = self.add.image(10, 125, 'copy-link-button').setOrigin(0, 0).setScale(2).setAlpha(0.8).setVisible(false);
    makeButtonInteractive(addFriendsButton, '', 0, 0);

    addFriendsButton.on('pointerdown', () => {
        copyLinkButtonGroup.setVisible(true);
        addFriendsButton.setVisible(false);
    });

    const background = self.rexUI.add.roundRectangle(15, 150, 400, 50, 7, 0x222222).setOrigin(0, 0);

    const copyButton = self.rexUI.add.roundRectangle(background.x + 348,background.y + 25, 90, 40, 7, 0x6666FF).setAlpha(0.8);
    const copyText = self.add.text(copyButton.x, copyButton.y - 3, 'COPY', { fontFamily: 'PixelFont', fontSize: '25px', color: '#ffffff' }).setOrigin(0.5);

    makeButtonInteractive(copyButton, '', 0, 0);

    copyButton.on('pointerdown', () => {
        navigator.clipboard.writeText(link);
        copyText.setText('COPIED!');
        copyButton.setFillStyle(0x006633);
        setTimeout(() => {
            copyText.setText('COPY');
            copyButton.setFillStyle(0x6666FF);
        }, 2000);
    })
    const linkText = self.add.text(background.x + 10, background.y + 10, link, {fontSize: '25px',fontFamily: 'PixelFont',color: '#ffffff'});
    const tipText = self.add.text(background.x + 5, background.y - 30, 'INVITE YOUR FRIENDS', {fontSize: '25px',fontFamily: 'PixelFont',color: '#ffffff'});

    const closeButton = self.add.image(background.x + background.width - 10, background.y - 15, 'close-button').setScale(1.8).setAlpha(0.8);
    makeButtonInteractive(closeButton, '', 25, -15, true);
    closeButton.on('pointerdown', () => {
        copyLinkButtonGroup.setVisible(false);
        addFriendsButton.setVisible(true);
    });

    copyLinkButtonGroup.add(background);
    copyLinkButtonGroup.add(copyButton);
    copyLinkButtonGroup.add(copyText);
    copyLinkButtonGroup.add(linkText);
    copyLinkButtonGroup.add(tipText);
    copyLinkButtonGroup.add(closeButton);

}

function destroyCopyLinkButton() {
    copyLinkButtonGroup.clear(true);
    if (addFriendsButton) addFriendsButton.destroy();
}