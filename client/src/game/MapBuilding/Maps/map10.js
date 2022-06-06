import { sceneEvents } from "../../Events/EventsCenter";
import { changedMap } from "../../scenes/GameUI-elements/musicLogic";
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

export const addMap10 = addMap;
export const addPhysicsForMap10 = addPhysicsForMap;
export const addUpdateForMap10 = addUpdateForMap;
export const clearMap10 = clearMap;



function addMap(self) {
    spaceKey = false;

    map = self.make.tilemap({ key: '10' });
    
    const tileset1 = map.addTilesetImage('TilemapDay', 'tiles'); 


    // Create layers and collides for physics
    self.layer1.add(map.createStaticLayer('1', tileset1));
    self.layer1.add(map.createStaticLayer('2', tileset1));
    self.layer1.add(map.createStaticLayer('3', tileset1));
    self.layer1.add(map.createStaticLayer('4', tileset1));

    self.invisibleWalls = map.createLayer('invisibleWalls', tileset1).setCollisionByProperty({ collides: true });;
    self.invisibleWalls.setVisible(false);



    addLightsToMap(self);
 
    addEntrancesToMap(self);

    startMapTransition(self, [lights, entrances, effects]);

    // if space touched
    self.input.keyboard.on('keydown-SPACE', function (event) {
        if (entranceMapId && !spaceKey) {
            spaceKey = true;
            changedMap(self, {mapId: entranceMapId});
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
    lights.push(createLight(self, 65, 281, warmLight, warmItensity, warmLightRadius));
    lights.push(createLight(self, 148, 217, warmLight, warmItensity, warmLightRadius));
    lights.push(createLight(self, 248, 153, warmLight, warmItensity, warmLightRadius));
    lights.push(createLight(self, 333, 153, warmLight, warmItensity, warmLightRadius));
    lights.push(createLight(self, 396, 153, warmLight, warmItensity, warmLightRadius));
    lights.push(createLight(self, 466, 153, warmLight, warmItensity, warmLightRadius));
    lights.push(createLight(self, 543, 153, warmLight, warmItensity, warmLightRadius));
    lights.push(createLight(self, 657, 217, warmLight, warmItensity, warmLightRadius));
    lights.push(createLight(self, 640, 281, warmLight, warmItensity, warmLightRadius));
}

function addEntrancesToMap(self) {
    entrances.push({ entrance: self.add.rectangle(1403, 69, 60, 40, 0x00cccc), mapId: 6 });
    self.layer1.add(entrances[0].entrance);
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