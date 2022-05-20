var coinsText, dom, healthBar, experienceBar;

var self;

export function initializeHUD(newSelf, coinsPlayer, nftImage) {
    self = newSelf;
    self.add.image(5, -90, 'hud').setOrigin(0, 0).setScale(2);
    
    const coinImage = self.add.sprite(25, 80, 'coin1').setOrigin(0, 0);

    coinsText = self.add.text(50, 76, `${coinsPlayer}`, { fontSize: '24px', fill: '#ffffff', fontFamily: 'PixelFont' }).setOrigin(0, 0);

    healthBar = self.add.image(76, 28, 'experience-bar').setOrigin(0, 0).setScale(0 * 4, 2);
    // 10% -> 0.2

    //experienceBar = self.add.image(76, 59, 'experience-bar').setOrigin(0, 0).setScale(1.7, 2);
    self.add.text(78, 50, '0/100 xp', { fontSize: '24px', fill: '#CC9900', fontFamily: 'PixelFont' }).setOrigin(0, 0);
    updateNFTImage(nftImage);
}

export function updatePlayerCoins(coins) {
    coinsText.setText(coins);
}

export function updateNFTImage(nftImage) {
    if (!nftImage) return;
    if (dom) {
        dom.src = nftImage;
    } else {
        dom = document.createElement('img');
        dom.src = nftImage;
        dom.style.width = '52px';
        dom.style.height = '52px';
        self.add.dom(45, 48, dom);
    }
}
