import { sceneEvents } from "../../Events/EventsCenter";
import { makeButtonInteractive } from "./lowButttons";

var errorPanelGroup;
var errorDisconnectGroup;

var self;

export function initializeErrors(newSelf) {
    self = newSelf;

    sceneEvents.on('createErrorDisconnectMessage', () => {
        createErrorDisconnectMessage();
    });

    sceneEvents.on('removeErrorDisconnectMessage', () => {
        removeErrorDisconnectMessage();
    });
    
    sceneEvents.on('createErrorMessage', (message) => {
        createErrorPanel(message);
    });
}

function createErrorPanel(message) {
    if (!errorPanelGroup) errorPanelGroup = self.add.group();

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

    errorPanelGroup.add(panel);
    errorPanelGroup.add(text);
    errorPanelGroup.add(button);

    button.on('pointerdown', function () {
        errorPanelGroup.getChildren().forEach(child => {
            if (child.clear) child.clear(true);
            child.destroy();
        });
        errorPanelGroup.clear(true);
        button.destroy();
    });
}

function createErrorDisconnectMessage() {
    errorDisconnectGroup = self.add.group();
    var panel = self.add.image(640, 320, 'cell-info').setScale(5, 3);

    const message = `YOU HAVE BEEN DISCONNECTED FROM THE SERVER.\n\nTRYING TO RECCONNECT...`;
    const text = self.rexUI.add.BBCodeText(panel.x - 320, panel.y - 200, message, {
        wrap: {
            mode: 'word',
            width:  600,
        },
        fontSize: '50px',
        fill: "#ffffff",
        fontFamily: 'PixelFont',
        maxLines: 5
    }).setOrigin(0, 0);
    
    errorDisconnectGroup.add(panel);
    errorDisconnectGroup.add(text);
}

function removeErrorDisconnectMessage() {
    if (!errorDisconnectGroup) return;
    errorDisconnectGroup.getChildren().forEach(child => {
        if (child.clear) child.clear(true);
        child.destroy();
    });
    errorDisconnectGroup.clear(true);
}