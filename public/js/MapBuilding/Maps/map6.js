import { object } from "sharp/lib/is";
import { connectToOtherMap } from "../../scenes/GameView/connectToMap";
import { disconnectPlayer } from "../../scenes/GameView/disconnectPlayer";
import { addAudioTimer } from "../../utils/addAudioTimer";
import { addIframeGameAndMusicMachine } from "../../utils/addIframeGameAndMusicMachine";
import { addPlayerOverlap, checkOverlap } from "../../utils/playerOverlap";
import { addAnimationForMap } from "../AnimatedTile";
import { showMap } from "../showMap";
import { createLight } from "./map4";
import { clearMapWithTransition, startMapTransition } from "./maps-utils";

// lights for map
var redLights = [];
var blueLights = [];
var warmLights = [];

// var entrances
var entrances = [];
var entranceMapId;

var coffeebar;

// Add map with id 
export function addMap6(self) {
    coffeebar = self.make.tilemap({ key: 'coffeebar-map' });

    const tileset1 = coffeebar.addTilesetImage('Low-TownA5', 'Low-TownA5');
    const tileset2 = coffeebar.addTilesetImage('Low-TownB', 'Low-TownB');
    const tileset3 = coffeebar.addTilesetImage('Low-TownC', 'Low-TownC');
    const tileset4 = coffeebar.addTilesetImage('Low-TownD', 'Low-TownD');
    const tileset5 = coffeebar.addTilesetImage('Mid-TownA5', 'Mid-TownA5');
    const tileset6 = coffeebar.addTilesetImage('Mid-TownD', 'Mid-TownD');

    // Create layers
    self.layer1.add(coffeebar.createStaticLayer('floor', [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6]));
    self.layer1.add(coffeebar.createStaticLayer('objects-1', [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6]));
    self.layer1.add(coffeebar.createStaticLayer('objects-2', [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6]));
    self.layer2.add(coffeebar.createStaticLayer('back-1', [tileset1, tileset2, tileset3, tileset4, tileset5, tileset6]));
    self.invisibleWalls = self.layer1.add(coffeebar.createStaticLayer('invisibleWalls', [tileset2])).setCollisionByProperty({ collides: true });;
    self.invisibleWalls.setVisible(false);

    self.cameras.main.setBounds(0, 0, coffeebar.widthInPixels, coffeebar.heightInPixels);

    addLightsToMap(self);

    addEntrances(self);

    startMapTransition(self);
}

// add physics when player added to map
export function addPhysicsForMap6(self) {
    self.wallsCollider = self.physics.add.collider(self.player, self.invisibleWalls, () => {
        if (!self.spaceKey) {
            self.spaceKey = true;
            // only follow this way I can remove wallsCollider (BUG WITH PHASER)    
            self.input.keyboard.on('keydown-SPACE', function (event) {
                if (entranceMapId) {
                    self.newMap = entranceMapId;
                    self.input.keyboard.off('keydown-SPACE');
                    self.wallsCollider.destroy();
                    clearMapWithTransition(self, clearMap6);
                }
            });

        }
    });


}

export function addUpdateForMap6(self) {
    redLights.forEach(light => {
        light.alpha = (Math.sin(self.time.now / 500) * 0.5 + 0.3);
    });

    entrances.forEach(object => {
        object.entrance.alpha = (Math.sin(self.time.now / 500) * 0.3);
        if (self.player) {
            if (checkOverlap(self.player, object.entrance)) {
                entranceMapId = object.mapId;
            } else if (entranceMapId === object.mapId) {
                entranceMapId = null;
            }
        }
    });

    // if player overlaps entrance

}



function addLightsToMap(self) {

    const redLightColor = { r: 255, g: 0, b: 0 };
    const redLightItensity = 0.1;
    const redLightRadius = 100;
    redLights.push(createLight(self, 677, 853, redLightColor, redLightItensity, redLightRadius));

    redLights.push(createLight(self, 1081, 880, redLightColor, redLightItensity, redLightRadius));
    redLights.push(createLight(self, 1383, 880, redLightColor, redLightItensity, redLightRadius));

    redLights.push(createLight(self, 1113, 1260, redLightColor, redLightItensity, redLightRadius));
    redLights.push(createLight(self, 1350, 1260, redLightColor, redLightItensity, redLightRadius));

    redLights.push(createLight(self, 218, 850, redLightColor, redLightItensity, redLightRadius));
    redLights.push(createLight(self, 678, 1253, redLightColor, redLightItensity, redLightRadius));

    redLights.push(createLight(self, 565, 430, redLightColor, redLightItensity, redLightRadius));
    redLights.push(createLight(self, 565, 340, redLightColor, redLightItensity, redLightRadius));
    redLights.push(createLight(self, 405, 430 - 32, redLightColor, redLightItensity, redLightRadius));
    redLights.push(createLight(self, 405, 340 - 32, redLightColor, redLightItensity, redLightRadius));
    redLights.push(createLight(self, 256, 430 - 32 * 2, redLightColor, redLightItensity, redLightRadius));
    redLights.push(createLight(self, 256, 340 - 32 * 2, redLightColor, redLightItensity, redLightRadius));
    redLights.push(createLight(self, 78, 430 - 32 * 3, redLightColor, redLightItensity, redLightRadius));
    redLights.push(createLight(self, 78, 340 - 32 * 3, redLightColor, redLightItensity, redLightRadius));

    redLights.push(createLight(self, 1030, 430, redLightColor, redLightItensity, redLightRadius));
    redLights.push(createLight(self, 1030, 340, redLightColor, redLightItensity, redLightRadius));
    redLights.push(createLight(self, 1183, 430 - 32, redLightColor, redLightItensity, redLightRadius));
    redLights.push(createLight(self, 1183, 340 - 32, redLightColor, redLightItensity, redLightRadius));
    redLights.push(createLight(self, 1352, 430 - 32 * 2, redLightColor, redLightItensity, redLightRadius));
    redLights.push(createLight(self, 1352, 340 - 32 * 2, redLightColor, redLightItensity, redLightRadius));
    redLights.push(createLight(self, 1510, 430 - 32 * 3, redLightColor, redLightItensity, redLightRadius));
    redLights.push(createLight(self, 1510, 340 - 32 * 3, redLightColor, redLightItensity, redLightRadius));


    const blueLightColor = { r: 0, g: 0, b: 230 };
    blueLights.push(createLight(self, 720, 350, blueLightColor, 0.2, 200));
    blueLights.push(createLight(self, 881, 350, blueLightColor, 0.2, 200));
    blueLights.push(createLight(self, 591, 900, blueLightColor, 0.15, 200));

    const warmLightColor = { r: 255, g: 160, b: 0 };
    warmLights.push(createLight(self, 961, 802, warmLightColor, 0.1, 150));

    redLights.forEach(light => {
        self.layer1.add(light);
    });
    blueLights.forEach(light => {
        self.layer1.add(light);
    });
    warmLights.forEach(light => {
        self.layer1.add(light);
    });
    
}

function addEntrances(self) {
    entrances.push({ entrance: createBackgroundEntrance(self, 800, 480, 190, 60), mapId: 4 });
    entrances.forEach(entrance => {
        self.layer1.add(entrance.entrance);
    });
}

function createBackgroundEntrance(self, x, y, width, height) {
    const entranceColor = 0x00cccc;
    const entrance = self.add.rectangle(x, y, width, height, entranceColor).setAlpha(0.5);
    self.layer1.add(entrance);
    return entrance;
}


export function clearMap6(self) {
    coffeebar.destroy();
    redLights.forEach(light => {
        light.destroy();
    });
    blueLights.forEach(light => {
        light.destroy();
    });
    warmLights.forEach(light => {
        light.destroy();
    });
    entrances.forEach(entrance => {
        entrance.entrance.destroy();
    });
    entrances = [];
    redLights = [];
    blueLights = [];
    warmLights = [];
    self.spaceKey = false;

    // start new map
    connectToOtherMap(self);

}
