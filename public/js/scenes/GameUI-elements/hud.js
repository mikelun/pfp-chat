var coinsText;

export function initializeHUD(self, coinsPlayer) {
    self.add.image(5, -90, 'hud').setOrigin(0, 0).setScale(2);
    const coinImage = self.add.sprite(25, 80, 'coin1').setOrigin(0, 0);


    coinsText = self.add.text(50, 76, `${coinsPlayer}`, { fontSize: '24px', fill: '#ffffff', fontFamily: 'PixelFont' }).setOrigin(0, 0);
}

export function updatePlayerCoins(coins) {
    coinsText.setText(coins);
}