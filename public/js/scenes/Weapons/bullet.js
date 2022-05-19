import { bullets } from "./weapon";


// bullet sprites, effects/animations
const bulletEffects = [bullet0, bullet1];


export function createBullet(self, weaponId, x, y, fromOtherPlayer = false, angle) {    
    // setup bullet position
    const x2 = x + Math.cos(angle) * 15;
    const y2 = y + Math.sin(angle) * 15;
    const bullet = bulletEffects[weaponId](self, x2, y2).setOrigin(0.5, 0.5);
    bullet.rotation = angle;


    // adding to physics
    if (!fromOtherPlayer) bullets.add(bullet);
    self.physics.add.existing(bullet);
    const velocityX = Math.cos(angle) * 500;
    const velocityY = Math.sin(angle) * 500;
    bullet.body.velocity.x = velocityX;
    bullet.body.velocity.y = velocityY;
    
    
    return bullet;
}


function bullet0(self, x, y) {
    const bullet = self.add.sprite(x, y + 5 , 'bullet-spritesheet-1').setFrame(0);
    
    self.time.addEvent({
        delay: 2000,
        callback: () => {
            bullet.destroy();
        }
    });
    return bullet;
}

function bullet1(self, x, y, flip) {
    console.log(flip);
    const bullet = self.add.sprite(x, y, 'bullet-spritesheet-1').setFrame(1);
    bullet.setScale(0.8);

    self.time.addEvent({
        delay: 2000,
        callback: () => {
            bullet.destroy();
        }
    });

    return bullet;

}