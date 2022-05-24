import { weaponShot } from "../../socketController/mmorpgSocket";
import { playShotSound } from "../Audio/soundFXMachine";
import { createBullet } from "./bullet";

export var bullets;

var self;
export function initializeWeapon(newSelf, weapon) {
    self = newSelf;

    // Initialize weapon
    if (self.weapon) {
        self.weapon.destroy();
    }
    self.weapon = self.add.image(0, 0, weapon.texture).setAlpha(0);
    self.weapon.id = weapon.id;

    if (bullets) return;
    bullets = self.add.group();
    //self.layer1.add(self.weapon);
    // add event on mouse down
    
    self.input.on('pointerdown', function (pointer) {
        if (self.weapon.alpha !== 1) return; 
        if (!self.player) return;

        // log mouse point position
        const x = self.input.activePointer.x + self.cameras.main.scrollX;
        const y = self.input.activePointer.y + self.cameras.main.scrollY;;


        // get angle between ox and x, y
        const angle = Phaser.Math.Angle.Between(self.player.x, self.player.y, x, y);

        self.weapon.x = self.player.x + Math.cos(angle) * 10;
        self.weapon.y = self.player.y + 5 + Math.sin(angle) * 10;
        self.weapon.rotation = angle;

        // if player touch left mouse
        if (self.input.activePointer.isDown) {
            const bullet = createBullet(self, self.weapon.id, self.player.x, self.player.y, false, angle);
            
            playShotSound(self, self.weapon.texture.key);
            weaponShot({
                x: bullet.x,
                y: bullet.y,
                velocityX: bullet.body.velocity.x,
                velocityY: bullet.body.velocity.y,
                angle: angle,
                playerId: self.player.id,
                weaponId: self.weapon.id
            });
            self.cameras.main.shake(50, 0.001);
            // after 2 secs, destroy bullet
        }
    });
}

export function updateWeapon(self) {

    if (!self.player) return;
    
    if (self.weapon && self.weapon.alpha === 1) {
        // log mouse point position
        const x = self.input.activePointer.x + self.cameras.main.scrollX;
        const y = self.input.activePointer.y + self.cameras.main.scrollY;;

        // make a little shake for camera
        // get angle between ox and x, y
        const angle = Phaser.Math.Angle.Between(self.player.x, self.player.y, x, y);
        // add weapon with distance 100
        self.weapon.x = self.player.x + Math.cos(angle) * 10;
        self.weapon.y = self.player.y + 5 + Math.sin(angle) * 10;
        self.weapon.rotation = angle;
    
        if (angle < -Math.PI / 2 || angle > Math.PI / 2) {
            self.weapon.flipY = true;
        } else {
            self.weapon.flipY = false;
        }
    }
}

export function removeWeapon(self) {
    if (self.weapon.alpha === 1) {
        self.weapon.alpha = 0;
    }
}

export function addWeapon(self) {
    if (self.weapon.alpha === 0) {
        self.weapon.alpha = 1;
    }
}

export function changeWeapon(weapon) {  
    self.weapon.id = weapon.id;
    self.weapon.setTexture(weapon.texture);
}