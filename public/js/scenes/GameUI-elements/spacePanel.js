import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import { TextEdit } from "phaser3-rex-plugins/plugins/textedit";
import { sceneEvents } from "../../Events/EventsCenter";
import { blockMovement, unblockMovement } from "../../utils/utils";
import { makeButtonInteractive } from "./lowButttons";

import CircleMaskImage from 'phaser3-rex-plugins/plugins/circlemaskimage.js';


var self;

var spacePanelGroup, selectMapGroup;
export function initialiezeSpacePanel(newSelf) {
    self = newSelf;

    spacePanelGroup = self.add.group();

    createSpacePanel();
}

function createSpacePanel() {
    var panel = self.add.image(650, 320, 'shop-panel').setScale(2.5);
    var delta = 10;

    var closeButton = self.add.image(panel.x + 275, 90, 'close-button').setScale(2).setAlpha(0.8);
    makeButtonInteractive(closeButton,'CLOSE', 25, -15, true);

    var heading = self.add.text(panel.x - 5, panel.y - 180, 'CREATE YOUR SPACE', { fontFamily: 'PixelFont', fontSize: '45px', color: '#ffffff' }).setOrigin(0.5);
    
    var text1 = self.add.text(panel.x - 275, panel.y - 100 + delta, 'NAME YOUR SPACE', { fontFamily: 'PixelFont', fontSize: '35px', color: '#ffffff' }).setOrigin(0);

    var text2 = self.add.text(panel.x - 275, panel.y + 10 + delta, 'SELECT MAP', { fontFamily: 'PixelFont', fontSize: '35px', color: '#ffffff' }).setOrigin(0);

    var editSpaceNameText = createEditText();

    var backgroundSelectMap = self.rexUI.add.roundRectangle(420, panel.y + 110 + delta, 100, 100, 10, 0x121A2B).setAlpha(0.8);
    var addIcon = self.add.image(backgroundSelectMap.x, backgroundSelectMap.y, 'add-icon').setScale(0.8).setTint(0x888888);

    makeButtonInteractive(backgroundSelectMap, '', 0, 0);

    const startNowButton = createStartNowButton(panel.x + 150, panel.y + 160 + delta);

    makeButtonInteractive(startNowButton, '', 10, 10);


    createSelectMap();
}



function createEditText() {
    var defaultText = 'WHAT DO YOU WANT TO TALK ABOUT?';
    var editTextBackground = self.rexUI.add.roundRectangle(630, 290 + 10, 520, 50, 10, 0x121A2B);
    
    var editNameText = self.rexUI.add.BBCodeText(editTextBackground.x, editTextBackground.y - 3, defaultText, {
        color: '#FFFFFF',
        fontSize: '35px',
        fixedWidth: 510,
        fixedHeight: 50,
        valign: 'center',
        fontFamily: 'PixelFont',
    }).setOrigin(0.5).setInteractive().setAlpha(0.6)
        .on('pointerdown', function () {

            var config = {
                selectAll: true,
                onOpen: function (edit) {
                    editNameText.setAlpha(1);
                    blockMovement();
                    //self.tipsText.alpha = 0;
                },
                onTextChanged: function (editNameText, text) {
                    editNameText.text = text;
                },
                onClose: function (editNameText) {
                    unblockMovement();
                },
                // enterClose: false
            }
            var editor = new TextEdit(editNameText);
            editor.open(config);
        });

    return editNameText;
}

function createStartNowButton(x, y) {
    const startNowButton = self.rexUI.add.label({
        x: x, y: y,
        background: self.rexUI.add.roundRectangle(0, 0, 2, 2, 10, 0x121A2B).setStrokeStyle(2, 0x242A3B),
        text: self.add.text(0, 0, 'START NOW', { fontFamily: 'PixelFont', fontSize: '35px', color: '#ffffff' }).setOrigin(0.5),
        space: {
            left: 30,
            right: 30,
            top: 10,
            bottom: 17
        }
    }).layout().setAlpha(0.8);

    return startNowButton;
}

function createSelectMap() {
    selectMapGroup = self.add.group();

    var panel = self.add.image(1320, 360, 'cell-info').setScale(5, 4.8);

    var header = self.add.text(1130, 50, 'SELECT MAP', { fontFamily: 'PixelFont', fontSize: '45px', color: '#ffffff' }).setOrigin(0.5);
    
    var image = new CircleMaskImage(self, 500, 500, 'room1', {
        radius: 20
    });

}