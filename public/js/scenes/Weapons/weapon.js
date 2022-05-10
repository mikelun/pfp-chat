export function initializeWeapon(self) {
    // Initialize weapon
    self.weapon = self.add.image(0, 0, 'p90').setAlpha(0);

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
        // add weapon with distance 100
        self.weapon.x = self.player.x + Math.cos(angle) * 10;
        self.weapon.y = self.player.y + 5 + Math.sin(angle) * 10;
        self.weapon.rotation = angle;

        // if player touch left mouse
        if (self.input.activePointer.isDown) {
            const bullet = self.add.sprite(self.weapon.x, self.weapon.y, 'bullet-effect-1');
            self.anims.create({
                key: 'bullet',
                frames: self.anims.generateFrameNumbers('bullet-effect-1', { start: 0 , end: 4 }),
                frameRate: 10,
                repeat: -1,
            });
            bullet.play('bullet');
            // add velocity from player to weapon
            self.physics.add.existing(bullet);
            bullet.body.velocity.x = Math.cos(angle) * 500;
            bullet.body.velocity.y = Math.sin(angle) * 500;
            self.cameras.main.shake(50, 0.001);
            // after 2 secs, destroy bullet
            self.time.addEvent({
                delay: 2000,
                callback: () => {
                    bullet.destroy();
                }
            });
        }
    });
}

export function updateWeapon(self) {
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