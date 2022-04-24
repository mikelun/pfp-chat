import { createAnimationForAnimal } from "../../anims/characterAnims";
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
    self.invisibleWalls.setVisible(false);

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
    //self.playerAddX = 670;
    //self.playerAddY = 1580;

    // ADDING ANIMALS
    self.dog2 = self.add.sprite(1100, 1340 + 850, 'cat1-Idle');
    createAnimationForAnimal(self.anims, 'cat1');
    self.dog2.play('cat1-Idle');
    self.dog2.addX = 0;

    self.lastVisit = 0;

    // adding object to map
    addObjectsToMap(self);
    
}

function addObjectsToMap(self) {
    
    // ADDING SCENE RECTANGLE
    console.log('added rectangle');
    self.scene = self.add.rectangle(850, 2050, 200, 200, 0x000000).setOrigin(0, 0).setAlpha(0);

}

// add physics when player added to map
export function addPhysicsForMap3(self) {
    self.physics.add.collider(self.player, self.invisibleWalls);
}


export function addUpdateForMap3(self, time, delta) {

    // MAKE NPC CAT :)
    self.dog2.x += self.dog2.addX;
    if (self.dog2.x < 970 && self.stop == false) {
        self.dog2.addX = 0;
        self.dog2.x = 970;
        self.dog2.play('cat1-Idle');
        self.stop = true;
    }


    // Current time in seconds
    const timeSec = Math.floor(time / 1000);
    if (timeSec - self.lastVisit > 5 + Math.floor(Math.random() * 5)) {
        
        // CAT CAN RUN FROM 970 - 1500 in X
        // get random number for next movement
        // 0 - go right
        // 1 - go left
        // 2 - stay
        self.stop = false;
        self.dog2.anims.stop();
        
        const moveId = Math.floor(Math.random() * 3);
        if (moveId === 0) {
            self.dog2.addX = 0.5;
            self.dog2.play('cat1-Walk');
            self.dog2.flipX = false;
        } else if (moveId === 1) {
            self.dog2.addX = -0.5;
            self.dog2.play('cat1-Walk');
            self.dog2.flipX = true;
        } else if (moveId === 2) {
            self.dog2.play('cat1-Idle');
            self.dog2.addX = 0;
        }
        self.lastVisit = timeSec;
    }
}