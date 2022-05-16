var coinsText, dom;

var self;

export function initializeHUD(newSelf, coinsPlayer, nftImage) {
    self = newSelf;
    
    self.add.image(5, -90, 'hud').setOrigin(0, 0).setScale(2);

    updateNFTImage(self, nftImage);

    const coinImage = self.add.sprite(25, 80, 'coin1').setOrigin(0, 0);


    coinsText = self.add.text(50, 76, `${coinsPlayer}`, { fontSize: '24px', fill: '#ffffff', fontFamily: 'PixelFont' }).setOrigin(0, 0);
}

export function updatePlayerCoins(coins) {
    coinsText.setText(coins);
}

export function updateNFTImage(nftImage) {
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