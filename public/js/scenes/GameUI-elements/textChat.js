import { addTextBox } from "./textBox";
import { TextEdit } from 'phaser3-rex-plugins/plugins/textedit.js';

import BBCodeText from 'phaser3-rex-plugins/plugins/bbcodetext.js';
import { blockMovement, unblockMovement } from "../../utils/utils";
import { sendTextChatMessage } from "../../socketController/textChatSocket";

const defaultText = 'Type your message here';

var sizer;
var self;
export function addChat(newSelf) {
    self = newSelf;

    // const dom = document.createElement('INPUT');
    // dom.setAttribute("type", "text");
    // const editText = self.add.dom(200, 200, dom);
    addEditText();

    sizer = self.rexUI.add.sizer({
        x: 1050, y: 270,
        width: 400, height: 400,
        orientation: 'y',
    });
    // if player tap enter 
    self.input.keyboard.on('keydown-ENTER', function (event) {
        if (self.printText.alpha == 1) {
            var text = self.printText.text;
            if (text.length > 0 && text != defaultText) {
                const message = self.playerName + ': ' + text;
                addMessage(message, true);
            } else {
                self.printText.text = defaultText;
                self.printText.alpha = 0;
                self.tipsText.alpha = 0;
            }
        } else {
            self.printText.alpha = 1;
            self.tipsText.alpha = 1;
        }
    });
    // const child = this.addTextBox('asdfasdf');
}

export function addMessage(message, sendToServer) {
    if (sizer.children.length > 8) {
        // destroy the first one
        sizer.children[0].destroy();
    }
    const child = addTextBox(self, message);
    sizer.add(child).layout();
    
    if (sendToServer) sendTextChatMessage(message);
    // remove this child after 10 seconds
    self.time.delayedCall(10000, function () {
        sizer.remove(child, true).layout();
    }, [], self);
}

function addEditText() {
        self.tipsText = self.add.text(500, 530, 'To close the chat, press enter', { fontSize: '35px', fill: "#ffffff", fontFamily: 'PixelFont' }).setAlpha(0);
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
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', function () {
                console.log("HERE");
                var config = {
                    enterClose: true,
                    onOpen: function (printText) {
                        blockMovement();
                        //self.tipsText.alpha = 0;
                    },
                    onTextChanged: function (printText, text) {
                        printText.text = text;
                    },
                    onClose: function (printText) {
                        unblockMovement();
                        self.printText.text = '';
                    },
                    selectAll: true,
                    // enterClose: false
                }
                var editor = new TextEdit(self.printText);
                editor.open(config);
            }, self);
        self.add.existing(self.printText);
        self.printText.setAlpha(0);
    }


