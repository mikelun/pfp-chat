
var tileHasBuilt = false;

var index, stop, building;

var previousTileIndex;
var previousTile;

var redRectangle;

var map;

var changedTiles = [];
export function editTile(self, newMap, data) {
    building = data.building;
    map = newMap;
    stopBuilding();

    stop = false;

    if (building) {
        if (index) {
            index = data.index + 1;
            return;
        }
        index = data.index + 1;
    }



    self.input.on('pointermove', function () {
        if (stop) return;
        if (building) {
            buildModePointerMove(self);
        } else {
            removeModePointerMove(self);
        }

    });

    self.input.on('pointerdown', function (pointer) {
        if (stop) return;
        if (building) {
            buildModePointerDown();
        } else {
            removeModePointerDown();
        }
    });
}

function buildModePointerMove(self, map) {
    let tile = getTile(self, map);

    if (!tile) return;

    ifPlayerMovePointer(tile);

    if (!previousTile) {
        previousTileIndex = tile.index;
        previousTile = tile;
    }

    tile.index = index;
    tile.alpha = 0.5;
}

function buildModePointerDown() {
    if (!previousTile) return;
    stop = true;
    changedTiles.push({
        x: previousTile.x,
        y: previousTile.y,
        index: previousTileIndex
    });
    previousTile.index = index;
    previousTile.alpha = 1;
    previousTile = null;
}

function removeModePointerMove(self, map) {
    const tilePosition = getTilePosition(self, map);

    var tileExist;
    changedTiles.forEach(tile => {
        if (tile.x == tilePosition.x && tile.y == tilePosition.y) {
            // add red rectangle to tile
            tileExist = true;
            if (previousTile && (previousTile.x != tile.x || previousTile.y != tile.y)) {
                redRectangle.destroy();
                redRectangle = self.add.rectangle(map.tileToWorldX(tile.x), map.tileToWorldY(tile.y), map.tileWidth, map.tileHeight, 0xFF0000).setAlpha(0.2).setOrigin(0, 0);
                previousTile = map.getTileAt(tilePosition.x, tilePosition.y, true, '3');
            }
            if (!previousTile) {
                previousTile = map.getTileAt(tilePosition.x, tilePosition.y, true, '3');
                redRectangle = self.add.rectangle(map.tileToWorldX(tile.x), map.tileToWorldY(tile.y), map.tileWidth, map.tileHeight, 0xFF0000).setAlpha(0.2).setOrigin(0, 0);
            }
        }
    });

    if (!tileExist) {
        if (redRectangle) redRectangle.destroy();
        previousTile = null;
    }
}

function removeModePointerDown() {
    if (!previousTile) return;

    changedTiles = changedTiles.filter(tile => {
        return tile.x != previousTile.x || tile.y != previousTile.y;
    });

    previousTile.index = -1;
    previousTile = null;

    redRectangle.destroy();

}

function getTilePosition(self, map) {
    let pointerPosition = self.input.activePointer.positionToCamera(self.cameras.main);
    let tilePosition = map.worldToTileXY(pointerPosition.x, pointerPosition.y);
    return tilePosition;
}
function getTile(self, map) {

    const tilePosition = getTilePosition(self, map);

    let floorTile = map.getTileAt(tilePosition.x, tilePosition.y, true, '1');
    if (!floorTile || floorTile.index == -1) return;

    const tile = map.getTileAt(tilePosition.x, tilePosition.y, true, '3');
    if (tile.index != -1) return;

    return tile;
}

function ifPlayerMovePointer(tile) {
    if (previousTile && (previousTile.x != tile.x || previousTile.y != tile.y)) {
        previousTile.index = previousTileIndex;
        previousTile.alpha = 1;
        previousTileIndex = tile.index;
        previousTile = tile;
    }
}

export function stopBuilding() {
    if (previousTile) {
        previousTile.index = previousTileIndex;
        previousTile.alpha = 1;
        stop = true;
        previousTile = null;
    }
}