import { bullets } from "./weapon";


// bullet sprites, effects/animations
const bulletEffects = [bullet0, bullet1, bullet2, bullet3, bullet4, bullet5, bullet6];


export function createBullet(self, weaponId, x, y, fromOtherPlayer = false, angle) {    
    // setup bullet position
    const x2 = x + Math.cos(angle) * 15;
    const y2 = y + Math.sin(angle) * 15;

    const bullet = bulletEffects[weaponId](self, x2, y2).setOrigin(0.5, 0.5).setAlpha(0.5);
    bullet.rotation = angle;


    // adding to physics
    if (!fromOtherPlayer) bullets.add(bullet);
    self.physics.add.existing(bullet);
    const velocityX = Math.cos(angle) * 500;
    const velocityY = Math.sin(angle) * 500;
    bullet.body.velocity.x = velocityX;
    bullet.body.velocity.y = velocityY;
    
    // add animation alpha to 1 
    self.tweens.add({
        targets: bullet,
        alpha: 1,
        duration: 100,
        ease: 'Linear',
    });

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

function bullet1(self, x, y) {
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

function bullet2(self, x, y) {
    const bullet = self.add.sprite(x, y , 'bullet-spritesheet-1').setFrame(6);
    
    self.time.addEvent({
        delay: 2000,
        callback: () => {
            bullet.destroy();
        }
    });
    return bullet;
}

function bullet3(self, x, y) {
    const bullet = self.add.sprite(x, y , 'bullet-spritesheet-1').setFrame(2);
    
    self.time.addEvent({
        delay: 2000,
        callback: () => {
            bullet.destroy();
        }
    });
    return bullet;
}


function bullet4(self, x, y) {
    const bullet = self.add.sprite(x, y + 3, 'bullet-spritesheet-1').setFrame(4);
    
    self.time.addEvent({
        delay: 2000,
        callback: () => {
            bullet.destroy();
        }
    });
    return bullet;
}

function bullet5(self, x, y) {
    const bullet = self.add.sprite(x, y + 3, 'bullet-spritesheet-1').setFrame(7);
    
    self.time.addEvent({
        delay: 2000,
        callback: () => {
            bullet.destroy();
        }
    });
    return bullet;
}


function bullet6(self, x, y) {
    const bullet = self.add.sprite(x, y + 3, 'bullet-spritesheet-1').setFrame(3);
    
    self.time.addEvent({
        delay: 2000,
        callback: () => {
            bullet.destroy();
        }
    });
    return bullet;
}
