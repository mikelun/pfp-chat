import { sceneEvents } from "../../Events/EventsCenter";
import { updateTalkingEffect } from "../../socketController/playerSocket";
import { getCurrentVolume } from "../Audio/audioMicrophoneStream";
import { addEffect } from "./addEffectToPlayer";

var self;
export function initializePlayerEffects(newSelf) {
    self = newSelf;

    setInterval(() => {
        const volume = getCurrentVolume();
        playerIsTalking(volume);
    }, 1000);
}
function playerIsTalking(volume) {
    if (!self.player) return;

    const isTalking = volume > 1;

    // show or hide effect
    if (self.talkingEffect) self.talkingEffect.setAlpha(isTalking ? 1 : 0);

    // send info to server
    sendInfoToPlayers(self, isTalking);
}

export function destroyEffects(self) {
    if (self.talkingEffect) self.talkingEffect.destroy();
}

function sendInfoToPlayers(self, isTalking) {
    if (!self.connected) return;

    var data;

    if (self.connected.length > 20) {
        // to all players
        data = {
            toAllPlayer: true,
            isTalking: isTalking
        }
    } else {
        // to only connected players
        var ids = [];
        self.connected.forEach(player => {
            ids.push(player.playerId);
        });

        data = {
            toAllPlayer: false,
            ids: ids,
            isTalking: isTalking,
        };
    }

    sceneEvents.emit('updateTalkingEffect', data);

}