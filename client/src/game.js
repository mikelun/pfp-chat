import Phaser from 'phaser';
import { MainScene} from './game/scenes/MainScene'
import { PreloadScene} from './game/scenes/PreloadScene'

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
  type: Phaser.AUTO,
  parent: 'phaser-container',
  backgroundColor: '#332882',
  pixelArt: true, // Prevent pixel art from becoming blurred when scaled.
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  autoFocus: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: [PreloadScene, MainScene],
}

export const game = new Phaser.Game(config)
