import { Player } from "../../characters/player";
import { Monsterd } from "../../characters/monster";
import { sceneEvents } from "../../Events/EventsCenter";
import { addPhysicsForScene, showMap } from "../../MapBuilding/showMap";
import { getEnsDomain } from "../../web3/GetEnsDomain";
import { getPlayerNFT } from "../../web3/GetPlayerNFT";
import { loadTexture } from "./loadTexture";
import { isTextureFromInternet, pushToPlayerList, randColor, showPlayersToTalk, updateEnsInPlayerList, updateNFTInPlayerList } from "../../socketController/playerSocket"
import { resizeObjectForNFT } from "./nftsOffset";
import { createImageNFT } from "./gameViewUtils";
import { initializeWeapon } from "../Weapons/weapon";
import { removeAllMonsters } from "../../socketController/mmorpgSocket";
import { updatePlayerCoins } from "../GameUI-elements/hud";
import { configureArtifactCharacter } from "../../Artifacts/configureArtifacts";
import { addEffect, createTalkingEffect } from "./addEffectToPlayer";
import { createPlayerUI } from "./playerUI";

var self;
var effect1, effect2;
export function addPlayer(newSelf, playerInfo) {
    sceneEvents.emit('removeErrorDisconnectMessage');
    self = newSelf;

    sceneEvents.emit('updatePlayerName', playerInfo.playerName);

    sceneEvents.emit('updateIsHome', playerInfo.isHome);
    
    cleanPreviousInfoAboutPlayer(self);

    // initialize weapon for player
    initializeWeapon(self, playerInfo.weapon);

    //updatePlayerCoins(playerInfo.coins);
    self.player = self.add.player(playerInfo.x, playerInfo.y, `characters${playerInfo.textureId}`);

    // check if texture from internet
    const textureFromInternet = isTextureFromInternet(playerInfo.textureId);
    if (textureFromInternet) {
        var type = 'crypto-duckies';
        if (playerInfo.textureId.startsWith('https://buildship')) {
            type = 'moonbirds';
        }
        loadTexture(self, self.player, playerInfo.textureId, type, true);
    } else if ((playerInfo.textureId + '').startsWith('artifact$')){
        configureArtifactCharacter(self, playerInfo.textureId, self.player);

    } else {
        self.player.setTexture(`characters${playerInfo.textureId}`);
    }

    

    // SETUP PLAYER
    self.textureId = playerInfo.textureId;
    self.player.textureId = playerInfo.textureId;
    self.player.id = playerInfo.playerId;
    self.playerName = playerInfo.playerName;


    // add player to layer1
    self.player.setDepth(25);

    // START FOLLOWING
    self.cameras.main.startFollow(self.player);

    // ADD PLAYER UI
    addUIForPlayer(self, playerInfo);


    if (self.firstEntrance) {
        getPlayerNFT(self.moralis);
        self.firstEntrance = false;
    }

    getEnsDomain(self.moralis).then(domain => {
        updateEnsInPlayerList(domain);
        sceneEvents.emit('updatePlayerName', domain);
    });

    showPlayersToTalk();

    addPhysicsForScene(self, self.mapId);

    var talkSize = 400;
    if (self.room == 'buildship') {
        talkSize = 10000;
    }
    self.talkRectangle = self.add.rectangle(self.player.x, self.player.y, talkSize, talkSize, 0x000000).setAlpha(0);

    self.connected = [];

    sceneEvents.on('nftSelected', nftSelected, this);
    
}

function cleanPreviousInfoAboutPlayer(self) {    
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

    if (self.previousMap == 8) {
        removeAllMonsters();
    }
}

function addUIForPlayer(self, playerInfo) {
    self.playerUI[self.socket.id] = createPlayerUI(self, playerInfo);

    self.events.on("postupdate", function () {
        if (self.player && self.playerUI[self.socket.id]) { 
            Phaser.Display.Align.To.TopCenter(self.playerUI[self.player.id], self.player, 0, (self.player.yAdd ? self.player.yAdd : 0));
        }
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
    } else if (nft.name.startsWith('Moonbirds')) {
            id = nft.name.split('#')[1]; 
            link = `https://buildship.mypinata.cloud/ipfs/QmVqLVBe6f5af634DMEEuW3x7taiVM78yUvy5Eh7mFGXMZ/${id}.png`;
            console.log('Loading: ' + link + ' for Moonbirds');
            loadTexture(self, self.player, link, 'moonbirds', true)
    } else {
       //createImageNFT(self, nftImage);
    }


    updateNFTInPlayerList(nftImage, id, link);

    showPlayersToTalk();
}