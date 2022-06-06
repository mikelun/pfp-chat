export function updateLocalStorage(self) {
    const player = self.player;
    const playerInfo = {
        x: player.x,
        y: player.y,
        rotation: player.rotation,
        textureId: player.textureId,
        playerName: player.playerName,
        mapId: self.mapId,
        mapChanged: self.mapChanged,
        microphoneStatus: player.microphoneStatus,
        deafen: player.deafen,
        nft: player.nft,
        address: player.address,
        room: self.room
    }
    localStorage.setItem('playerInfo', JSON.stringify(playerInfo));
}