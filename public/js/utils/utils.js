/**
 * Initialize main tile map
 * @param {Scene} self 
 */
export function initMainMap(self) {
    const dungeon = self.make.tilemap({ key: 'dungeon' });
    const tileset = dungeon.addTilesetImage('indoors', 'tiles');
    dungeon.createStaticLayer('background', tileset);
    dungeon.createStaticLayer('structure', tileset);
}
