import { updateTalkingEffect } from "../../socketController/playerSocket";
import { getCurrentVolume } from "../Audio/audioMicrophoneStream";
import { addEffect } from "./addEffectToPlayer";

var self;
export function initializePlayerEffects(newSelf) {
    self = newSelf;

    setInterval(() => {
        const volume = getCurrentVolume();
        playerIsTalking(volume);

        if (self.connected) {
            console.log(self.connected.getChildren());
        }

    }, 1000);
}
function playerIsTalking(volume) {
    if (!self.player) return;

    const isTalking = volume > 1;

    // show or hide effect
    if (self.talkingEffect) self.talkingEffect.setAlpha(isTalking ? 1 : 0);

    // send info to server
    //updateTalkingEffect(isTalking);
}

export function destroyEffects(self) {
    if (self.talkingEffect) self.talkingEffect.destroy();
}
