import { sceneEvents } from "../../Events/EventsCenter";
import { removeAllPeopleFromTalk } from "../mainScene";

export function initializeAudioStream(self) {

    // TODO: restart all peer connections
    sceneEvents.on('setDeafen', function (makeDeafen) {
        if (makeDeafen) {
            removeAllPeopleFromTalk(self);
            self.deafen = true;
            let localStream = self.localStream;
            // destroy stream
            localStream.getTracks().forEach(track => {
                track.stop();
            });
            self.localStream = null;
            sceneEvents.emit('updateMicStatus', false);
            self.socket.emit("updatePlayerInfo", { deafen: true, microphoneStatus: false }, self.socket.id);
            
        } else {
            navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
                self.localStream = stream;
                toggleMute(self);
                self.deafen = false;
                self.socket.emit("updatePlayerInfo", { deafen: false, microphoneStatus: false }, self.socket.id);
            });
        }
    });
     // if user touch microphone on Game UI scene -> toggle microphone stream
     sceneEvents.on('toggleMute', () => {
        if (self.localStream) {
            toggleMute(self);
        };
    });
}

export function initializeUserOnOtherTab(self) {
    document.addEventListener("visibilitychange", (event) => {
        if (document.visibilityState == "visible") {
        
        } else {
          console.log("tab is inactive");
          if (self.localStream) {
            // remove all tracks from stream
              self.localStream.getTracks().forEach(track => {
                  track.stop();
              })
              
        }
        }
      });
}

export function onOtherTab(self) {
    document.addEventListener("visibilitychange", (event) => {
            if (document.visibilityState == "visible") {
            
            } else {
              console.log("tab is inactive");
              if (self.localStream) {
                // remove all tracks from stream
                  self.localStream.getTracks().forEach(track => {
                      track.stop();
                  })
                  
            }
            }
          });
}

export function connectToAllPeople(self) {
}

function toggleMute(self) {
    let localStream = self.localStream;
    for (let index in localStream.getAudioTracks()) {
        let localStreamEnabled = localStream.getAudioTracks()[index].enabled;
        localStream.getAudioTracks()[index].enabled = !localStreamEnabled;

        localStreamEnabled = !localStreamEnabled;

        self.playerUI[self.socket.id].microphone.setTexture(localStreamEnabled ? 'microphone' : 'microphoneMuted');

        self.socket.emit("updatePlayerInfo", { microphoneStatus: localStreamEnabled }, self.socket.id);

        sceneEvents.emit('updateMicStatus', localStreamEnabled);
    }
}