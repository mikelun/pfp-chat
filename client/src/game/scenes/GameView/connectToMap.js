import { showMap } from "../../MapBuilding/showMap";
import { removeAllMonsters } from "../../socketController/mmorpgSocket";
import { disconnectPlayer } from "./disconnectPlayer";

export function connectToOtherMap(self) {
    disconnectPlayer(self);

    self.mapId = self.newMap;
    showMap(self, self.mapId);
    
}