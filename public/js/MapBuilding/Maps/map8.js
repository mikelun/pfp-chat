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

var leaderboardGroup;

var effects = [];

export const addMap8 = addMap;
export const addPhysicsForMap8 = addPhysicsForMap;
export const addUpdateForMap8 = addUpdateForMap;


function addMap(self) {
    map = self.make.tilemap({ key: '8' });
    
    const tileset1 = map.addTilesetImage('Low-TownA5', 'Low-TownA5');
    const tileset2 = map.addTilesetImage('Low-TownD', 'Low-TownD');

    // Create layers and collides for physics
    self.layer1.add(map.createStaticLayer('floor', [tileset1, tileset2]));
    self.layer1.add(map.createStaticLayer('objects-1', [tileset1, tileset2]));

    self.invisibleWalls = map.createLayer('invisibleWalls', tileset2).setCollisionByProperty({ collides: true });;
    self.invisibleWalls.setVisible(false);

    self.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);


    addLightsToMap(self);
 
    addEntrancesToMap(self);

    startMapTransition(self, [lights, entrances, effects]);

    addLeaderboard(self);
}

// add physics when player added to map
function addPhysicsForMap(self) {
    self.wallsCollider = self.physics.add.collider(self.player, self.invisibleWalls, () => {
        if (!self.spaceKey) {
            self.spaceKey = true;
            // only follow this way I can remove wallsCollider (BUG WITH PHASER)    
            self.input.keyboard.on('keydown-SPACE', function (event) {
                if (entranceMapId) {
                    self.newMap = entranceMapId;
                    self.input.keyboard.off('keydown-SPACE');
                    
                    self.wallsCollider.destroy();
                    
                    clearMapWithTransition(self, clearMap);
                }
            });

        }
    });
}

function addLightsToMap(self) {

}

function addEntrancesToMap(self) {
    entrances.push({ entrance: self.add.rectangle(816, 680 - 3, 35, 55, 0x00cccc), mapId: 6 });
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

function addLeaderboard(self) {
    //const backgroundLeaderboard = self.add.rectangle(1000, 615, 200, 100, 0x000000);
    //self.layer1.add(backgroundLeaderboard);
}

function clearMap(self) {
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


    // start new map
    connectToOtherMap(self);
}