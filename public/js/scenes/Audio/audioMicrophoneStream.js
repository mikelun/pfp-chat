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
        if (!self.microphoneEnabled) {
            sceneEvents.emit('createErrorMessage', 'YOU HAVEN\'T MICROPHONE ACCESS, PLEASE RESTART PAGE');
            return;
        }
        // IF NOT PLAYER ON SCENE)
        if (!self.talkRectangle) return;


        if (self.talkRectangle.width == 0) {
            // CREATE REQUEST PANEL TO JOIN VOICE CHA
            sceneEvents.emit('createApprovePanel', {
                message: 'DO YOU WANT TO SEND REQUEST TO JOIN TO THIS VOICE CHAT?',
                onApprove: 'createSpeakRequest', 
                data: {},
            });
            return;
        }

        if (self.localStream) {
            toggleMute(self);
        };
    });

    setUndeafen(self);
}

export function initializeUserOnOtherTab(self) {
    return;
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

    if (self.isSpace && self.talkRectangle && self.talkRectangle.width == 0) {
        // make a panel with request
        sceneEvents.emit('createRequest', 'DO YOU WANT TO SEND REQUEST TO JOIN TO THIS VOICE CHAT?');
        return;
    }
    let localStream = self.localStream;
    for (let index in localStream.getAudioTracks()) {
        let localStreamEnabled = localStream.getAudioTracks()[index].enabled;
        localStream.getAudioTracks()[index].enabled = !localStreamEnabled;

        localStreamEnabled = !localStreamEnabled;

        //self.playerUI[self.socket.id].microphone.setTexture(localStreamEnabled ? 'microphone' : 'microphoneMuted');

        self.socket.emit("updatePlayerInfo", { microphoneStatus: localStreamEnabled }, self.socket.id);

        sceneEvents.emit('updateMicStatus', localStreamEnabled);
    }
}


function setDeafen(self) {
    self.deafen = true;
    let localStream = self.localStream;

    if (!localStream) {
        sceneEvents.emit('createErrorMessage', 'YOU HAVEN\'T MICROPHONE ACCESS, PLEASE RESTART PAGE');
    }
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
    if (!self.microphoneEnabled) {
        sceneEvents.emit('createErrorMessage', 'YOU HAVEN\'T MICROPHONE ACCESS, PLEASE RESTART PAGE');
        return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
        self.localStream = stream;

        getAudioVolume(self.localStream);


        toggleMute(self);
        self.deafen = false;
        self.socket.emit("updatePlayerInfo", { deafen: false, microphoneStatus: false }, self.socket.id);
    });
}


var average = 0;
function getAudioVolume(stream) {
    var audioContext = new AudioContext();
    var analyser = audioContext.createAnalyser();
    var microphone = audioContext.createMediaStreamSource(stream);
    var javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;
    microphone.connect(analyser);
    analyser.connect(javascriptNode);

    javascriptNode.connect(audioContext.destination);
    
    javascriptNode.onaudioprocess = function () {
        var array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        var values = 0;


        var length = array.length;
        for (var i = 0; i < length; i++) {
            values += (array[i]);
        }

        average = Math.round(values / length);
    }
}

export function getCurrentVolume() {
    return average;
}