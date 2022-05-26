export function updateOtherPlayersPositions(self, delta) {
    self.otherPlayers.getChildren().forEach(otherPlayer => {
        // Make interpolation for smoother movement
        if (otherPlayer.newX) {
            let diffX = otherPlayer.x - otherPlayer.newX;
            if (Math.abs(diffX) < 0.1) {
                otherPlayer.x = otherPlayer.newX;
            } else {
                otherPlayer.x = otherPlayer.x - diffX * 0.05;
            }
            let diffY = otherPlayer.y - otherPlayer.newY;
            if (Math.abs(diffY) < 0.1) {
                otherPlayer.y = otherPlayer.newY;
            } else {
                otherPlayer.y = otherPlayer.y - diffY * 0.02 * delta;
            }
            otherPlayer.update(otherPlayer.x, otherPlayer.y);
        }

        self.playerUI[otherPlayer.playerId].x = otherPlayer.x;
        self.playerUI[otherPlayer.playerId].y = otherPlayer.y;
    });
}