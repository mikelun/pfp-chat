export function addAudioTimer(self) {
    let audio = self.audio;
    if (audio && self.timeMusic && audio.duration) {
        let currentMin = Math.floor(audio.currentTime / 60);
        let currentSec = Math.floor(audio.currentTime) % 60;
        let durationMin = Math.floor(audio.duration / 60);
        let durationSec = Math.floor(audio.duration) % 60;
        if (currentSec < 10) currentSec = '0' + currentSec;
        self.timeMusic.setText(`${currentMin}:${currentSec}/${durationMin}:${durationSec}`)
    }
}