import { Player } from "../../characters/player";
import { sceneEvents } from "../../Events/EventsCenter";
import { addPhysicsForScene } from "../../MapBuilding/showMap";
import { getEnsDomain } from "../../web3/GetEnsDomain";
import { getPlayerNFT } from "../../web3/GetPlayerNFT";
import { loadTexture } from "./loadTexture";
import { isTextureFromInternet, pushToPlayerList, randColor, showPlayersToTalk, updateEnsInPlayerList, updateNFTInPlayerList } from "../../socketController/playerSocket"

var self;

export function addPlayer(newSelf, playerInfo) {

    self = newSelf;

    configureAddPlayer(self);
    // check if texture from internet
    var textureFromInternet = isTextureFromInternet(playerInfo.textureId);
    if (textureFromInternet) {
        self.player = self.add.player(playerInfo.x, playerInfo.y, playerInfo.textureId);
        self.player.textureId = playerInfo.textureId;
    } else {
        self.player = self.add.player(playerInfo.x, playerInfo.y, `characters${playerInfo.textureId}`);
    }

    if (textureFromInternet) {
        var type = 'crypto-duckies';
        if (playerInfo.textureId.startsWith('https://buildship')) {
            type = 'moonbirds';
        }
        loadTexture(self, self.player, playerInfo.textureId, type);
    } else {
        self.player.setTexture(`characters${playerInfo.textureId}`);
    }

    

    // SETUP PLAYER
    self.textureId = playerInfo.textureId;
    self.player.id = playerInfo.playerId;
    self.playerName = playerInfo.playerName;


    // add player to layer1
    self.layer1.add(self.player);

    // START FOLLOWING
    self.cameras.main.startFollow(self.player);

    // ADD PLAYER UI
    addUIForPlayer(self, playerInfo);


    getPlayerNFT(self.moralis);

    getEnsDomain(self.moralis).then(domain => {
        updateEnsInPlayerList(domain);
    });

    showPlayersToTalk();

    addPhysicsForScene(self, self.mapId);

    var talkSize = 200;
    if (self.room == 'buildship') {
        talkSize = 10000;
    }
    self.talkRectangle = self.add.rectangle(self.player.x, self.player.y, talkSize, talkSize, 0x000000).setAlpha(0);

    self.connected = [];

    sceneEvents.on('nftSelected', nftSelected, this);
    
}

function configureAddPlayer(self) {
    if (!self.addedRoomText) {
        sceneEvents.emit('updateRoomText', self.room);
        self.addedRoomText = true;
    }
    // IF PLAYER DISCONNECTED AND AFTER RECONNECTED
    if (self.errors) {
        if (self.errors.getChildren().length > 0) {
            self.errors.clear(true);
        }
        self.errors = null;
    }
}

function addUIForPlayer(self, playerInfo) {
    self.playerUI[self.socket.id] = {};
    const textColor = randColor();
    self.playerUI[self.socket.id].background = self.rexUI.add.roundRectangle(0, 0 - 10, playerInfo.playerName.length * 6, 12, 8, 0x000000).setAlpha(0.5);
    self.playerUI[self.socket.id].playerText = self.add.text(0, -13, playerInfo.playerName, { fontSize: '50px', fontFamily: 'PixelFont', fill: textColor, align: 'center' }).setScale(0.3).setOrigin(0.5  );
    self.playerUI[self.socket.id].microphone = self.add.image(-8, -27, "microphone1-off").setScale(0.45);
    self.playerUI[self.socket.id].headphones = self.add.image(8, -25, "headphones").setScale(0.5);
    var container = self.add.container(0, 0, [self.playerUI[self.socket.id].background, self.playerUI[self.socket.id].playerText, self.playerUI[self.socket.id].microphone, self.playerUI[self.socket.id].headphones]);
    
//    container.setPosition(self.player.x, self.player.y);
    // add UI following
    self.events.on("postupdate", function () {
        if (self.player) Phaser.Display.Align.To.TopCenter(container, self.player, 0, (self.player.yAdd ? -100 : 0));
      });
    
    pushToPlayerList(playerInfo);
}

function nftSelected(nft) {
    const nftImage = nft.image;
    // if nft started with 'Duckie'
    var id, link;
    if (nft.name.startsWith('Duckie')) {
        // get id after #
        id = nft.name.split('#')[1];
        link = `https://raw.githubusercontent.com/cryptoduckies/webb3/main/${id}.png`;
        console.log('Loading: ' + link + ' for Crypto Duckies');
        loadTexture(self, self.player, link, 'crypto-duckies', true)

        self.load.start();
    } else {
        if (nft.name.startsWith('Moonbirds')) {
            id = nft.name.split('#')[1]; 
            link = `https://buildship.mypinata.cloud/ipfs/QmVqLVBe6f5af634DMEEuW3x7taiVM78yUvy5Eh7mFGXMZ/${id}.png`;
            console.log('Loading: ' + link + ' for Moonbirds');
            loadTexture(self, self.player, link, 'moonbirds', true)
        }
    }


    updateNFTInPlayerList(nftImage, id, link);

    showPlayersToTalk();
}