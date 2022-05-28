import { sceneEvents } from "../../Events/EventsCenter";
import { currentPlayerDisconnected, destroyPlayer} from "../../socketController/playerSocket";
import { clearPlayerUI } from "./playerUI";

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

    clearPlayerUI(self, self.player.id);

    currentPlayerDisconnected(self.player.id);

    // destroy main player  
    destroyPlayer();

    self.otherPlayers.getChildren().forEach(otherPlayer => {
        clearPlayerUI(self, otherPlayer.playerId);
        otherPlayer.destroy();
    });
    self.talkRectangle.destroy();
}