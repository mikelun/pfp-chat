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

export const addMap9= addMap;
export const addPhysicsForMap9 = addPhysicsForMap;
export const addUpdateForMap9 = addUpdateForMap;


function addMap(self) {
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

    var previousTileIndex;
    var previousTile;
    var redRectangle;

    self.input.on('pointermove', function (pointer) {
        let pointerPosition = self.input.activePointer.positionToCamera(self.cameras.main);
        let tilePosition = map.worldToTileXY(pointerPosition.x, pointerPosition.y);
        
        let tile = map.getTileAt(tilePosition.x, tilePosition.y, true, '3');

        if (redRectangle) redRectangle.destroy();
        if (tile.index == -1) {
            redRectangle = self.add.rectangle(tile.pixelX, tile.pixelY, tile.width, tile.height, 0xFF0000).setAlpha(0.1).setOrigin(0, 0);
        if (previousTile && (previousTile.x !=  tilePosition.x || previousTile.y !=  tilePosition.y)) {
            previousTile.index = previousTileIndex;
            previousTile.alpha = 1;
            if (redRectangle) redRectangle.destroy();

            previousTileIndex = tile.index;
            previousTile = tile;
        }
       
        if (!previousTile) {
            previousTileIndex = tile.index;
            previousTile = tile;
        }

        tile.index = 2050;

        // set alpha for this tile
        tile.alpha = 0.5;
    }
    });
    
    self.input.on('pointerdown', function (pointer) {
        previousTile.index = 2050;
        previousTile.alpha = 1;
        previousTile = null;
    });
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
    map.destroy();
    
    lights.forEach(light => {
        light.destroy();
    });
    
    entrances.forEach(entrance => {
        entrance.entrance.destroy();
    }); 

    blackoutRectangle.destroy();
    
    self.caffeinumText.destroy();

    lights = [];
    entrances = [];
    self.spaceKey = false;
    effects = [];


    // start new map
    connectToOtherMap(self);
}