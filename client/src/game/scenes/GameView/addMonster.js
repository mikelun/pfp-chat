import { hitMonster } from "../../socketController/mmorpgSocket";
import { bullets } from "../Weapons/weapon";

export function addMonster(self, monstersInfo) {
    const monster = self.add.monster(monstersInfo.x, monstersInfo.y, monstersInfo.textureId, monstersInfo.hp);
    monster.id = monstersInfo.id;

    // if monster interact with bullets destroy bullets
    self.physics.add.overlap(monster, bullets, (monster, bullet) => {
        hitMonster(monster.id);
        bullet.destroy();
    });
    
    return monster;
}