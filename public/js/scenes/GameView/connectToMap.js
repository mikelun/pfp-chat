import { showMap } from "../../MapBuilding/showMap";
import { removeAllMonsters } from "../../socketController/mmorpgSocket";
import { disconnectPlayer } from "./disconnectPlayer";

export function connectToOtherMap(self) {
    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
    playerInfo.textureId = self.player.textureId;
    // remove, player and other players. add to server mapId, and make emit addPlayer with mapId
    disconnectPlayer(self);

    // remove monsters if mapId is 8
    self.previousMap = self.mapId;
    
    playerInfo.mapId = self.newMap;
    playerInfo.mapChanged = self.mapId;
    self.mapId = playerInfo.mapId;
    showMap(self, self.mapId);
    self.socket.emit('connectToOtherRoom', self.mapId);
    
}