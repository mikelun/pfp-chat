import { sceneEvents } from "../../Events/EventsCenter";
import { currentPlayerDisconnected, destroyPlayer } from "../../socketController/playerSocket";

export function disconnectPlayerBadInternet(self) {
    sceneEvents.emit('createErrorDisconnectMessage');
    // disconnect player
    disconnectPlayer(self);
}

export function disconnectPlayer(self) {
    if (!self.player) return;
    
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
        if (self.playerUI[otherPlayer.playerId].weapon) {
            self.playerUI[otherPlayer.playerId].weapon.destroy();
        }
        otherPlayer.destroy();
    });
    self.talkRectangle.destroy();
}