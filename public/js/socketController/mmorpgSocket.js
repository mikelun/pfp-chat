import { addMonster } from "../scenes/GameView/addMonster";

var monstersList = {};

var self;

export function initializeRPGSocket(newSelf) {
    self = newSelf;

    self.socket.on('currentMonsters', monsters => {

    });

    self.socket.on('updateMonsters', monsters => {
        console.log("HERE");
        Object.keys(monsters).forEach(monsterId => {
            const monster = monsters[monsterId];
            if (!monstersList[monster.id]) {
                console.log(monster);
                monstersList[monster.id] = addMonster(self, monster);
                
            } else {
                monstersList[monster.id].update(monster.x, monster.y, monster.hp);
            }
            monstersList[monster.id].alive = true;
        })
        // remove dead monsters
        Object.keys(monstersList).forEach(monsterId => {
            if (!monstersList[monsterId].alive) {
                monstersList[monsterId].destroyMonster(monstersList[monsterId]);
                delete monstersList[monsterId];
            } else {
                monstersList[monsterId].alive = false;
            }
        });
    });

}

export function hitMonster(monsterId) {
    self.socket.emit('hitMonster', monsterId);
}

export function removeAllMonsters() {
    Object.keys(monstersList).forEach(monsterId => {
        monstersList[monsterId].destroyMonster(monstersList[monsterId]);
        delete monstersList[monsterId];
    });
}