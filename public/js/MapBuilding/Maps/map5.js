import { addAudioTimer } from "../../utils/addAudioTimer";
import { addIframeGameAndMusicMachine } from "../../utils/addIframeGameAndMusicMachine";
import { addPlayerOverlap } from "../../utils/playerOverlap";
import { addAnimationForMap } from "../AnimatedTile";


// Add map with id 
export function addMap5(self) {
    const moonbirds = self.make.tilemap({ key: 'moonbirds-map' });

    const tileset = moonbirds.addTilesetImage('MainTileMap', 'MainTileMap', 48, 48, 1, 2);

    // Create layers
    self.layer1.add(moonbirds.createStaticLayer('floor', tileset));
    self.layer1.add(moonbirds.createStaticLayer('objects', tileset));
    self.layer1.add(moonbirds.createStaticLayer('objects-2', tileset));
    
    self.invisibleWalls = moonbirds.createLayer('invisibleWalls', tileset).setCollisionByProperty({ collides: true });;
    self.invisibleWalls.setVisible(false);

    self.cameras.main.setBounds(0, 0, moonbirds.widthInPixels, moonbirds.heightInPixels);
}

// add physics when player added to map
export function addPhysicsForMap5(self) {
    self.physics.add.collider(self.player, self.invisibleWalls);
}


export function addUpdateForMap5(self) {

}