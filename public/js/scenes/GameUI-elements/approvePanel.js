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

    const button = self.rexUI.add.label({
        x: panel.x, y: panel.y + 60,
        background: self.add.image(0, 0, 'long-button'),
        text: self.add.text(0, 0, 'OK', { fontFamily: 'PixelFont', fontSize: '34px', color: '#ffffff' }).setOrigin(0, 0),
        space: {
            left: 40, right: 40, top: 5, bottom: 10
        }
        }).layout().setAlpha(0.8);

    makeButtonInteractive(button);


}

