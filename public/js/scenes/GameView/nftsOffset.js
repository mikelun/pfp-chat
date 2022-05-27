export function resizeObjectForNFT(object, type, isMainPlayer) {
    if (type == 'moonbirds') {
        object.yAdd = -110;
        object.setScale(0.2);
        object.setOrigin(0.5, 0.5);
        if (isMainPlayer) {
            object.setBodySize(object.startWidth * 2.2, object.startHeight * 0.5, false)
            object.setOffset(100 - 8, 170);
        }
    } else if (type == 'crypto-duckies') {
        object.yAdd = 0;
        object.setScale(1);
        object.setOrigin(0.5, 0.5);
        if (isMainPlayer) {
            object.setBodySize(object.startWidth * 0.25, object.startHeight * 0.1, false)
            object.setOffset(10, object.startHeight * 0.7 + 4);
        }
    } else if ((type + '').startsWith('nft')) {
        object.yAdd = 0;
        object.setScale(2);
        object.setOrigin(0.5, 0.5);
        if (isMainPlayer) {
            object.setBodySize(object.startWidth * 0.1, object.startHeight * 0.1, false)
            object.setOffset(10, object.startHeight * 0.7);
        }
    } else {
        // object.setScale(1.5);
        // object.setOrigin(0.5, 0.5);
    }
}