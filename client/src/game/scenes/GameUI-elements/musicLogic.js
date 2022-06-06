import { sceneEvents } from "../../Events/EventsCenter";
import { songsData, fightSongsData, mainThemeSongsData } from './music-data/songs.js';

var songs = songsData;
var fightSongs = fightSongsData;
var mainThemeSongs = mainThemeSongsData;

var currentSong = 0;

var currenFightSong = 0;

var currentMainThemeSong = 0;

var self;

var currentStyle = 'songs';

export function startPlayingMusic(newSelf) {
    self = newSelf;

    //shuffle songs
    songs = songs.sort(() => Math.random() - 0.5);
    // shuffle fightSongs
    fightSongs = fightSongs.sort(() => Math.random() - 0.5);
    // shuffle mainThemeSongs
    mainThemeSongs = mainThemeSongs.sort(() => Math.random() - 0.5);

    // get song
    const song = songs[currentSong];

    self.myAudio = new Audio(song.url);
    self.myAudio.play();


    ifAudioEnded(self);

    updateSongPanel();
}

export function muteMusic() {
    if (self.myAudio) {
        self.myAudio.muted = true;
        return true;
    }
}
export function unmuteMusic() {
    if (self.myAudio) {
        self.myAudio.muted = false;
        return true;
    }
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

export function changedMap(self, mapId) {
    pauseMusic(self);

    if (mapId == 4) {
        currentStyle = 'songs';
        songs = songs.sort(() => Math.random() - 0.5);
        const song = songs[currentSong];
        self.myAudio.src = song.url;
        self.myAudio.currentTime = 0;
        self.myAudio.play();
        updateSongPanel();
    }
    if (mapId == 8) {
        currentStyle = 'fightSongs';
        fightSongs = fightSongs.sort(() => Math.random() - 0.5);
        const song = fightSongs[currenFightSong];
        self.myAudio.src = song;
        self.myAudio.currentTime = 0;
        self.myAudio.play();
    }
    if (mapId == 6) {
        currentStyle = 'mainThemeSongs';
        mainThemeSongs = mainThemeSongs.sort(() => Math.random() - 0.5);
        const song = mainThemeSongs[currentMainThemeSong];
        self.myAudio.src = song;
        self.myAudio.currentTime = 0;
        self.myAudio.play();
    }

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
        if (currentStyle == 'songs') {
            currentSong++;
            if (currentSong >= songs.length) {
                currentSong = 0;
            }
            const song = songs[currentSong];
            self.myAudio.src = song.url;
            self.myAudio.play();
            updateSongPanel();
        } else if (currentStyle == 'fightSongs') {
            currenFightSong++;
            if (currenFightSong >= fightSongs.length) {
                currenFightSong = 0;
            }
            const song = fightSongs[currenFightSong];
            self.myAudio.src = song;
            self.myAudio.play();
        } else if (currentStyle == 'mainThemeSongs') {
            currentMainThemeSong++;
            if (currentMainThemeSong >= mainThemeSongs.length) {
                currentMainThemeSong = 0;
            }
            const song = mainThemeSongs[currentMainThemeSong];
            self.myAudio.src = song;
            self.myAudio.play();
        }
    }
}