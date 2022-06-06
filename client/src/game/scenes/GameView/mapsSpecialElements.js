import { sceneEvents } from "../../Events/EventsCenter";
import { createParticles } from "../../utils/particles";
import { addWeapon, removeWeapon } from "../Weapons/weapon";

export function createMapsSpecialElements(self, player) {
    if (self.mapId == 4) {
        createParticles(self);
    }
    
    sceneEvents.emit('changedMap', self.mapId);

    if (self.mapId == 8) {
        addWeapon(self);
    } else {
        removeWeapon(self);
    }
}