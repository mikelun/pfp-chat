import { OtherPlayer } from "../../characters/otherPlayer";
import { sceneEvents } from "../../Events/EventsCenter";
import { addPhysicsForScene } from "../../MapBuilding/showMap";
import { getEnsDomain } from "../../web3/GetEnsDomain";
import { getPlayerNFT } from "../../web3/GetPlayerNFT";
import { loadTexture } from "./loadTexture";
import { getInterectionForEns, isTextureFromInternet, pushToPlayerList, randColor, showPlayersToTalk, updateEnsInPlayerList, updateNFTInPlayerList } from "../../socketController/playerSocket"
import { configureArtifactCharacter } from "../../Artifacts/configureArtifacts";


export function addOtherPlayers(self, playerInfo) {

    // define other player with 0 character
    const otherPlayer = self.add.otherPlayer(playerInfo.x, playerInfo.y, `characters${playerInfo.textureId}`, self)

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
    const textColor = randColor();
    let microphoneTexture = playerInfo.microphoneStatus ? "microphone1" : "microphone1-off";
    let headphonesTexture = playerInfo.deafen ? "headphones-off" : "headphones";
    self.playerUI[playerInfo.playerId] = {};

    self.playerUI[playerInfo.playerId].background = self.rexUI.add.roundRectangle(playerInfo.x, playerInfo.y - 20, playerInfo.playerName.length * 5, 9, 5, 0x000000).setAlpha(0.5);
    self.playerUI[playerInfo.playerId].playerText = self.add.text(playerInfo.x, playerInfo.y, playerInfo.playerName, { fontSize: '120px', fontFamily: 'PixelFont', fill: textColor, align: 'center' }).setScale(0.1).setOrigin(0.5  );
    self.playerUI[playerInfo.playerId].microphone = self.add.image(playerInfo.x + 20, playerInfo.y, microphoneTexture).setScale(0.25);
    self.playerUI[playerInfo.playerId].headphones = self.add.image(playerInfo.x + 50, playerInfo.y, "headphones").setScale(0.25);

    // ADD WEAPON FOR PLAYER
    if (self.mapId == 8) self.playerUI[playerInfo.playerId].weapon = self.add.image(0, 0, playerInfo.weapon.texture).setOrigin(0, 0.5);

    self.otherPlayers.add(otherPlayer);
    self.layer1.add(otherPlayer);

    pushToPlayerList(playerInfo);
    //showPlayersToTalk()

    getInterectionForEns(playerInfo.playerId, playerInfo.playerName);

}
