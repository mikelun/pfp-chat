/**
 * Initialize main tile map
 * @param {Scene} self 
 */
import Phaser from "phaser";
import { AnimatedTile } from "./AnimatedTile";
import { addMap1, addPhysicsForMap1, addUpdateForMap1 } from "./Maps/map1";
import { addMap2, addPhysicsForMap2, addUpdateForMap2 } from "./Maps/map2";
import { addMap3, addPhysicsForMap3, addUpdateForMap3 } from "./Maps/map3";

// show map with id
export function showMap(self, id) {
    if (id == 1) {
        addMap1(self);
    } else if (id == 2) {
        addMap2(self);
    } else if (id == 3) {
        addMap3(self);
    }
}

// add colliders for map (walls and objects)
export function addPhysicsForScene(self, id) {
    if (id == 1) {
        addPhysicsForMap1(self);
    } else if (id == 2) {
        addPhysicsForMap2(self);
    } else if (id == 3) {
        addPhysicsForMap3(self);
    }
}

export function addUpdateForMap(self, id) {
    if (id == 1) {
        addUpdateForMap1(self);
    } else if (id == 2) {
        addUpdateForMap2(self);
    } else if (id == 3) {
        addUpdateForMap3(self);
    }
}