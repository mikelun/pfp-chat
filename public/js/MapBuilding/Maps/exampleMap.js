import { addAudioTimer } from "../../utils/addAudioTimer";
import { addIframeGameAndMusicMachine } from "../../utils/addIframeGameAndMusicMachine";
import { addPlayerOverlap } from "../../utils/playerOverlap";
import { addAnimationForMap } from "../AnimatedTile";


// Add map with id 
export function addMapID (self) {
    const NAME = self.make.tilemap({ key: 'NAME' });
    const tileset = dungeon.addTilesetImage('TILEMAP_NAME', 'TILEMAP_NAME');

    // Create layers
    self.layer1.add(dungeon.createStaticLayer('floor', tileset));
}

// add physics when player added to map
export function addPhysicsForMap1(self) {

}


export function addUpdateForMap1(self) {

}