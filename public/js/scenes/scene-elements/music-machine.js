export function addMusicMachine(self) {
    const musicMachineGroup = self.musicMachineGroup;
    var audio = self.audio;
    musicMachineGroup.add(self.add.image(230, 680, 'retro-background'));
    musicMachineGroup.add(self.add.text(100, 550, '8 BIT MUSIC MACHINE', { fontSize: "24px", fill: "#ffffff" }));
    var songsArtists = ['Elvis Presley', 'Red Hot Chilli Peppers', 'Scorpions'];
    var songsNames = ['Can\'t Help Falling In Love', 'Californication', 'Still loving you'];
    var songs = ['elvis.mp3', 'californication.mp3', 'still-loving-you.mp3'];
    musicMachineGroup.add(self.add.image(525, 543, 'x-button').setScale(0.3).setInteractive()
    .on('pointerdown', () => {musicMachineGroup.clear(true);}));
    for (let i = 0; i < songsArtists.length; i++) {
        musicMachineGroup.add(self.add.text(0, 600 + i * 60, songsArtists[i], { fontSize: "20px", fill: "#ffffff" }));
        musicMachineGroup.add(self.add.text(0, 620 + i * 60, songsNames[i], { fontSize: "14px", fill: "#ffffff" }));
        musicMachineGroup.add(self.add.image(400, 620 + i * 60, 'background-button').setScale(1.3)
            .setInteractive().on('pointerdown', () => {
                if (audio) {
                    if (self.songNameText) {
                        self.songNameText.destroy();
                        self.songArtistText.destroy();
                        self.timeMusic.destroy();
                    }
                    audio.pause();
                }
                audio = new Audio(`assets/music/${songs[i]}`);
                audio.play();
                audio.volume = 0.2;
                self.songId = i;
                self.songNameText = self.add.text(100, 770, `${songsNames[self.songId]}`);
                musicMachineGroup.add(self.songNameText);
                self.songArtistText = self.add.text(100, 790, `${songsArtists[self.songId]}`);
                musicMachineGroup.add(self.songArtistText);
                if (self.noMusicText) self.noMusicText.setText('');
                self.timeMusic = self.add.text(0, 780, '0:00/0:00');
                musicMachineGroup.add(self.timeMusic);
            }));
        musicMachineGroup.add(self.add.text(380, 610 + i * 60, 'PLAY', { fontSize: "14px", fill: "#000000" }));
    }
    if (!audio) {
        self.noMusicText = self.add.text(100, 800, 'NO MUSIC PLAYING', { fontSize: "24px", fill: "#555555" });
        musicMachineGroup.add(self.noMusicText);
    }
    else {
        self.songNameText = self.add.text(100, 770, `${songsNames[self.songId]}`);
        musicMachineGroup.add(self.songNameText);
        self.songArtistText = self.add.text(100, 790, `${songsArtists[self.songId]}`);
        musicMachineGroup.add(self.songArtistText);
        self.noMusicText.setText('');
        self.timeMusic = self.add.text(0, 780, '0:10/3:00');
        musicMachineGroup.add(self.timeMusic);
    }
}