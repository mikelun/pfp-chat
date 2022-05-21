export function createCoin(self, coinData, coinsList, coinId) {
    console.log(coinsList);

    coinsList[coinId] = self.add.group();
    for (let i = 0; i < coinData.value; i++) {
        const coin = self.add.sprite(coinData.x, coinData.y, 'coin1').play('coin1').setScale(0.1);
        // slow go to random position with radius 30
        self.physics.add.existing(coin);

        // move slow to x, y position
        coin.body.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
        // create timer to destroy coin
        self.time.addEvent({
            delay: 200,
            callback: () => {
                coin.body.setVelocity(0, 0);
            }
        });
        // make slow scale to 1.2
        self.tweens.add({
            targets: coin,
            scale: 0.8,
            duration: 300,
            yoyo: false,
            repeat: 0
        });
        // add to coin group
        coinsList[coinId].add(coin);
    }

    // create physic rectangle with size 150, 150
    const rect = self.add.rectangle(coinData.x, coinData.y, 100, 100, 0xffffff).setAlpha(0);
    self.physics.add.existing(rect);
    self.physics.add.overlap(rect, self.player, () => {
        rect.destroy();

        if (!coinsList[coinId]) return;

        // add effect coins goind to player
        coinsList[coinId].getChildren().forEach(coin => {
            self.tweens.add({
                targets: coin,
                x: self.player.x,
                y: self.player.y,
                duration: 300,
                yoyo: false,
                repeat: 0,
                onComplete: () => {
                    if (coinsList[coinId]) {
                        coinsList[coinId].clear(true);
                    }
                }
            });
        });
        self.sound.play('coin1');
        
        self.socket.emit('coinClaimed', coinId);



        // add effect attraction coins to player

    });


}