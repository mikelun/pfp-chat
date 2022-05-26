import { sceneEvents } from "../../Events/EventsCenter";

var self;

var loadingPanelGroup;
export function initializeLoadingPanel(newSelf) {
    self = newSelf;

    loadingPanelGroup = self.add.group();

    sceneEvents.on('createLoader', (message) => {
        createLoadingPanel(message);
    });

    sceneEvents.on('removeLoader', removeLoadingPanel);
}

function createLoadingPanel(message) {
    var panel = self.add.image(640, 320, 'cell-info').setScale(3, 1.5);
    var text = self.rexUI.add.BBCodeText(panel.x - 190, panel.y - 90, message, {
        wrap: {
            mode: 'word',
            width: 400
        },
        fontSize: '34px',
        fill: "#ffffff",
        fontFamily: 'PixelFont',
        maxLines: 5
    }).setOrigin(0, 0);

    loadingPanelGroup.add(panel);
    loadingPanelGroup.add(text);
}

function removeLoadingPanel() {
    loadingPanelGroup.setVisible(false);
    loadingPanelGroup.clear(true);
}