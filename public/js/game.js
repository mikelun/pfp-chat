import { MainScene } from './scenes/mainScene.js';
import { PreloadScene } from './scenes/preloadScene.js';
import { GameUi } from './scenes/GameUi.js';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { StartScene } from './scenes/StartScene.js';
const DEFAULT_WIDTH = 1280
const DEFAULT_HEIGHT = 720

const config = {
  // loader: {
  //   baseURL: './',
  // },
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
  pixelArt: true,
  scene: [PreloadScene, MainScene, GameUi, StartScene],
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
      debug: true,
      gravity: { y: 0 }
    }
  },
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
