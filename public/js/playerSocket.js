function initializePlayersSocket(self) {
    self.otherPlayers = self.physics.add.group();

    self.socket.on('currentPlayers', function (players) {
        Object.keys(players).forEach(function (id) {
        if (players[id].playerId === self.socket.id) {
            addPlayer(self, players[id]);
        } else {
            addOtherPlayers(self, players[id]);
        }
        });
    });
    self.socket.on('newPlayer', function (playerInfo) {
        addOtherPlayers(self, playerInfo);
    });
    
    self.socket.on('playerMoved', function (playerInfo) {
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
            otherPlayer.setRotation(playerInfo.rotation);
            otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        }
        });
    });

    // DISCONNECT FUNCTION ONLY HERE
    self.socket.on('disconnected', function (playerId) {
        console.log('disconnected');

        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
            otherPlayer.destroy();
        }
        });
        for (let socket_id in peers) {
            removePeer(socket_id)
        }
    });
}

function addPlayer(self, playerInfo) {
    self.sprite = self.physics.add
      .sprite(400, 400, "characters", 0)
      .setSize(22, 33)
      .setOffset(23, 27)
      .setScale(0.5);
    var test = self.add.sprite(400, 400, "characters0", 0).setSize(22, 33);
    createAnims(self);
    test.anims.play("hero-walk-down");
    self.sprite.anims.play("player-walk-back");
    self.cameras.main.startFollow(self.sprite, true);
    self.cameras.main.setBounds(0, 0, 1000, 1000);
  
    // Change texts
    //playerName = self.add.text(self.sprite.x, self.sprite.y, "player", { fontSize: '20px', color: '#ffffff' });
}

function addOtherPlayers(self, playerInfo) {
    const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, "characters", 0).setScale(0.5);
    //const otherPlayerName = self.add.text(playerInfo.x, playerInfo.y, playerInfo.account, { fontSize: '20px', color: '#ffffff' });
    otherPlayer.anims.play("player-walk");
    otherPlayer.playerId = playerInfo.playerId;
    self.otherPlayers.add(otherPlayer);
  
    // const camera  = this.cameras.main;
    // camera.setBounds(0, 0, 1400, 1400);
}


function createAnims(self) {
    const anims = self.anims;
    anims.create({
        key: "hero-walk-down",
        frames: anims.generateFrameNumbers("characters0", { start: 0, end: 2 }),
        frameRate: 8,
        repeat: -1
    });
}