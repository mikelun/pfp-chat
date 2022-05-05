export function createImageNFT(self, textureLink) {
    const image = document.createElement('img');
    image.src = textureLink;
    // make image width equal to 50
    image.width = 20;
    image.height = 20;
    self.player.yAdd = 20;
    self.player.xAddNFT = 5;
    self.player.yAddNFT = -25;
    self.playerUI[self.player.id].nftImage = self.add.dom(self.player.x, self.player.y, image);
    
}