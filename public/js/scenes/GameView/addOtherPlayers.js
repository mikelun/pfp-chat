import { OtherPlayer } from "../../characters/otherPlayer";
import { sceneEvents } from "../../Events/EventsCenter";
import { addPhysicsForScene } from "../../MapBuilding/showMap";
import { getEnsDomain } from "../../web3/GetEnsDomain";
import { getPlayerNFT } from "../../web3/GetPlayerNFT";
import { loadTexture } from "./loadTexture";
import { getInterectionForEns, isTextureFromInternet, pushToPlayerList, randColor, showPlayersToTalk, updateEnsInPlayerList, updateNFTInPlayerList } from "../../socketController/playerSocket"


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

    self.playerUI[playerInfo.playerId].background = self.rexUI.add.roundRectangle(playerInfo.x, playerInfo.y - 20, playerInfo.playerName.length * 6, 15, 5, "#ffffff").setAlpha(0.5);
    self.playerUI[playerInfo.playerId].playerText = self.add.text(playerInfo.x, playerInfo.y, playerInfo.playerName, { fontSize: '50px', fontFamily: 'PixelFont', fill: textColor }).setScale(0.3)
    self.playerUI[playerInfo.playerId].microphone = self.add.image(playerInfo.x + 20, playerInfo.y, microphoneTexture).setScale(0.5);
    self.playerUI[playerInfo.playerId].headphones = self.add.image(playerInfo.x + 50, playerInfo.y, "headphones").setScale(0.5);

    self.otherPlayers.add(otherPlayer);
    self.layer1.add(otherPlayer);

    pushToPlayerList(playerInfo);
    //showPlayersToTalk()

    getInterectionForEns(playerInfo.playerId, playerInfo.playerName);
}