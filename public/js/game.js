import { MainScene } from './scenes/mainScene.js';
import { PreloadScene } from './scenes/preloadScene.js';
import { GameUi } from './scenes/GameUi.js';
import { MicrophoneEnableScene } from './scenes/MicrophoneEnableScene.js';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
const DEFAULT_WIDTH = 1280
const DEFAULT_HEIGHT = 720

const config = {
  parent: "gameDiv",
  dom: { createContainer: true },
  type: Phaser.AUTO,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  //pixelArt: true,
  scene: [PreloadScene, MainScene, GameUi, MicrophoneEnableScene],
  plugins: {
    scene: [{
        key: 'rexUI',
        plugin: UIPlugin,
        mapping: 'rexUI'
    },
    // ...
    ]
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})