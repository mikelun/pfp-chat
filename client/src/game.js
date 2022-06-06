import { MainScene } from './game/scenes/mainScene.js';
import { PreloadScene } from './game/scenes/preloadScene.js';
import { GameUi } from './game/scenes/GameUi.js';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { StartScene } from './game/scenes/StartScene.js';
import Phaser from 'phaser';
const DEFAULT_WIDTH = 1280
const DEFAULT_HEIGHT = 720

/*
 ________  ________ ________  ________  ___  ___  ________  _________   
|\   __  \|\  _____\\   __  \|\   ____\|\  \|\  \|\   __  \|\___   ___\ 
\ \  \|\  \ \  \__/\ \  \|\  \ \  \___|\ \  \\\  \ \  \|\  \|___ \  \_| 
 \ \   ____\ \   __\\ \   ____\ \  \    \ \   __  \ \   __  \   \ \  \  
  \ \  \___|\ \  \_| \ \  \___|\ \  \____\ \  \ \  \ \  \ \  \   \ \  \ 
   \ \__\    \ \__\   \ \__\    \ \_______\ \__\ \__\ \__\ \__\   \ \__\
    \|__|     \|__|    \|__|     \|_______|\|__|\|__|\|__|\|__|    \|__|                                                           
                        ░█▀▀▄░░░░░░░░░░░▄▀▀█
                        ░█░░░▀▄░▄▄▄▄▄░▄▀░░░█
                        ░░▀▄░░░▀░░░░░▀░░░▄▀
                        ░░░░▌░▄▄░░░▄▄░▐▀▀
                        ░░░▐░░█▄░░░▄█░░▌▄▄▀▀▀▀█
                        ░░░▌▄▄▀▀░▄░▀▀▄▄▐░░░░░░█
                        ▄▀▀▐▀▀░▄▄▄▄▄░▀▀▌▄▄▄░░░█
                        █░░░▀▄░█░░░█░▄▀░░░░█▀▀▀
                        ░▀▄░░▀░░▀▀▀░░▀░░░▄█▀
                        ░░░█░░░░░░░░░░░▄▀▄░▀▄
                        ░░░█░░░░░░░░░▄▀█░░█░░█
                        ░░░█░░░░░░░░░░░█▄█░░▄▀
                        ░░░█░░░░░░░░░░░████▀
                        ░░░▀▄▄▀▀▄▄▀▀▄▄▄█▀
*/
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
      debug: false,
      gravity: { y: 0 }
    }
  },
}

export const game = new Phaser.Game(config)
