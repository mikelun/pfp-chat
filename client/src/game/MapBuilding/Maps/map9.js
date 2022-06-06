import { sceneEvents } from "../../Events/EventsCenter";
import { addPlayerOverlap, checkOverlap } from "../../utils/playerOverlap";
import { editTile, saveAllProgress, updateTilesFromData } from "../editTiles";
import { startMapTransition } from "./maps-utils";


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
export const addMap9= addMap;
export const addPhysicsForMap9 = addPhysicsForMap;
export const addUpdateForMap9 = addUpdateForMap;
export const clearMap9 = clearMap;



function addMap(self) {
    spaceKey = false;

    map = self.make.tilemap({ key: '9' });
    
    const tileset1 = map.addTilesetImage('TilemapDay', 'tiles'); 

    const tileset2 = map.addTilesetImage('Interior', 'Interior');

    // Create layers and collides for physics
    self.layer1.add(map.createStaticLayer('1', [tileset1, tileset2]));
    self.layer1.add(map.createStaticLayer('2', [tileset1, tileset2]));
    self.layer1.add(map.createStaticLayer('3', [tileset1, tileset2]));

    self.invisibleWalls = map.createLayer('invisibleWalls', tileset2).setCollisionByProperty({ collides: true });;
    self.invisibleWalls.setVisible(false);



    addLightsToMap(self);
 
    addEntrancesToMap(self);

    startMapTransition(self, [lights, entrances, effects]);

    // if space touched
    self.input.keyboard.on('keydown-SPACE', function (event) {
        if (entranceMapId && !spaceKey) {
            spaceKey = true;
            changeMap(self, {mapId: entranceMapId});
        }
    });


    sceneEvents.on('start-build', (index) => {
        editTile(self, map, {building: true, index: index});
    });

    sceneEvents.on('start-remove', () => {
        editTile(self, map, {building: false});
    })
    sceneEvents.on('stop-building', () => {
        saveAllProgress(self);
    });

    if (self.changedTiles && self.isHome) {
        updateTilesFromData(self, map, self.changedTiles);
    }

    sceneEvents.on('update-tiles-from-data', (changedTiles) => {
        if (!self.isHome) return;
        self.changedTiles = changedTiles;
        updateTilesFromData(self, map, changedTiles);
    })

}

// add physics when player added to map
function addPhysicsForMap(self) {
    wallsCollider = self.physics.add.collider(self.player, self.invisibleWalls);
}

function addLightsToMap(self) {

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

    // if
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