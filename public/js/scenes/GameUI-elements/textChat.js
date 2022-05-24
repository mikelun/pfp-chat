import { addTextBox } from "./textBox";
import { TextEdit } from 'phaser3-rex-plugins/plugins/textedit.js';

import BBCodeText from 'phaser3-rex-plugins/plugins/bbcodetext.js';
import { blockMovement, unblockMovement } from "../../utils/utils";
import { sendTextChatMessage } from "../../socketController/textChatSocket";

const defaultText = '';

var sizer;
var self;
export function addChat(newSelf) {
    self = newSelf;

    addEditText();

    sizer = self.rexUI.add.sizer({
        x: 0, y: 110,
        orientation: 'y',
        align: 'left',

    }).setOrigin(0);
}

export function addMessage(message, sendToServer) {
    if (sizer.children.length > 12) {
        // destroy the first one
        sizer.children[0].destroy();
    }
    const child = addTextBox(self, message);
    sizer.add(child, 0, 'left').layout();

    if (sendToServer) sendTextChatMessage(message);
    // remove this child after 60 seconds
    self.time.delayedCall(30000, function () {
        sizer.remove(child, true).layout();
    }, [], self);
}

function addEditText() {
    self.tipsText = self.add.text(470, 530, 'To close the chat, click on any place', { fontSize: '35px', fill: "#ffffff", fontFamily: 'PixelFont' }).setAlpha(0);
    self.printText = new BBCodeText(self, 700, 500, defaultText, {
        color: '#ffffff',
        fontSize: '35px',
        fixedWidth: 800,
        fixedHeight: 50,
        backgroundColor: "#333366",
        valign: 'center',
        fontFamily: 'PixelFont',
        padding: {
            left: 20,
            right: 0,
            top: 0,
            bottom: 10,
        },
    }).setOrigin(0.5).setAlpha(0);

    self.input.keyboard.on('keydown', function (event) {
        if (event.key == 'Enter') {
            if (self.printText.alpha == 1)  {
                self.printText.alpha = 0;
            } else {
                self.printText.alpha = 1;
            }
        }
        if (self.printText.alpha == 1 && (self.printText.text == defaultText || self.printText.text.length == 0)) {
            var config = {
                enterClose: true,
                onOpen: function (printText) {
                    blockMovement();
                    self.tipsText.alpha = 1;
                    //self.tipsText.alpha = 0;
                },
                onTextChanged: function (printText, text) {
                    printText.text = text;
                },
                onClose: function (printText) {
                    self.tipsText.alpha = 0;
                    self.printText.alpha = 0;
                    const text = self.printText.text;
                    if (text.length > 0 && text != defaultText && !self.input.activePointer.isDown) {
                        const message = self.playerName + ': ' + text;
                        addMessage(message, true);
                    }
                    unblockMovement();
                    self.printText.text = '';
                },
                selectAll: true,
                // enterClose: false
            }
            var editor = new TextEdit(self.printText);
            editor.open(config);
        }
    }, self);
}


