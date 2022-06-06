import { addAnimationForMap } from "../AnimatedTile";

export function addMap2(self) {
    const mapNight = self.make.tilemap({ key: 'map-night-home' });
    // add tileset image
    const tilesetNight = mapNight.addTilesetImage('TilemapNight', 'tiles-night');

    self.floorLayer = mapNight.createStaticLayer('floor', tilesetNight).setCollisionByProperty({ collides: true })
    self.layer1.add(self.floorLayer);
    self.nextFloor = mapNight.createStaticLayer('next-floor', tilesetNight).setCollisionByProperty({ collides: true })
    self.layer1.add(self.nextFloor);
    self.objectLayer = mapNight.createStaticLayer('objects', tilesetNight).setCollisionByProperty({ collides: true })
    self.layer1.add(self.objectLayer);
    self.layer1.add(mapNight.createStaticLayer('next-objects', tilesetNight));
    self.wallsLayer = mapNight.createStaticLayer('walls', tilesetNight).setCollisionByProperty({ collides: true })//.renderDebug(debugGraphics, debugConfig);
    self.layer1.add(self.wallsLayer);
    addAnimationForMap(self, mapNight, tilesetNight);

    // fix player position
    //self.playerAddX = 140;
    //self.playerAddY = -700;
}

// add physics when player added to map
export function addPhysicsForMap2(self) {
    self.physics.add.collider(self.player, self.wallsLayer);
    self.physics.add.collider(self.player, self.objectLayer);
    self.physics.add.collider(self.player, self.floorLayer);
    self.physics.add.collider(self.player, self.nextFloor);
}


export function addUpdateForMap2(self) {

}