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
        if (playerText) {
            const textSize = playerText.text.length;
            playerText.x = otherPlayer.x - textSize * 2.8;
            playerText.y = otherPlayer.y - 35;
        }
        
        playerUI.background.x = otherPlayer.x;
        playerUI.background.y = otherPlayer.y - 25;
        playerUI.microphone.x = otherPlayer.x - 8;
        playerUI.microphone.y = otherPlayer.y - 40;
        playerUI.headphones.x = otherPlayer.x + 7;
        playerUI.headphones.y = otherPlayer.y - 38;
        playerUI.weapon.x = otherPlayer.x;
        playerUI.weapon.y = otherPlayer.y + 8;
    });
}