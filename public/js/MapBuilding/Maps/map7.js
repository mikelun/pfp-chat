import { changeMap } from "../../scenes/GameView/changeMap";
import { connectToOtherMap } from "../../scenes/GameView/connectToMap";
import { addAudioTimer } from "../../utils/addAudioTimer";
import { addIframeGameAndMusicMachine } from "../../utils/addIframeGameAndMusicMachine";
import { addPlayerOverlap, checkOverlap } from "../../utils/playerOverlap";
import { addAnimationForMap } from "../AnimatedTile";
import { showMap } from "../showMap";
import { clearMapWithTransition, startMapTransition } from "./maps-utils";


// main map
var map;

// all lights on map
var lights = [];

// entrances
var entrances = [];
var entranceMapId;


var effects = [];

var wallsCollider;
var spaceKey;

export const addMap7 = addMap;
export const addUpdateForMap7 = addUpdateForMap;
export const addPhysicsForMap7 = addPhysicsForMap;
export const clearMap7 = clearMap;


function addMap(self) {
    spaceKey = false;
    
    map = self.make.tilemap({ key: '7' });
    
    const tileset1 = map.addTilesetImage('Mid-TownA5', 'Mid-TownA5');
    const tileset2 = map.addTilesetImage('Mid-TownC', 'Mid-TownC');

    // Create layers and collides for physics
    self.layer1.add(map.createStaticLayer('floor', [tileset1, tileset2]));
    self.layer1.add(map.createStaticLayer('objects', [tileset1, tileset2]));
    self.layer1.add(map.createStaticLayer('objects-1', [tileset1, tileset2]));
    self.layer1.add(map.createStaticLayer('objects-2', [tileset1, tileset2]));

    self.invisibleWalls = map.createLayer('invisibleWalls', tileset1).setCollisionByProperty({ collides: true });;
    self.invisibleWalls.setVisible(false);


    self.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    addLightsToMap(self);
 
    addEntrancesToMap(self);

    startMapTransition(self, [lights, entrances, effects]);
    
    // if space touched
    self.input.keyboard.on('keydown-SPACE', function (event) {
        if (entranceMapId && !spaceKey) {
            spaceKey = true;
            changeMap(self, entranceMapId);
        }
    });
}

// add physics when player added to map
function addPhysicsForMap(self) {
    wallsCollider = self.physics.add.collider(self.player, self.invisibleWalls);
}

function addLightsToMap(self) {

}

function addEntrancesToMap(self) {
    entrances.push({ entrance: self.add.rectangle(1410, 73, 50, 40, 0x00cccc), mapId: 6 });
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
                spaceKey = false;
            }
        }
    });
}

function clearMap(self) {

    wallsCollider.destroy();
    map.destroy();
    
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