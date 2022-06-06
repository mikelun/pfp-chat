export function addMusicMachine(self) {
    const musicMachineGroup = self.musicMachineGroup;
   
    musicMachineGroup.add(self.add.image(230, 680, 'retro-background'));
    musicMachineGroup.add(self.add.text(100, 550, '8 BIT MUSIC MACHINE', { fontSize: "24px", fill: "#ffffff" }));
    
    var songsArtists = ['Elvis Presley', 'Red Hot Chilli Peppers', 'Scorpions'];
    var songsNames = ['Can\'t Help Falling In Love', 'Californication', 'Still loving you'];
    var songs = ['elvis.mp3', 'californication.mp3', 'still-loving-you.mp3'];
    
    musicMachineGroup.add(self.add.image(525, 543, 'x-button').setScale(0.3).setInteractive()
        .on('pointerdown', () => { musicMachineGroup.clear(true); }));
    
        for (let i = 0; i < songsArtists.length; i++) {
        musicMachineGroup.add(self.add.text(0, 600 + i * 60, songsArtists[i], { fontSize: "20px", fill: "#ffffff" }));
        musicMachineGroup.add(self.add.text(0, 620 + i * 60, songsNames[i], { fontSize: "14px", fill: "#ffffff" }));
        musicMachineGroup.add(self.add.image(400, 620 + i * 60, 'background-button').setScale(1.3)
            .setInteractive().on('pointerdown', () => {

                // CHECK IF MUSIC IS PLAYING/STOPING
                if (self.audio) {
                    if (self.songNameText) {
                        self.songNameText.destroy();
                        self.songArtistText.destroy();
                        self.timeMusic.destroy();
                    }
                    self.audio.pause();
                }

                // SETTING UP SONG
                self.audio = new Audio(`assets/music/${songs[i]}`);
                self.audio.play();
                self.audio.volume = 0.2;

                // ADD SONG WRITER AND SONG TEXT
                self.songId = i;
                self.songNameText = self.add.text(100, 770, `${songsNames[self.songId]}`);
                musicMachineGroup.add(self.songNameText);
                self.songArtistText = self.add.text(100, 790, `${songsArtists[self.songId]}`);
                musicMachineGroup.add(self.songArtistText);

                //IF MUSIC DOESN'T PLAY SHOW INFO ABOUT IT
                if (self.noMusicText) self.noMusicText.setText('');

                // ADD TIME
                self.timeMusic = self.add.text(0, 780, '0:00/0:00');
                musicMachineGroup.add(self.timeMusic);

                self.pauseMusicText.setAlpha(1);
                self.pauseMusicBackground.setAlpha(1);
            }));
        musicMachineGroup.add(self.add.text(380, 610 + i * 60, 'PLAY', { fontSize: "14px", fill: "#000000" }));
    }
    // Add button to pause music
    self.pauseMusicBackground = self.add.image(420, 800, 'background-button').setScale(1.3).setAlpha(self.audio ? 1 : 0);
    musicMachineGroup.add(self.pauseMusicBackground);
    self.pauseMusicText = self.add.text(398, 790, 'PAUSE', { fontSize: "14px", fill: "#000000" }).setAlpha(self.audio ? 1 : 0).setInteractive().
        on('pointerdown', () => {
            if (self.audio) {
                if (self.audio.paused) {
                    self.audio.play();
                } else {
                    self.audio.pause();
                }
            }
        });
    
    musicMachineGroup.add(self.pauseMusicText);

    if (!self.audio) {
        self.noMusicText = self.add.text(100, 800, 'NO MUSIC PLAYING', { fontSize: "24px", fill: "#555555" });
        musicMachineGroup.add(self.noMusicText);
    }
    else {
        self.pauseMusicText.setAlpha(1);
        self.pauseMusicBackground.setAlpha(1);

        self.songNameText = self.add.text(100, 770, `${songsNames[self.songId]}`);
        musicMachineGroup.add(self.songNameText);
        self.songArtistText = self.add.text(100, 790, `${songsArtists[self.songId]}`);
        musicMachineGroup.add(self.songArtistText);
        self.noMusicText.setText('');
        self.timeMusic = self.add.text(0, 780, '0:10/3:00');
        musicMachineGroup.add(self.timeMusic);
    }
}