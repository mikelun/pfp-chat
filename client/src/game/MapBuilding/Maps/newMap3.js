import { sceneEvents } from "../../Events/EventsCenter";
import { connectToOtherMap } from "../../scenes/GameView/connectToMap";
import { addAudioTimer } from "../../utils/addAudioTimer";
import { addIframeGameAndMusicMachine } from "../../utils/addIframeGameAndMusicMachine";
import { addPlayerOverlap, checkOverlap } from "../../utils/playerOverlap";
import { addAnimationForMap } from "../AnimatedTile";
import { buildTile, editTile, saveAllProgress, stopBuilding, updateTilesFromData } from "../editTiles";
import { showMap } from "../showMap";
import { createLight } from "./map4";
import { clearMapWithTransition, startMapTransition } from "./maps-utils";


// main map
var map;

// all lights on map
var lights = [];

// entrances
var entrances = [];
var entranceMapId;


var effects = [];

var spaceKey;

var wallsCollider;

export const addMap3 = addMap;
export const addPhysicsForMap3 = addPhysicsForMap;
export const addUpdateForMap3 = addUpdateForMap;
export const clearMap3 = clearMap;



function addMap(self) {
    spaceKey = false;

    map = self.make.tilemap({ key: 'surf-vibe' });
    // add tileset image
    const cliffsTileset = map.addTilesetImage('Animated_Cliffs', 'Animated_Cliffs', 48, 48, 1, 2);
    const deepwaterTileset = map.addTilesetImage('Animated_Deepwater', 'Animated_Deepwater', 48, 48, 1, 2);
    const shoreTileset = map.addTilesetImage('Animated_Shore', 'Animated_Shore', 48, 48, 1, 2);
    const mainTileset = map.addTilesetImage('MainTileMap', 'MainTileMap', 48, 48, 1, 2);
    const boatsTileset = map.addTilesetImage('Animated_Boats', 'Animated_Boats', 48, 48, 1, 2);
    const pierTileset = map.addTilesetImage('Animated_Pier', 'Animated_Pier', 48, 48, 1, 2);
    const nettingTileset = map.addTilesetImage('Animated_Netting', 'Animated_Netting', 48, 48, 1, 2);

    self.shoreLayer = map.createLayer('Shore', [mainTileset, deepwaterTileset, shoreTileset]).setCollisionByProperty({ collides: true });;
    self.layer1.add(self.shoreLayer);
    self.layer1.add(map.createLayer('objects', [mainTileset, cliffsTileset, nettingTileset, pierTileset]));
    self.layer1.add(map.createLayer('objects-1', [mainTileset, pierTileset]));
    self.layer1.add(map.createLayer('objects-2', [boatsTileset, mainTileset, pierTileset]));
    self.layer1.add(map.createLayer('objects-3', [boatsTileset, mainTileset]));
    self.layer2.add(map.createLayer('walls', mainTileset));
    self.layer2.add(map.createLayer('invisible1', mainTileset));
    self.layer2.add(map.createLayer('invisible2', mainTileset));

    self.invisibleWalls = map.createLayer('invisibleWalls', [mainTileset]).setCollisionByProperty({ collides: true });;
    self.invisibleWalls.setVisible(false);

    addAnimationForMap(self, map, deepwaterTileset);
    addAnimationForMap(self, map, shoreTileset);
    addAnimationForMap(self, map, cliffsTileset);
    addAnimationForMap(self, map, boatsTileset);
    addAnimationForMap(self, map, nettingTileset);
    addAnimationForMap(self, map, pierTileset);

    self.cameras.main.setBounds(0, 0, map.widthInPixels - 600, map.heightInPixels);



    addLightsToMap(self);

    addEntrancesToMap(self);

    startMapTransition(self, [lights, entrances, effects]);

    // if space touched
    self.input.keyboard.on('keydown-SPACE', function (event) {
        if (entranceMapId && !spaceKey) {
            spaceKey = true;
            changeMap(self, { mapId: entranceMapId });
        }
    });
}

// add physics when player added to map
function addPhysicsForMap(self) {
    wallsCollider = self.physics.add.collider(self.player, self.invisibleWalls);
}

function addLightsToMap(self) {
    const warmLight = { r: 255, g: 160, b: 0 };
    const warmItensity = 0.03;
    const warmLightRadius = 150;
    //lights.push(createLight(self, 65, 281, warmLight, warmItensity, warmLightRadius));
}

function addEntrancesToMap(self) {
    //entrances.push({ entrance: self.add.rectangle(1403, 69, 60, 40, 0x00cccc), mapId: 6 });
    //self.layer1.add(entrances[0].entrance);
}

function addUpdateForMap(self, time, delta) {

    // animate entrances
    entrances.forEach(object => {
        object.entrance.alpha = (Math.sin(self.time.now / 500) * 0.4);
        if (self.player) {
            if (checkOverlap(self.player, object.entrance)) {
                entranceMapId = object.mapId;
            } else if (entranceMapId === object.mapId) {
                entranceMapId = null;
            }
        }
    });
}

function clearMap(self) {
    if (wallsCollider) wallsCollider.destroy();

    if (map) map.destroy();

    lights.forEach(light => {
        light.destroy();
    });

    entrances.forEach(entrance => {
        entrance.entrance.destroy();
    });



    lights = [];
    entrances = [];
    self.spaceKey = false;
    effects = [];
}