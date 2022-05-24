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

        const playerUI = self.playerUI[otherPlayer.playerId];

        const playerText = playerUI.playerText;
        
        playerText.x = otherPlayer.x;
        playerText.y = otherPlayer.y - 22;

        playerUI.background.x = otherPlayer.x - 0.25;
        playerUI.background.y = otherPlayer.y - 20;
        playerUI.microphone.x = otherPlayer.x - 4;
        playerUI.microphone.y = otherPlayer.y - 20 - 10;
        playerUI.headphones.x = otherPlayer.x + 4;
        playerUI.headphones.y = otherPlayer.y - 19 - 10;
        if (playerUI.weapon) {
            playerUI.weapon.x = otherPlayer.x;
            playerUI.weapon.y = otherPlayer.y + 8;
        }
    });
}