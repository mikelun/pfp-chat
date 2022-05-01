export function addFollowingUI(self) {
    const playerUI = self.playerUI[self.socket.id];

    if (playerUI) {
        const playerText = playerUI.playerText;
        if (playerText) {
            const textSize = playerText.text.length;
            playerText.x = self.player.x - textSize * 2.8;
            playerText.y = self.player.y - 35;
        }
        playerUI.background.x = self.player.x;
        playerUI.background.y = self.player.y - 25;
        playerUI.microphone.x = self.player.x - 8;
        playerUI.microphone.y = self.player.y - 40;
        playerUI.headphones.x = self.player.x + 7;
        playerUI.headphones.y = self.player.y - 38;
    }
}