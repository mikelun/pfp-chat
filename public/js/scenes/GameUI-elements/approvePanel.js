import { sceneEvents } from "../../Events/EventsCenter";

var self;
var approvePanelGroup;

export function initializeApprovePanel(newSelf) {
    self = newSelf;

    approvePanelGroup = self.add.group();

    sceneEvents.on('createApprovePanel', (data) => {
        createApprovePanel(data);
    });
}


function createApprovePanel(data) {
    removeApprovePanel();

    approvePanelGroup.setVisible(true);

    var panel = self.add.image(640, 320, 'cell-info').setScale(3, 1.5);

    const text = self.rexUI.add.BBCodeText(panel.x - 190, panel.y - 90, message, {
        wrap: {
            mode: 'word',
            width:  400,
        },
        fontSize: '34px',
        fill: "#ffffff",
        fontFamily: 'PixelFont',
        maxLines: 5
    }).setOrigin(0, 0);

    const yesButton = self.rexUI.add.label({
        x: panel.x- 50, y: panel.y + 60,
        background: self.add.image(0, 0, 'long-button'),
        text: self.add.text(0, 0, 'YES', { fontFamily: 'PixelFont', fontSize: '34px', color: '#ffffff' }).setOrigin(0, 0),
        space: {
            left: 40, right: 40, top: 5, bottom: 10
        }
        }).layout().setAlpha(0.8);

    makeButtonInteractive(yesButton);

    const noButton = self.rexUI.add.label({
        x: panel.x + 50, y: panel.y + 60,
        background: self.add.image(0, 0, 'long-button'),
        text: self.add.text(0, 0, 'NO', { fontFamily: 'PixelFont', fontSize: '34px', color: '#ffffff' }).setOrigin(0, 0),
        space: {
            left: 40, right: 40, top: 5, bottom: 10
        }
        }).layout().setAlpha(0.8);

    makeButtonInteractive(noButton);

    noButton.on('pointerdown', () => {
        removeApprovePanel();
    });

    approvePanelGroup.add(panel);
    approvePanelGroup.add(text);
    approvePanelGroup.add(yesButton);
    approvePanelGroup.add(noButton);
}

function removeApprovePanel() {
    approvePanelGroup.setVisible(false);

    approvePanelGroup.getChildren().forEach(child => {
        if (child.clear) child.clear(true);
        child.destroy();
    });
    approvePanelGroup.clear(true);
}

