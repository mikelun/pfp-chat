import { resizeObjectForNFT } from "./nftsOffset";

export function loadTexture(self, object, textureLink, type, isMainPlayer = false) {
    object.textureId = textureLink;
    object.nftType = type;

    resizeObjectForNFT(object, type, isMainPlayer);
    
    if (self.textures.exists(textureLink)) {
        object.setTexture(textureLink);
        return;
    }
    
    self.load.image(textureLink, textureLink)
    self.load.on('filecomplete', function (key, file) {
        if (key == textureLink) {
            object.setTexture(textureLink);
        }
    });
    self.load.start();
}