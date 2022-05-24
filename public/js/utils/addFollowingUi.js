export function addFollowingUI(self) {
    const playerUI = self.playerUI[self.socket.id];

    if (playerUI) {
        const playerText = playerUI.playerText;
        if (playerText) {
            const textSize = playerText.text.length;
            playerText.x = self.player.x - textSize * 2.8;
            playerText.y = self.player.y - 35;
        }
    }
}