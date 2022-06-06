import { connect } from "socket.io-client";
import { sceneEvents } from "../../Events/EventsCenter";
import { clearMapWithTransition } from "../../MapBuilding/Maps/maps-utils";
import { clearMap, showMap } from "../../MapBuilding/showMap";
import { removeAllMonsters } from "../../socketController/mmorpgSocket";
import { connectToOtherMap } from "./connectToMap";
import { disconnectPlayer } from "./disconnectPlayer";

export function changeMap(self, data) {
    if (self.mapId == 8) {
        console.log('removing monsters!');
        removeAllMonsters();
    }
    clearMapWithTransition(self);
    disconnectPlayer(self);
    

    setTimeout(() => {
        self.mapId = data.mapId;
        showMap(self, data.mapId);
        self.socket.emit('connectToOtherRoom', data);

        if (data.space) {
            sceneEvents.emit('createCopyLinkButton', data.space.id);
            // change site href
            if (window.history.replaceState) {
                window.history.replaceState({}, '', `/${data.space.id}`);
            }
        } else {
            sceneEvents.emit('destroyCopyLinkButton');
            // change site href
            if (window.history.replaceState) {
                window.history.replaceState({}, '', `/`);
            }
        }
    }, 700)

}
