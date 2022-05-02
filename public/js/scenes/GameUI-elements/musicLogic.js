import { sceneEvents } from "../../Events/EventsCenter";
import { songs } from "./music-data/songs";

var currentSong = 0;

export function startPlayingMusic(self) {
    //shuffle songs
    songs.sort(() => Math.random() - 0.5);
    // get song
    const song = songs[currentSong];
    
    self.myAudio = new Audio(song.url);
    self.myAudio.play();

    
    ifAudioEnded(self);
    
    updateSongPanel();
}

export function pauseMusic(self) {
    if (self.myAudio) {
        self.myAudio.pause();
    }
}

export function resumeMusic(self) {
    if (self.myAudio) {
        self.myAudio.play();
    }
}

export function nextSong(self) {
    // remove previouse song
    if (self.myAudio) {
        self.myAudio.pause();
        self.myAudio.currentTime = 0;
    }
    currentSong = (currentSong + 1) % songs.length;
    const song = songs[currentSong];
    self.myAudio.src = song.url;
    self.myAudio.play();
    updateSongPanel();
}

export function previousSong(self) {
    if (self.myAudio) {
        if (self.myAudio.isPlaying) {
            pauseMusic(self);
        } else {
            resumeMusic(self);
        }
    }
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    const song = songs[currentSong];
    self.myAudio.src = song.url;
    self.myAudio.play();
    updateSongPanel();
}

function updateSongPanel() {
    sceneEvents.emit('newSong', songs[currentSong].name, songs[currentSong].author);
}

function ifAudioEnded(self) {
    self.myAudio.onended = () => {
        self.myAudio.pause();
        self.myAudio.currentTime = 0;
        currentSong++;
        if (currentSong >= songs.length) {
            currentSong = 0;
        }
        const song = songs[currentSong];
        self.myAudio.src = song.url;
        self.myAudio.play();
        updateSongPanel();
    };
}