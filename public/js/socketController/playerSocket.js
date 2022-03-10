import { Player } from "../characters/player";
import {createAnimationForPlayer} from "../anims/characterAnims";
var peers;
export function initializePlayersSocket(self, _peers) {
    peers = _peers;
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

    //DISCONNECT FUNCTION ONLY HERE
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
    // generate random number 0 -4
    const textureId = Math.floor(Math.random() * 4);
    self.textureId = textureId;
    const texture = `characters${textureId}`;
    self.player = self.add.player(410, 410, texture, 4, 0);
    createAnimationForPlayer(self.anims, textureId);
    self.cameras.main.startFollow(self.player, true, 0.07, 0.07);

}

function addOtherPlayers(self, playerInfo) {
    const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, "characters", 0).setScale(0.5);
    //const otherPlayerName = self.add.text(playerInfo.x, playerInfo.y, playerInfo.account, { fontSize: '20px', color: '#ffffff' });
    otherPlayer.anims.play("player-walk");
    otherPlayer.playerId = playerInfo.playerId;
    self.otherPlayers.add(otherPlayer);
}


function createAnims(self) {
    const anims = self.anims;
    anims.create({
        key: "hero-walk-down",
        frames: anims.generateFrameNumbers("characters0", { start: 0, end: 2 }),
        frameRate: 8,
        repeat: -1
    });
    anims.create({
        key: "player-walk",
        frames: anims.generateFrameNumbers("characters", { start: 46, end: 49 }),
        frameRate: 16,
        repeat: -1
    });
    anims.create({
        key: "player-walk-back",
        frames: anims.generateFrameNumbers("characters", { start: 65, end: 68 }),
        frameRate: 16,
        repeat: -1
    });
}
function removePeer(socket_id) {

    let videoEl = document.getElementById(socket_id)
    if (videoEl) {

        const tracks = videoEl.srcObject.getTracks();

        tracks.forEach(function (track) {
            track.stop()
        })

        videoEl.srcObject = null
        videoEl.parentNode.removeChild(videoEl)
    }
    if (peers[socket_id]) peers[socket_id].destroy()
    delete peers[socket_id]
}
