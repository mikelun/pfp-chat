import { disconnectPlayer } from "./disconnectPlayer";

export function connectToOtherMap(self) {
    // remove, player and other players. add to server mapId, and make emit addPlayer with mapId
    disconnectPlayer(self);

    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
    playerInfo.mapId = self.newMap;
    self.socket.emit('addPlayer', self.address, self.room, playerInfo);
}