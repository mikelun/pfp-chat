export function resizeObjectForNFT(object, type, isMainPlayer) {
    if (type == 'moonbirds') {
        object.yAdd = -100;
        object.setScale(0.2);
        object.setOrigin(0.5, 0.5);
        if (isMainPlayer) {
            object.setBodySize(object.startWidth * 2, object.startHeight * 2, false)
            object.setOffset(100, 100);
        }
    } else if (type == 'crypto-duckies') {
        object.yAdd = 0;
        object.setScale(1);
        object.setOrigin(0.5, 0.5);
        if (isMainPlayer) {
            object.setBodySize(object.startWidth * 0.4, object.startHeight * 0.4, false)
            object.setOffset(10, object.startHeight * 0.7);
        }
    } else if ((type + '').startsWith('nft')) {
        object.yAdd = 0;
        object.setScale(2);
        object.setOrigin(0.5, 0.5);
        if (isMainPlayer) {
            object.setBodySize(object.startWidth * 0.4, object.startHeight * 0.4, false)
            object.setOffset(10, object.startHeight * 0.7);
        }
    } else {
        // object.setScale(1.5);
        // object.setOrigin(0.5, 0.5);
    }
}