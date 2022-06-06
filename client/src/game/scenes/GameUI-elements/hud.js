import { sceneEvents } from "../../Events/EventsCenter";

var coinsText, dom, healthBar, experienceBar;

var self;

var catIcon;

export function initializeHUD(newSelf,  data) {
    const {coinsCount, nftImage, textureId} = data;
    self = newSelf;
    self.add.image(5, -90, 'hud').setOrigin(0, 0).setScale(2);
    
    const coinImage = self.add.sprite(25, 80, 'coin1').setOrigin(0, 0);

    coinsText = self.add.text(50, 76, `${coinsCount}`, { fontSize: '24px', fill: '#ffffff', fontFamily: 'PixelFont' }).setOrigin(0, 0);

    healthBar = self.add.image(76, 28, 'experience-bar').setOrigin(0, 0).setScale(0 * 4, 2);
    // 10% -> 0.2

    //experienceBar = self.add.image(76, 59, 'experience-bar').setOrigin(0, 0).setScale(1.7, 2);
    self.add.text(78, 50, '0/100 xp', { fontSize: '24px', fill: '#CC9900', fontFamily: 'PixelFont' }).setOrigin(0, 0);
    updateNFTImage(nftImage);

    // check if textureId is number
    if (typeof textureId === 'number') {
        catIcon = self.add.image(45, 46, `characters${textureId}`).setScale(1.5);
    }
}

export function updatePlayerCoins(coins) {
    coinsText.setText(coins);
}

export function updateNFTImage(nftImage) {
    if (catIcon) {
        catIcon.destroy();
        catIcon = null;
    }
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
