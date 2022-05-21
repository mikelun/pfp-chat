/**
 * Initialize main tile map
 * @param {Scene} self 
 */
import Phaser from "phaser";
import { AnimatedTile } from "./AnimatedTile";
import { addMap1, addPhysicsForMap1, addUpdateForMap1 } from "./Maps/map1";
import { addMap2, addPhysicsForMap2, addUpdateForMap2 } from "./Maps/map2";
import { addMap3, addPhysicsForMap3, addUpdateForMap3 } from "./Maps/map3";
import { addMap4, addPhysicsForMap4, addUpdateForMap4, clearMap4 } from "./Maps/map4";
import { addMap5, addPhysicsForMap5, addUpdateForMap5 } from "./Maps/map5";
import { addMap6, addPhysicsForMap6, addUpdateForMap6, clearMap6} from "./Maps/map6";
import { addMap7, addPhysicsForMap7, addUpdateForMap7, clearMap7 } from "./Maps/map7";
import { addMap8, addPhysicsForMap8, addUpdateForMap8, clearMap8 } from "./Maps/map8";
import { addMap9, addPhysicsForMap9, addUpdateForMap9, clearMap9 } from "./Maps/map9";
// show map with id
const mapsFunctions = {
    1: [addMap1, addPhysicsForMap1, addUpdateForMap1],
    2: [addMap2, addPhysicsForMap2, addUpdateForMap2],
    3: [addMap3, addPhysicsForMap3, addUpdateForMap3],
    4: [addMap4, addPhysicsForMap4, addUpdateForMap4, clearMap4],
    5: [addMap5, addPhysicsForMap5, addUpdateForMap5],
    6: [addMap6, addPhysicsForMap6, addUpdateForMap6, clearMap6],
    7: [addMap7, addPhysicsForMap7, addUpdateForMap7, clearMap7],
    8: [addMap8, addPhysicsForMap8, addUpdateForMap8, clearMap8],
    9: [addMap9, addPhysicsForMap9, addUpdateForMap9, clearMap9],
}
export function showMap(self, id) {
    mapsFunctions[id][0](self);
}

// add colliders for map (walls and objects)
export function addPhysicsForScene(self, id) {
    mapsFunctions[id][1](self);
}

export function addUpdateForMap(self, id, time, delta) {
    mapsFunctions[id][2](self, time, delta);
}

export function clearMap(self) {
    mapsFunctions[self.mapId][3](self);
}


