import { defaultLevel0 } from "./defaultLevels";
import { Moralis } from 'moralis';
import { initializeRooms } from "../initializeRooms";
import { getUserMoralis } from "./web3-utils";
import { startMoralis } from "./web3-utils";
import { startSocket } from "../../../socketController/startSocket";

export function showCurrentLevel(self) {
    // CLEAR SCREEN FOR THE NEXT LEVEL(MESSAGE)
    if (self.levelGroup) {
        self.levelGroup.clear(true);
    }
    if (self.button1) {
        self.button1.destroy();
    }
    if (self.button2) {
        self.button2.destroy();
    }
    if (self.otherRooms) {
        self.otherRooms.destroy();
    }
    if (self.button1Background) {
        self.button1Background.destroy();
    }

    // if (self.step == -1) {
    //    self.showRooms();
    // }
    self.skip = false;
    // SHOW LEVELS
    if (self.step < self.levels.length) {
        for (let i = 0; i < self.levels.length; i++) {
            if (i == self.step) {
                self.levels[i](self, Moralis);
            }
        }
    } else {
        goToPlanet(self);
    }
}

export function goToPlanet(self) {
    var address = null;
    if (self.user) {
        address = getUserMoralis(Moralis).get('ethAddress');
        localStorage.setItem('lastVisit', 'true');
    } else {
        localStorage.setItem('lastVisit', 'false');
    }

    self.label = self.add.text(530, 320, 'LOADING...', { fill: "#ffb900", fontSize: "70px", fontFamily: "PixelFont", align : "left" });

    // initialize socket and with info go to planet
    const socket = startSocket();

    socket.emit('initializePlayer', {address: address, planet: self.planetName, firstEntrance: true, spaceId: self.id});
    socket.on('playerInitialized', (players, data) => {
        // find current player 
        var currentPlayer = null;
        for (let i = 0; i < players.length; i++) {
            if (players[i].playerId == socket.id) {
                currentPlayer = players[i];
            }
        }
        if (!currentPlayer) return;

        console.log("MICROPHONE ENABLED: ", self.microphoneEnabled);
        self.scene.start('MainScene', { microphoneEnabled: self.microphoneEnabled, moralis: Moralis, address: address, planet: self.planetName, socket: socket, currentPlayers: players, changedTiles: data, player:currentPlayer});
    });
}

export function playerWasAtPlanet(self) {
    //var userSupabase = getSupabaseUser();
    //if (!userSupabase) return;

    try {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
            self.stream = stream;
            stream.getTracks().forEach(track => {
                track.stop();
            });

            self.microphoneEnabled = true;

            startMoralis(Moralis);
            self.user = getUserMoralis(Moralis);

            if (self.user) {
                self.step = 2;
            }
        });
    } catch (e) {
        localStorage.setItem('microphone', 'false');
    }
}

export function typeTextWithDelay(self, text) {
    var i = 0;
    var delay = 50;

    var timer = self.time.addEvent({
        delay: delay,
        callback: () => {
            self.label.text += text[i];
            i++;
            if (i >= text.length || self.skip == true) {
                self.label.text = text;
                showButtons(self);
                timer.destroy();
            }
        },
        callbackScope: self,
        loop: true
    });
}
function showButtons(self) {
    if (self.button1) self.button1.setAlpha(0.6);
    if (self.button2) self.button2.setAlpha(0.6);
}