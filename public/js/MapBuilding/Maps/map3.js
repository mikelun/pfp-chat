import { addAnimationForMap } from "../AnimatedTile";

export function addMap3(self) {
    const surfVibeMap = self.make.tilemap({ key: 'surf-vibe' });
    // add tileset image
    const cliffsTileset = surfVibeMap.addTilesetImage('Animated_Cliffs', 'Animated_Cliffs', 48, 48, 1, 2);
    const deepwaterTileset = surfVibeMap.addTilesetImage('Animated_Deepwater', 'Animated_Deepwater', 48, 48, 1, 2);
    const shoreTileset = surfVibeMap.addTilesetImage('Animated_Shore', 'Animated_Shore', 48, 48, 1, 2);
    const mainTileset = surfVibeMap.addTilesetImage('MainTileMap', 'MainTileMap', 48, 48, 1, 2);
    const boatsTileset = surfVibeMap.addTilesetImage('Animated_Boats', 'Animated_Boats', 48, 48, 1, 2);
    const pierTileset = surfVibeMap.addTilesetImage('Animated_Pier', 'Animated_Pier', 48, 48, 1, 2);
    const nettingTileset = surfVibeMap.addTilesetImage('Animated_Netting', 'Animated_Netting', 48, 48, 1, 2);

    self.shoreLayer = surfVibeMap.createLayer('Shore', [mainTileset, deepwaterTileset, shoreTileset]).setCollisionByProperty({ collides: true });;
    self.layer1.add(self.shoreLayer);

    self.invisibleWalls = surfVibeMap.createLayer('invisibleWalls', [mainTileset]).setCollisionByProperty({ collides: true });;
    
    self.layer2.add(self.invisibleWalls);
    self.layer1.add(surfVibeMap.createLayer('objects', [mainTileset, cliffsTileset, nettingTileset, pierTileset]));
    self.layer1.add(surfVibeMap.createLayer('objects-1', [mainTileset, pierTileset]));
    self.layer1.add(surfVibeMap.createLayer('objects-2', [boatsTileset, mainTileset, pierTileset]));
    self.layer1.add(surfVibeMap.createLayer('objects-3', [boatsTileset, mainTileset]));
    self.layer2.add(surfVibeMap.createLayer('walls', mainTileset));
    self.layer2.add(surfVibeMap.createLayer('invisible1', mainTileset));
    self.layer2.add(surfVibeMap.createLayer('invisible2', mainTileset));
    
    self.cameras.main.setBounds(0, 0, surfVibeMap.widthInPixels - 600, surfVibeMap.heightInPixels);
    
    // surfVibeMap.createStaticLayer('Shore', shoreTileset);
    //surfVibeMap.createStaticLayer('Shore', mainTileset)
    // const boatsTileset = surfVibeMap.addTilesetImage('Animated_Boats', 'Animated_Boats');


   addAnimationForMap(self, surfVibeMap, deepwaterTileset);
   addAnimationForMap(self, surfVibeMap, shoreTileset);
   addAnimationForMap(self, surfVibeMap, cliffsTileset);
   addAnimationForMap(self, surfVibeMap, boatsTileset);
   addAnimationForMap(self, surfVibeMap, nettingTileset);
   addAnimationForMap(self, surfVibeMap, pierTileset);

    // fix player position
    self.playerAddX = 100;
    self.playerAddY = 2000;
}

// add physics when player added to map
export function addPhysicsForMap3(self) {
    self.physics.add.collider(self.player, self.invisibleWalls);
}


export function addUpdateForMap3(self) {

}