import { currentPlayerDisconnected, destroyPlayer } from "../../socketController/playerSocket";

export function disconnectPlayerBadInternet(self) {
    self.errors = self.add.group();
    self.errors.add(self.add.rectangle(self.player.x - 2000, self.player.y - 2000, 4000, 4000, 0x000000).setOrigin(0, 0).setAlpha(0.5));
    self.errors.add(self.add.text(self.player.x - 250, self.player.y - 100, 'Trying to reconnect...\n\nPlease check your internet\nconnection', { fontSize: '32px', fill: '#fff' }));

    // disconnect player
    disconnectPlayer(self);

    
}

export function disconnectPlayer(self) {
    // IF PLAYER DISCONNECT SAVE PLAYER INFO
    const playerInfo = {
        x: self.player.x,
        y: self.player.y,
        textureId: self.player.textureId,
        address: self.address,
        room: self.room,
        mapId: self.mapId,
    }
    localStorage.setItem('playerInfo', JSON.stringify(playerInfo));

    if (self.particles) {
        self.particles.destroy();
    }

    const playerUI = self.playerUI[self.player.id];
    currentPlayerDisconnected(self.player.id);
    playerUI.microphone.destroy();
    playerUI.playerText.destroy();
    playerUI.headphones.destroy();
    playerUI.background.destroy();

    // destroy main player
    destroyPlayer();

    self.otherPlayers.getChildren().forEach(otherPlayer => {
        self.playerUI[otherPlayer.playerId].playerText.destroy();
        self.playerUI[otherPlayer.playerId].microphone.destroy();
        self.playerUI[otherPlayer.playerId].background.destroy();
        self.playerUI[otherPlayer.playerId].headphones.destroy();
        otherPlayer.destroy();
    });
    self.talkRectangle.destroy();
}