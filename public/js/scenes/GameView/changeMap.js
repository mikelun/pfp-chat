import { connect } from "socket.io-client";
import { clearMapWithTransition } from "../../MapBuilding/Maps/maps-utils";
import { clearMap, showMap } from "../../MapBuilding/showMap";
import { removeAllMonsters } from "../../socketController/mmorpgSocket";
import { connectToOtherMap } from "./connectToMap";
import { disconnectPlayer } from "./disconnectPlayer";

export function changeMap(self, mapId) {
    clearMapWithTransition(self);
    disconnectPlayer(self);

    setTimeout(() => {
        self.mapId = mapId;
        showMap(self, mapId);
        self.socket.emit('connectToOtherRoom', self.mapId);
    }, 700)
    
}
