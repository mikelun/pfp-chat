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

    socket.emit('initializePlayer', address, self.room);
    socket.on('playerInitialized', (data) => {
        // find current player 
        var currentPlayer = null;
        for (let i = 0; i < data.length; i++) {
            if (data[i].playerId == socket.id) {
                currentPlayer = data[i];
            }
        }
        if (!currentPlayer) return;

        self.scene.start('MainScene', { stream: self.stream, moralis: Moralis, address: address, room: self.room, socket: socket, currentPlayers: data, mapId: currentPlayer.mapId });
    });
}

export function playerWasAtPlanet(self) {
    try {
        navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
            self.stream = stream;

            startMoralis(Moralis);
            self.user = getUserMoralis(Moralis);

            if (self.user && self.room != 'guest') {
                self.step = 2;
            } else {
                self.step = 1;
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