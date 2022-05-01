import { addAudioTimer } from "../../utils/addAudioTimer";
import { addIframeGameAndMusicMachine } from "../../utils/addIframeGameAndMusicMachine";
import { addPlayerOverlap } from "../../utils/playerOverlap";
import { addAnimationForMap } from "../AnimatedTile";

export function addMap4(self) {
    const cafe = self.make.tilemap({ key: 'cafe' });
    const tilemapDayTileset = cafe.addTilesetImage('TilemapDay', 'tiles');
    const bakeryTileset = cafe.addTilesetImage('Bakery', 'Bakery');
    const interiorTileset = cafe.addTilesetImage('Interior', 'Interior');
    const deepwaterTileset = cafe.addTilesetImage('Animated_Deepwater', 'Animated_Deepwater', 48, 48, 1, 2);

    // Create layers and collides for physics
    self.layer1.add(cafe.createStaticLayer('floor', [tilemapDayTileset, bakeryTileset, interiorTileset, deepwaterTileset]));
    self.layer1.add(cafe.createStaticLayer('objects', [tilemapDayTileset, bakeryTileset, interiorTileset]));
    self.layer1.add(cafe.createStaticLayer('objects-2', [tilemapDayTileset, bakeryTileset, interiorTileset]));
    self.layer1.add(cafe.createStaticLayer('objects-3', [bakeryTileset, tilemapDayTileset]));
    self.layer1.add(cafe.createStaticLayer('walls', bakeryTileset));
    self.layer1.add(cafe.createStaticLayer('walls-2', bakeryTileset));
    
    self.invisibleWalls = cafe.createLayer('invisibleWalls', interiorTileset).setCollisionByProperty({ collides: true });;
    self.invisibleWalls.setVisible(false);
    

    // add animation for tileset day
    addAnimationForMap(self, cafe, tilemapDayTileset);


    // fix player position
    //self.playerAddX = 0;
    //self.playerAddY = 0;
    self.add.rectangle(0, 0, 10000, 100000, 0x000000, 0.3);

    addLightsToMap(self);

    addEffect(self, 670 , 1115, 'fire-effect');
    addEffect(self, 800 , 1115, 'fire-effect');
    addEffect(self, 925 , 1115, 'fire-effect');

    self.layer1.add(self.add.text(320, 1443, 'caffeinum.', { fontSize: '26px', fill: '#ffffff', fontFamily: 'PixelFont' }).setAlpha(1));

}

function addEffect(self, x, y, name) {
    let effect = self.add.sprite(x, y, name);
    // add animation for effect
    self.anims.create({
        key: name,
        frames: self.anims.generateFrameNumbers(name, { start: 0, end: 60 }),
        frameRate: 30,
        repeat: -1
    });
    effect.play(name);

}
function addLightsToMap(self) {
    const warmLight = {r: 255, g: 160, b: 0};
    createLight(self, 700, 430, warmLight);
    createLight(self, 800, 430, warmLight);
    createLight(self, 900, 430, warmLight);
    

    const purpleLightColor = {r:102, g: 0, b: 153};
    const blueLightColor = {r: 0, g: 0, b: 230};
    const orangeLightColor = {r: 255, g: 40, b: 0};
    createLight(self, 623, 602 + 50, blueLightColor, 0.1, 200);
    createLight(self, 746, 602, orangeLightColor, 0.05, 200);
    createLight(self, 875, 602, blueLightColor, 0.1, 200);
    createLight(self, 1007, 602 + 50, warmLight, 0.05, 200);

    createLight(self, 622, 892 - 50, warmLight, 0.05, 200);
    createLight(self, 746, 892, blueLightColor, 0.1, 200);
    createLight(self, 885, 892, orangeLightColor, 0.05, 200);
    createLight(self, 1000, 892 - 50, blueLightColor, 0.1, 200);

    // lights for computers
    self.computerLight1 = createLight(self, 1059, 1123, blueLightColor);
    self.computeLight2 = createLight(self, 1059, 1203, purpleLightColor);

    self.blueLight = createLight(self, 400, 860, purpleLightColor, 0.1);
    self.purpleLight = createLight(self, 650, 860, blueLightColor, 0.1);

    // lights for fire
    createLight(self, 670, 1124, orangeLightColor, 0.05, 200);
    createLight(self, 793, 1124, orangeLightColor, 0.05, 200);
    createLight(self, 923, 1124, orangeLightColor, 0.05, 200);


    const cafeLightColor = {r: 204, g: 204, b: 204};
    // lights for the first cafe
    createLight(self, 340, 1007, warmLight, 0.05);
    createLight(self, 416, 1189, warmLight, 0.02);
    createLight(self, 264, 1191, warmLight, 0.02);

    createLight(self, 418, 1281, warmLight, 0.05);

    createLight(self, 436, 1452, warmLight, 0.02);
    createLight(self, 307, 1452, warmLight, 0.02);

    createLight(self, 562, 1452, warmLight, 0.02);
    //createLight(self, 239, 1178, cafeLightColor, 0.02);
}
function createLight(self, x, y, color, intensity = 0.05, radius = 200) {
    let light = self.add.pointlight(x, y, 40, radius, intensity);

    light.color.setTo(color.r, color.g, color.b);

    return light;
}
// add physics when player added to map
export function addPhysicsForMap4(self) {
    self.physics.add.collider(self.player, self.invisibleWalls);
}

function addObjectForMap(self) {
   
}

export function addUpdateForMap4(self, time, delta) {

    // // animate blue light
    self.blueLight.x = 802 - Math.cos(time / 1000) * 100;
    self.blueLight.y = 703 - Math.sin(time / 1000) * 100;

    // animate purple light
    self.purpleLight.x = 802 + Math.cos(time / 1000) * 100;
    self.purpleLight.y = 703 + Math.sin(time / 1000) * 100;

    // add ficker to computer light
    self.computerLight1.intensity = 0.1 + Math.sin(time / 150) * 0.03;
    self.computeLight2.intensity = 0.1 + Math.sin(time / 150) * 0.03;

}