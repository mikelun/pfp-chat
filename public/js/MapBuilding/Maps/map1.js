import { addAudioTimer } from "../../utils/addAudioTimer";
import { addIframeGameAndMusicMachine } from "../../utils/addIframeGameAndMusicMachine";
import { addPlayerOverlap } from "../../utils/playerOverlap";
import { addAnimationForMap } from "../AnimatedTile";


// Add map with id 1
export function addMap1(self) {
    const dungeon = self.make.tilemap({ key: 'dungeon' });
    const tileset = dungeon.addTilesetImage('TilemapDay', 'tiles');
    
    // Create layers and collides for physics
    dungeon.createStaticLayer('floor', tileset);
    
    self.stairsUpFloorLayer = dungeon.createStaticLayer('stairs-up-floor', tileset);
    self.stairsUpFloorLayer.setCollisionByProperty({ collides: true })//.renderDebug(debugGraphics, debugConfig);

    self.objectsLayer = dungeon.createDynamicLayer('objects', tileset);
    self.objectsLayer.setCollisionByProperty({ collides: true })//.renderDebug(debugGraphics, debugConfig);

    dungeon.createStaticLayer('next-objects', tileset);

    self.wallsLayer = dungeon.createStaticLayer('walls', tileset);
    self.wallsLayer.setCollisionByProperty({ collides: true })//.renderDebug(debugGraphics, debugConfig);
    
    addAnimationForMap(self, dungeon, tileset);

    // fix player position
    self.playerAddX = 0;
    self.playerAddY = 0;

    addObjectForMap(self);
}

// add physics when player added to map
export function addPhysicsForMap1(self) {
    self.physics.add.collider(self.player, self.wallsLayer);
    self.physics.add.collider(self.player, self.stairsUpFloorLayer);
    self.physics.add.collider(self.player, self.objectsLayer);
    
    // add colliders for ball
    self.physics.add.collider(self.ball, self.player);
    self.physics.add.collider(self.ball, self.wallsLayer);
    self.physics.add.collider(self.ball, self.stairsUpFloorLayer);
    self.physics.add.collider(self.ball, self.objectsLayer);
}

function addObjectForMap(self) {
    // INITIALIZE Music Machine (YOU CAN SEE RAINBOW TV AT MAIN MAP) 
    self.audio = null;
    self.musicMachineGroup = self.add.group();
    self.musicMachineShadowGroup = self.add.group();

     // adding music machine image to main map
     self.add.image(230, 680, 'machine').setScale(0.1);

     // add iframe game(You can see it upstairs on main map) and music machine - rainbow TV ;)
     addIframeGameAndMusicMachine(self);

     // add ball for fun with physics
     self.ball = self.physics.add.image(550, 910, 'ball').setScale(0.08).setBounce(0.9).setVelocity(0, 0);
}

export function addUpdateForMap1(self) {
    // if player overlap with game objects(TV, Games, etc)
    addAudioTimer(self);
    addPlayerOverlap(self);
}