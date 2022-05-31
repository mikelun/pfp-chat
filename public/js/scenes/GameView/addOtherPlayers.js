import { OtherPlayer } from "../../characters/otherPlayer";
import { sceneEvents } from "../../Events/EventsCenter";
import { addPhysicsForScene } from "../../MapBuilding/showMap";
import { getEnsDomain } from "../../web3/GetEnsDomain";
import { getPlayerNFT } from "../../web3/GetPlayerNFT";
import { loadTexture } from "./loadTexture";
import { getInterectionForEns, isTextureFromInternet, pushToPlayerList, randColor, showPlayersToTalk, updateEnsInPlayerList, updateNFTInPlayerList } from "../../socketController/playerSocket"
import { configureArtifactCharacter } from "../../Artifacts/configureArtifacts";
import { createTalkingEffect } from "./addEffectToPlayer";
import { createPlayerInfo, createPlayerUI, createPlayerUILevelDown, createSpeakRequest } from "./playerUI";


export function addOtherPlayers(self, playerInfo) {

    createPlayerUILevelDown(self, playerInfo);
    // define other player with 0 character
    const otherPlayer = self.add.otherPlayer(playerInfo.x, playerInfo.y, `characters${playerInfo.textureId}`, self)

    otherPlayer.setDepth(25);

    const textureFromInternet = isTextureFromInternet(playerInfo.textureId);
    if (textureFromInternet) {
        var type = 'crypto-duckies';
        if (playerInfo.textureId.startsWith('https://buildship')) {
            type = 'moonbirds';
        }
        loadTexture(self, otherPlayer, playerInfo.textureId, type);
    } else if ((playerInfo.textureId + '').startsWith('artifact$')){
        configureArtifactCharacter(self, playerInfo.textureId, otherPlayer, true);

    } else {
        otherPlayer.setTexture(`characters${playerInfo.textureId}`);
    }

    //const otherPlayerName = self.add.text(playerInfo.x, playerInfo.y, playerInfo.account, { fontSize: '20px', color: '#ffffff' });
    otherPlayer.playerId = playerInfo.playerId;
    otherPlayer.name = playerInfo.playerName;

    createPlayerUI(self, playerInfo);

    /**
     * IF PLAYER IN SPACE
     */
    otherPlayer.setInteractive().on('pointerdown', () => {
        if (playerInfo.spaceId) {
            createPlayerInfo(self, {playerId: playerInfo.playerId});
        }
    });

    // ADD WEAPON FOR PLAYER
    if (self.mapId == 8) self.playerUI.second[playerInfo.playerId].add(self.add.image(0, 23, playerInfo.weapon.texture).setOrigin(0, 0.5));

    self.otherPlayers.add(otherPlayer);

    pushToPlayerList(playerInfo);
    //showPlayersToTalk()

    //getInterectionForEns(playerInfo.playerId, playerInfo.playerName);
}
