import { MainScene } from './scenes/mainScene.js';
import { PreloadScene } from './scenes/preloadScene.js';
import { GameUi } from './scenes/GameUi.js';
import { MicrophoneEnableScene } from './scenes/MicrophoneEnableScene.js';
const DEFAULT_WIDTH = 1280
const DEFAULT_HEIGHT = 720

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#000000',
  parent: 'phaser-container',
  dom: {
    createContainer: true
  },
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, MainScene, GameUi, MicrophoneEnableScene ],
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