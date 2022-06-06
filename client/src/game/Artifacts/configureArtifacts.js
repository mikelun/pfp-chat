import { artifactsCharacters } from "./artifacts";

export function configureArtifactCharacter(self, artifact, object, isOtherPlayer = false) {

    const artifactName = artifact.replace('artifact$', '');

    object.setTexture(artifactName);

    object.yAdd = artifactsCharacters[artifactName]['yAdd'];
    createAnimationForArtifactCharacter(self, artifactName, object);

    const scale = artifactsCharacters[artifactName].scale;
    const offset = artifactsCharacters[artifactName].offset;
    object.setScale(scale);
    if (isOtherPlayer) return;
    object.setBodySize(object.startWidth * 10, object.startHeight * 10, false)
    object.setOffset(offset.x, offset.y);

}

function createAnimationForArtifactCharacter(self, artifactName, object) {
    const key = artifactsCharacters[artifactName]['animations']['key'];
    
    // if animation already exists
    if (self.anims.get(key)) {
        object.play(key);
        return;
    }
    
    const endFrame = artifactsCharacters[artifactName]['animations']['endFrame'];
    const frameRate = artifactsCharacters[artifactName]['animations']['frameRate'];
    self.anims.create({
        key: key,
        frames: self.anims.generateFrameNumbers(artifactName, { start: 0, end: endFrame }),
        frameRate: frameRate,
        repeat: -1
    });
    object.play(key);
}