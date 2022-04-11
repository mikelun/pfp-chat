import { addMusicMachine } from '../scenes/scene-elements/music-machine';

export function addIframeGameAndMusicMachine(self) {
    function addUpstairsGame() {
        const iframe = document.createElement('iframe');
        iframe.src = "https://funhtml5games.com/pacman/index.html";
        iframe.style.width = "350px";
        iframe.style.height = "370px";
        self.drawBattle = self.add.dom(230, 670, iframe);
        cancelButton = self.add.image(535, 440, 'x-button').setScale(0.3).setInteractive().on('pointerdown', () => {
            self.drawBattle.destroy();
            self.drawBattle = null;
            cancelButton.destroy();
        });
    }

    self.drawbattleGroup = self.add.group();

    var keyIframe = self.input.keyboard.addKey('X');  // Get key object
    keyIframe.on('down', function (event) {
        if (self.drawbattleGroup.getChildren().length) {
            if (!self.drawBattle) addUpstairsGame();
            else {
                self.drawBattle.destroy();
                self.drawBattle = null;
                cancelButton.destroy();
            }
        }
        if (self.musicMachineShadowGroup.getChildren().length) {
            if (!(self.musicMachineGroup.getChildren().length > 0)) {
                addMusicMachine(self);
            } else {
                self.musicMachineGroup.clear(true);
            }
        }


    });
}

