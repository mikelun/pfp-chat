import { sceneEvents } from "../Events/EventsCenter";

export function toggleMute(self) {
    let localStream = self.localStream;
    for (let index in localStream.getAudioTracks()) {
        let localStreamEnabled = localStream.getAudioTracks()[index].enabled;
        localStream.getAudioTracks()[index].enabled = !localStreamEnabled;

        localStreamEnabled = !localStreamEnabled;

        self.playerUI[self.socket.id].microphone.setTexture(localStreamEnabled ? 'microphone' : 'microphoneMuted');

        self.socket.emit("updatePlayerInfo", { microphoneStatus: localStreamEnabled }, self.socket.id);
        sceneEvents.emit("microphone-toggled", localStreamEnabled);
    }
}