import { sceneEvents } from "../../Events/EventsCenter";
import { getCurrentVolume } from "../Audio/audioMicrophoneStream";
import { addEffect } from "./addEffectToPlayer";
import { updateTalkingEffect } from "./playerUI";

var self;

var lastIsTalking = false;

export function initializePlayerEffects(newSelf) {
    self = newSelf;

    setInterval(() => {
        const volume = getCurrentVolume();
        playerIsTalking(volume);
    }, 1000);
}


function playerIsTalking(volume) {
    if (!self.player) return;

    const isTalking = volume > 5;

    if (isTalking == lastIsTalking) return;

    lastIsTalking = isTalking;
    
    // show or hide effect
    updateTalkingEffect(self, isTalking, self.player.id);

    console.log("SENDING DATA TO SERVER");
    // send info to server
    sendInfoToPlayers(self, isTalking);
}

function sendInfoToPlayers(self, isTalking) {
    if (!self.connected) return;

    var data;

    if (true || self.connected.length > 20) {
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