import { MainScene } from './scenes/mainScene.js';
import { PreloadScene } from './scenes/preloadScene.js';
import { GameUi } from './scenes/GameUi.js';
import { MicrophoneEnableScene } from './scenes/MicrophoneEnableScene.js';
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
  scene: [PreloadScene, MainScene, GameUi, MicrophoneEnableScene],
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