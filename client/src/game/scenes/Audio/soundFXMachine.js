/*
                     /|
       =  =  =      / |
  ____| || || |____/  | -_-_-_-_-_-_
|)----| || || |____   |     AH
  ((  | || || |  ))\  | _-_-_-_-_-_-
   \\_|_||_||_|_//  \ |
    \___________/    \|
*/

export function playShotSound(self, type) {
    self.sound.play('gun2', { volume: 0.2 });
}


export function playExplosionSound(self, type) {
    self.sound.play('explosion1', { volume: 1 });
}

export function playMoneySound(self, type) {
    self.sound.play('coin1', { volume: 0.5 });
}