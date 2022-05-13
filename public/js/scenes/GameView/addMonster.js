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
    

    // // add animation for monster
    // self.anims.create({
    //     key: 'monster1-fly',
    //     frames: self.anims.generateFrameNumbers('monster1', { start: 0, end: 4 }),
    //     frameRate: 10,
    //     repeat: -1
    // });
    // monster.play('monster1-fly');
    return monster;
}