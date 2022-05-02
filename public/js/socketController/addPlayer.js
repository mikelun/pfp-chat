import { Player } from "../characters/player";
import { sceneEvents } from "../Events/EventsCenter";
import { addPhysicsForScene } from "../MapBuilding/showMap";
import { getEnsDomain } from "../web3/GetEnsDomain";
import { getPlayerNFT } from "../web3/GetPlayerNFT";
import { isTextureFromInternet, loadTexture, pushToPlayerList, randColor, showPlayersToTalk, updateEnsInPlayerList, updateNFTInPlayerList } from "./playerSocket";

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
    self.playerUI[self.socket.id].background = self.rexUI.add.roundRectangle(self.player.x, self.player.y - 20, playerInfo.playerName.length * 6, 12, 8, 0x000000).setAlpha(0.5);
    self.playerUI[self.socket.id].playerText = self.add.text(self.player.x, self.player.y, playerInfo.playerName, { fontSize: '50px', fontFamily: 'PixelFont', fill: textColor }).setScale(0.3);
    self.playerUI[self.socket.id].microphone = self.add.image(playerInfo.x + 20, playerInfo.y, "microphone1-off").setScale(0.45);
    self.playerUI[self.socket.id].headphones = self.add.image(playerInfo.x + 50, playerInfo.y, "headphones").setScale(0.5);
    pushToPlayerList(playerInfo);
}

function nftSelected(nft) {
    const nftImage = nft.image;
    // if nft started with 'Duckie'
    var id;
    if (nft.name.startsWith('Duckie')) {
        // get id after #
        id = nft.name.split('#')[1];

        loadTexture(self.player, `https://raw.githubusercontent.com/cryptoduckies/webb3/main/${id}.png`)

        self.load.start();
    }

    updateNFTInPlayerList(nftImage, id);

    showPlayersToTalk();
    console.log(nft.name, nft.image, ' HAS BEEN SELECTED');
}