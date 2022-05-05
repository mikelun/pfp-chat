export function animateMovement(object, directionX, directionY, type, nftType) {
    if (nftType) {
        animateNFTMovement(object, directionX, directionY, nftType);
        return;
    }

    if ((type + '').startsWith('nft')) {
        animateBackgroundForNFT(object, directionX, directionY, type);
        return;
    }

    // ANIMATE MAIN CHARACTER
    animateMainCharacter(object, directionX, directionY, type);

}

function animateNFTMovement(object, directionX, directionY, nftType) {
    if (nftType == 'moonbirds' || nftType == 'crypto-duckies') {
        if (directionX == 'left') {
            object.flipX = true;
        } else if (directionX == 'right') {
            object.flipX = false;
        }

        object.rotation += object.walkEffect;
        if (Math.abs(object.rotation) > 0.1) {
            object.walkEffect *= -1;
        }
    }
}

function animateBackgroundForNFT(object, directionX, directionY, type) {
    if (directionX == 'left') {
        object.flipX = true;
    } else if (directionX == 'right') {
        object.flipX = false;
    }
    object.play(`${type}-run`, true);
}

function animateMainCharacter(object, directionX, directionY, type) {
    if (directionY) {
        object.play(`${type}-${directionY}`, true);
    }  else {
        object.play(`${type}-${directionX}`, true);
    }
} 