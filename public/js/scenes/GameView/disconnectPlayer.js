import { sceneEvents } from "../../Events/EventsCenter";
import { currentPlayerDisconnected, destroyPlayer } from "../../socketController/playerSocket";
import { clearPlayerUI } from "./addPlayersUtils";
import { destroyEffects } from "./playerEffects";

export function disconnectPlayerBadInternet(self) {
    sceneEvents.emit('createErrorDisconnectMessage');
    // disconnect player
    disconnectPlayer(self);
}

export function disconnectPlayer(self) {


    // hide player effects
    destroyEffects(self);

    if (!self.player) return;

    if (self.particles) {
        self.particles.destroy();
    }

    const playerUI = self.playerUI[self.player.id];
    currentPlayerDisconnected(self.player.id);
    clearPlayerUI(playerUI);

    // destroy main player
    destroyPlayer();

    self.otherPlayers.getChildren().forEach(otherPlayer => {
        clearPlayerUI(self.playerUI[otherPlayer.playerId]);
        otherPlayer.destroy();
    });
    self.talkRectangle.destroy();
}