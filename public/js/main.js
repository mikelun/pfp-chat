
/**
 * Socket.io socket
 */
let socket;

/**
 * The stream object used to send media
 */
let localStream = null;

/**
 * All peer connections
 */
let peers = {};


/////////// PHASER 3 CONFIG ///////////
var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 400,
        height: 250,
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity: { y: 0 }
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    },
};

var game = new Phaser.Game(config);

// KEYS
var keyUp, keyDown, keyLeft, keyRight;


// BACKGROUND
var map;


function preload() {
    for (let i = 0; i < 4; i++) {
        this.load.spritesheet(`characters${i}`, 
        `assets/Other/${i}.png`,
        {
        frameWidth: 32,
        frameHeight: 32,
        margin: 0,
        spacing: 0
      });
    }
    this .load.image('tiles', 'assets/tiles/indoors.png');
    this.load.tilemapTiledJSON('dungeon', 'assets/tiles/mainmap.json');
    this.load.spritesheet(
      "characters",
      "assets/characterSprite.png",
      {
        frameWidth: 64,
        frameHeight: 64,
        margin: 1,
        spacing: 2
      }
    );
  
    this.load.image('map', 'assets/mainMap.jpeg');
  
  
    this.load.image('sprite', 'assets/spaceShips_001.png');
  
    this.load.image('star', 'assets/star_gold.png');
    keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
}


function create() {

    // create button
    const button = document.createElement('div');
    button.className = 'button';
    button.innerText = 'muted';
    this.add.dom(100, 100, button);

    const dungeon = this.make.tilemap({ key: 'dungeon' });
    const tileset = dungeon.addTilesetImage('indoors', 'tiles');

    dungeon.createStaticLayer('background', tileset);
    dungeon.createStaticLayer('structure', tileset);
    //map = this.add.image(526, 495, 'map');
    //map.setScale(2.1);

    navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(stream => {
        console.log('got stream');
        localStream = stream;  
    });

    // ANIMS
    const anims = this.anims;
    anims.create({
        key: "player-walk",
        frames: anims.generateFrameNumbers("characters", { start: 46, end: 49 }),
        frameRate: 16,
        repeat: -1
    });
    anims.create({
        key: "player-walk-back",
        frames: anims.generateFrameNumbers("characters", { start: 65, end: 68 }),
        frameRate: 16,
        repeat: -1
    });
    
    
    



    var self = this;
    this.socket = io();
    socket = this.socket;

    // Initialize audio stream for socket
    initiateAudio(socket);
    
    // Initialize player socket
    initializePlayersSocket(self);

} 

const spriteSpeed = 2;

function update() {
    if (this.sprite) {

      var sprite = this.sprite;
      if (keyUp.isDown) {
        sprite.y -= spriteSpeed;
        //this.sprite.rotation = -3.14;
      }
      if (keyDown.isDown) {
        sprite.y += spriteSpeed;
        //this.sprite.rotation = 0;
      }
      if (keyLeft.isDown) {
        sprite.x -= spriteSpeed;
        //this.sprite.rotation = 3.14 / 2;
        sprite.setFlipX(true);
      }
      if (keyRight.isDown) {
        sprite.x += spriteSpeed;
        //this.sprite.rotation = -3.14 / 2;
        sprite.setFlipX(false);
      }
  
      if (keyLeft.isDown || keyRight.isDown || keyDown.isDown) {
        sprite.anims.play("player-walk", true);
      } else if (keyUp.isDown) {
        sprite.anims.play("player-walk-back", true);
      } else {
        sprite.anims.stop();
      }
  

      // emit player movement
      var x = this.sprite.x;
      var y = this.sprite.y;
      var r = this.sprite.rotation;
      if (this.sprite.oldPosition && (x !== this.sprite.oldPosition.x || y !== this.sprite.oldPosition.y || r !== this.sprite.oldPosition.rotation)) {
        this.socket.emit('playerMovement', { x: this.sprite.x, y: this.sprite.y, rotation: this.sprite.rotation });
      }
      // save old position data
      this.sprite.oldPosition = {
        x: this.sprite.x,
        y: this.sprite.y,
        rotation: this.sprite.rotation
      };
    }
  }



