export function createParticles(self) {
    if (self.mapId != 4) return;
    var width = 1280;
    var height = 720;
    self.particles = self.add.particles('snow-particle');
    self.particles.createEmitter({
        x: 0,
        y: 0,
        // emitZone
        emitZone: {
            source: new Phaser.Geom.Rectangle(-500, 400, 2000, 100),
            type: 'random',
            quantity: 70
        },
        speedY: { min: 30, max: 50 },
        speedX: { min: -20, max: 20 },
        accelerationY: { random: [10, 15] },
        // lifespan
        lifespan: { min: 8000, max: 9000 },
        scale: { random: [0.1, 0.25] },
        alpha: { random: [0.1, 0.8] },
        gravityY: 4,
        frequency: 10,
        blendMode: 'ADD',
        // follow the player at an offiset
        follow: self.player,
        followOffset: { x: -width * 0.5, y: -height - 100 }
    })
}