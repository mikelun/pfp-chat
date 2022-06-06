import { addMessage } from "../scenes/GameUI-elements/textChat";

var self;
export function initializeChatSocket(anotherSelf) {
    self = anotherSelf;
    self.socket.on('textChatMessage', (message) => {
        addMessage(message);
    })
}

export function sendTextChatMessage(message) {
    self.socket.emit('textChatMessage', message, false);
}