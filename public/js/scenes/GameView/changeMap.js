import { connect } from "socket.io-client";
import { clearMapWithTransition } from "../../MapBuilding/Maps/maps-utils";
import { clearMap, showMap } from "../../MapBuilding/showMap";
import { removeAllMonsters } from "../../socketController/mmorpgSocket";
import { connectToOtherMap } from "./connectToMap";
import { disconnectPlayer } from "./disconnectPlayer";

export function changeMap(self, data) {
    clearMapWithTransition(self);
    disconnectPlayer(self);

    setTimeout(() => {
        self.mapId = data.mapId;
        showMap(self, data.mapId);
        self.socket.emit('connectToOtherRoom', data);
    }, 700)
    
}
