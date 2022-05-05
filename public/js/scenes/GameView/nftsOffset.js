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
        object.setOrigin(0.5, 0.5);
        object.yAdd = 0;
        if (isMainPlayer) {
            object.setScale(1);
            object.setBodySize(object.startWidth * 0.4, object.startHeight * 0.4, false)
            object.setOffset(10, object.startHeight * 0.7);
         }
        
    }
}