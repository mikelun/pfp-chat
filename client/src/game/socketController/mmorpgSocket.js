import { playExplosionSound, playShotSound } from "../scenes/Audio/soundFXMachine";
import { updatePlayerCoins } from "../scenes/GameUI-elements/hud";
import { addMonster } from "../scenes/GameView/addMonster";
import { createCoin } from "../scenes/GameView/createCoin";
import { getWeaponFromUI } from "../scenes/GameView/playerUI";
import { createBullet } from "../scenes/Weapons/bullet";
import { bullets, changeWeapon } from "../scenes/Weapons/weapon";

var monstersList = {};

var coinsList = {};

var self;

export function initializeRPGSocket(newSelf) {
    self = newSelf;

    self.socket.on('updateMonsters', monsters => {
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
                playExplosionSound(self, monstersList[monsterId].texture.key);
                monstersList[monsterId].destroyMonster(monstersList[monsterId]);
                delete monstersList[monsterId];
            } else {
                monstersList[monsterId].alive = false;
            }
        });
    });

    // WHEN OTHER PLAYER SHOT
    self.socket.on('weaponShot', (data) => {
        createBullet(self, data.weaponId, data.x, data.y, true, data.angle);
        const weapon =  getWeaponFromUI(self.playerUI.second[data.playerId]);

        playShotSound(self, weapon.texture.key);
        weapon.rotation = data.angle;
        if (data.angle < -Math.PI / 2 || data.angle > Math.PI / 2) {
            weapon.flipY = true;
        } else {
            weapon.flipY = false;
        }
    });

    self.socket.on('updateRewardCoins', (coins) => {
        Object.keys(coins).forEach(coinId => {
            const coinData = coins[coinId];

            if (!coinsList[coinId]) {
                createCoin(self, coinData, coinsList, coinId);
            } 
        })
        
        Object.keys(coinsList).forEach(coinId => {  
            console.log('coinId', coinId);    
            if (!coins[coinId]) {
                // TRYING TO CLEAR
                console.log('TRYING TO REMOVE COIN   aksjdjflk j', coinId);
                coinsList[coinId].clear(true);
                delete coinsList[coinId];
            }
        });
    });

    self.socket.on('updatePlayerCoins', (coins) => {
        updatePlayerCoins(coins);
    });

    self.socket.on('changeWeapon', (weapon) => {
        changeWeapon(weapon);
    });

}

export function hitMonster(monsterId) {
    self.socket.emit('hitMonster', monsterId);
}

export function weaponShot(data) {
    self.socket.emit('weaponShot', data);
}


export function removeAllMonsters() {

    Object.keys(monstersList).forEach(monsterId => {
        monstersList[monsterId].setVisible(false);
        monstersList[monsterId].destroyWithoutAnimation(monstersList[monsterId]);
        delete monstersList[monsterId];
    });
    monstersList = {};

    // remove bullets
    if (bullets) bullets.getChildren().forEach(bullet => {
        bullet.setAlpha(0);
    });

    Object.keys(coinsList).forEach(coinId => {
        coinsList[coinId].clear(true);
        delete coinsList[coinId];
    });
}