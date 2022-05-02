import { sceneEvents } from "../../Events/EventsCenter";
import { removeAllPeopleFromTalk } from "../mainScene";

export function initializeAudioStream(self) {

    // TODO: restart all peer connections
    sceneEvents.on('setDeafen', function (makeDeafen) {
        if (makeDeafen) {
            removeAllPeopleFromTalk(self);
            setDeafen(self);

        } else {
            setUndeafen(self);
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
    if (!self.microphoneEnabled) return;
    document.addEventListener("visibilitychange", (event) => {
        if (document.visibilityState == "visible") {
            if (self.deafen) return;
            setUndeafen(self);
        } else {
            if (self.deafen) return;
            // remove all peers, than add stream
            removeAllPeopleFromTalk(self);
            setDeafen(self);
        }
    });
}

export function onOtherTab(self) {
    setDeafen(self);
}

export function connectToAllPeople(self) {
    setUndeafen(self);
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


function setDeafen(self) {
    self.deafen = true;
    let localStream = self.localStream;
    // destroy stream
    localStream.getTracks().forEach(track => {
        track.stop();
    });
    self.localStream = null;
    sceneEvents.emit('updateMicStatus', false);
    sceneEvents.emit('updateDeafenStatus', true);
    self.socket.emit("updatePlayerInfo", { deafen: true, microphoneStatus: false }, self.socket.id);
}

function setUndeafen(self) {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
        self.localStream = stream;
        toggleMute(self);
        self.deafen = false;
        self.socket.emit("updatePlayerInfo", { deafen: false, microphoneStatus: false }, self.socket.id);
    });
}
