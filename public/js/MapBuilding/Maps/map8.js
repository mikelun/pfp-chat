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

var leaderboardGroup;

var effects = [];

var self;

var sizer;

var wallsCollider;
var spaceKey;

export const addMap8 = addMap;
export const addPhysicsForMap8 = addPhysicsForMap;
export const addUpdateForMap8 = addUpdateForMap;
export const clearMap8 = clearMap;


function addMap(self) {
    spaceKey = false;
    
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
    wallsCollider = self.physics.add.collider(self.player, self.invisibleWalls);
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
                spaceKey = false;
            }
        }
    });

     // player touch space key
     if (self.input.keyboard.addKey('SPACE').isDown) {
        if (entranceMapId && !spaceKey) {
            spaceKey = true;
            changeMap(self, entranceMapId);
        }
    }
}

function addLeaderboard(newSelf) {
    self = newSelf;
    sizer = self.rexUI.add.sizer({
        x: 1000, y: 600,
        backround: self.rexUI.add.roundRectangle(0, 0, 200, 100, 20, 0x0033333),
        orientation: 'y',
        align: 'left',
        space: {
        }
    });

    // add before self.player
    self.layer1.add(sizer);
}

export function updateLeaderboard(data) {
    sizer.removeAll(true);
    // add new items to sizer
    const addLabel = function (text) {
        const label = self.rexUI.add.label({
            align: 'center',
            width: 150, height: 10,
            background: self.rexUI.add.roundRectangle(0, 0, 150, 10, 10, 0x333333).setStrokeStyle(2, 0xfffff),
            text: self.add.text(0, 0, text, {
                fontSize: '16px',
                fontFamily: 'PixelFont',
                fill: "#ffffff",
                align: 'center'

            }),

            space: {
                bottom: 5,
            },
            // icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 14, COLOR_PRIMARY),
        });
        sizer.add(label);
        self.layer2.add(label);
        sizer.layout();
    }

    addLabel("Leaderboard");
    for (let i = 0; i < Math.min(data.length, 5); i++) {
        var name = data[i].id;
        if (name.length > 10) {
            name = name.substring(0, 10) + "...";
        }
        addLabel(name + ": " + data[i].killed_monsters);
    }

}

function clearMap(self) {
    wallsCollider.destroy();
    map.destroy();

    sizer.destroy();

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