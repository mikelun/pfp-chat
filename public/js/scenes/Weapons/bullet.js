import { bullets } from "./weapon";


const bulletEffects = [bullet0];
export function createBullet(self, weaponId, x, y, velocityX, velocityY, fromOtherPlayer = false) {
    const bullet = bulletEffects[weaponId](x, y);

    // add velocity from player to weapon
    self.physics.add.existing(bullet);
    
    bullet.body.velocity.x = velocityX;
    bullet.body.velocity.y = velocityY;
    
    self.time.addEvent({
        delay: 2000,
        callback: () => {
            bullet.destroy();
        }
    });
    
    return bullet;
}


function bullet0(x, y) {
    const bullet = self.add.sprite(x, y, 'bullet-effect-1');
    if (!fromOtherPlayer) bullets.add(bullet);

    self.anims.create({
        key: 'bullet',
        frames: self.anims.generateFrameNumbers('bullet-effect-1', { start: 0, end: 4 }),
        frameRate: 10,
        repeat: -1,
    });

    bullet.play('bullet');
    return bullet;
}