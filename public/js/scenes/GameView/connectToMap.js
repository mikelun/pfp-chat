import { showMap } from "../../MapBuilding/showMap";
import { disconnectPlayer } from "./disconnectPlayer";

export function connectToOtherMap(self) {
    // remove, player and other players. add to server mapId, and make emit addPlayer with mapId
    disconnectPlayer(self);

    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
    playerInfo.mapId = self.newMap;
    playerInfo.mapChanged = true;
    self.mapId = playerInfo.mapId;
    showMap(self, self.mapId);
    self.socket.emit('removeFromRoom');
    self.socket.emit('addPlayer', self.address, self.room, playerInfo);
}