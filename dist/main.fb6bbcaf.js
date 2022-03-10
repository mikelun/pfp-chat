// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/audioSocket.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initiateAudio = initiateAudio;
exports.removePeer = removePeer;

/**
 * RTCPeerConnection configuration 
 */
var configuration = {
  // Using From https://www.metered.ca/tools/openrelay/
  "iceServers": [{
    urls: "stun:openrelay.metered.ca:80"
  }, {
    urls: "turn:openrelay.metered.ca:80",
    username: "openrelayproject",
    credential: "openrelayproject"
  }, {
    urls: "turn:openrelay.metered.ca:443",
    username: "openrelayproject",
    credential: "openrelayproject"
  }, {
    urls: "turn:openrelay.metered.ca:443?transport=tcp",
    username: "openrelayproject",
    credential: "openrelayproject"
  }]
};
var peers;
var socket; // Initialize audio stream for socket

function initiateAudio(_socket, _peers) {
  peers = _peers;
  socket = _socket;
  socket.on('initReceive', function (socket_id) {
    console.log('INIT RECEIVE ' + socket_id);
    addPeer(socket_id, false);
    socket.emit('initSend', socket_id);
  });
  socket.on('initSend', function (socket_id) {
    console.log('INIT SEND ' + socket_id);
    addPeer(socket_id, true);
  });
  socket.on('removePeer', function (socket_id) {
    console.log('removing peer ' + socket_id);
    removePeer(socket_id);
  });
  socket.on('signal', function (data) {
    peers[data.socket_id].signal(data.signal);
  });
}

function addPeer(socket_id, am_initiator, localStream) {
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  }).then(function (stream) {
    var localStream = stream;
    console.log('EOO' + localStream);
    peers[socket_id] = new SimplePeer({
      initiator: am_initiator,
      stream: localStream,
      config: configuration
    });
    peers[socket_id].on('signal', function (data) {
      socket.emit('signal', {
        signal: data,
        socket_id: socket_id
      });
    });
    peers[socket_id].on('stream', function (stream) {
      console.log('Was here');
      var newVid = document.createElement('video');
      newVid.srcObject = stream;
      newVid.id = socket_id;
      newVid.playsinline = false;
      newVid.autoplay = true;
      newVid.className = "vid"; // append newVid to body

      document.body.appendChild(newVid);
    });
    /**
     * Enable/disable microphone
     */

    function toggleMute() {
      console.log("Microphone has been toggled");

      for (var index in localStream.getAudioTracks()) {
        localStream.getAudioTracks()[index].enabled = !localStream.getAudioTracks()[index].enabled;
        muteButton.innerText = localStream.getAudioTracks()[index].enabled ? "Unmuted" : "Muted";
      }
    }

    window.toggleMute = toggleMute;
  });
}

function removePeer(socket_id) {
  var videoEl = document.getElementById(socket_id);

  if (videoEl) {
    var tracks = videoEl.srcObject.getTracks();
    tracks.forEach(function (track) {
      track.stop();
    });
    videoEl.srcObject = null;
    videoEl.parentNode.removeChild(videoEl);
  }

  if (peers[socket_id]) peers[socket_id].destroy();
  delete peers[socket_id];
}
},{}],"js/playerSocket.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializePlayersSocket = initializePlayersSocket;

function initializePlayersSocket(self, peers) {
  self.otherPlayers = self.physics.add.group();
  self.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id]);
      } else {
        addOtherPlayers(self, players[id]);
      }
    });
  });
  self.socket.on('newPlayer', function (playerInfo) {
    addOtherPlayers(self, playerInfo);
  });
  self.socket.on('playerMoved', function (playerInfo) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
        otherPlayer.setRotation(playerInfo.rotation);
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
      }
    });
  }); // DISCONNECT FUNCTION ONLY HERE
  // self.socket.on('disconnected', function (playerId) {
  //     console.log('disconnected');
  //     self.otherPlayers.getChildren().forEach(function (otherPlayer) {
  //     if (playerId === otherPlayer.playerId) {
  //         otherPlayer.destroy();
  //     }
  //     });
  //     for (let socket_id in peers) {
  //         removePeer(socket_id)
  //     }
  // });
}

function addPlayer(self, playerInfo) {
  self.sprite = self.physics.add.sprite(400, 400, "characters", 0).setSize(22, 33).setOffset(23, 27).setScale(0.5);
  var test = self.add.sprite(400, 400, "characters0", 0).setSize(22, 33);
  createAnims(self);
  test.anims.play("hero-walk-down");
  self.sprite.anims.play("player-walk-back");
  self.cameras.main.startFollow(self.sprite, true);
  self.cameras.main.setBounds(0, 0, 1000, 1000); // Change texts
  //playerName = self.add.text(self.sprite.x, self.sprite.y, "player", { fontSize: '20px', color: '#ffffff' });
}

function addOtherPlayers(self, playerInfo) {
  var otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, "characters", 0).setScale(0.5); //const otherPlayerName = self.add.text(playerInfo.x, playerInfo.y, playerInfo.account, { fontSize: '20px', color: '#ffffff' });

  otherPlayer.anims.play("player-walk");
  otherPlayer.playerId = playerInfo.playerId;
  self.otherPlayers.add(otherPlayer); // const camera  = this.cameras.main;
  // camera.setBounds(0, 0, 1400, 1400);
}

function createAnims(self) {
  var anims = self.anims;
  anims.create({
    key: "hero-walk-down",
    frames: anims.generateFrameNumbers("characters0", {
      start: 0,
      end: 2
    }),
    frameRate: 8,
    repeat: -1
  });
}
},{}],"js/main.js":[function(require,module,exports) {
"use strict";

var _audioSocket = require("./audioSocket");

var _playerSocket = require("./playerSocket");

/**
 * Socket.io socket
 */
var socket;
/**
 * All peer connections
 */

var peers = {}; /////////// PHASER 3 CONFIG ///////////

var config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser-example',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {
        y: 0
      }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
var game = new Phaser.Game(config); // KEYS

var keyUp, keyDown, keyLeft, keyRight; // BACKGROUND

var map;

function preload() {
  for (var i = 0; i < 4; i++) {
    this.load.spritesheet("characters".concat(i), "assets/Other/".concat(i, ".png"), {
      frameWidth: 32,
      frameHeight: 32,
      margin: 0,
      spacing: 0
    });
  }

  this.load.image('tiles', 'assets/tiles/indoors.png');
  this.load.tilemapTiledJSON('dungeon', 'assets/tiles/mainmap.json');
  this.load.spritesheet("characters", "assets/characterSprite.png", {
    frameWidth: 64,
    frameHeight: 64,
    margin: 1,
    spacing: 2
  });
  this.load.image('map', 'assets/mainMap.jpeg');
  this.load.image('sprite', 'assets/spaceShips_001.png');
  this.load.image('star', 'assets/star_gold.png');
  keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
}

function create() {
  var _this = this;

  this.cameras.main.setZoom(3); // create button

  var button = document.createElement('div');
  button.className = 'button';
  button.innerText = 'muted';
  this.add.dom(100, 100, button);
  var dungeon = this.make.tilemap({
    key: 'dungeon'
  });
  var tileset = dungeon.addTilesetImage('indoors', 'tiles');
  dungeon.createStaticLayer('background', tileset);
  dungeon.createStaticLayer('structure', tileset); //map = this.add.image(526, 495, 'map');
  //map.setScale(2.1);
  // ANIMS

  var anims = this.anims;
  anims.create({
    key: "player-walk",
    frames: anims.generateFrameNumbers("characters", {
      start: 46,
      end: 49
    }),
    frameRate: 16,
    repeat: -1
  });
  anims.create({
    key: "player-walk-back",
    frames: anims.generateFrameNumbers("characters", {
      start: 65,
      end: 68
    }),
    frameRate: 16,
    repeat: -1
  });
  var self = this;
  this.socket = io('ws://localhost:3000');
  socket = this.socket; // Initialize audio stream for socket

  (0, _audioSocket.initiateAudio)(socket, peers); // Initialize player socket

  (0, _playerSocket.initializePlayersSocket)(self, peers);
  socket.on('disconnected', function (socket_id) {
    console.log('disconnected');

    _this.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (socket_id === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    });

    for (var _socket_id in peers) {
      (0, _audioSocket.removePeer)(_socket_id);
    }
  });
}

var spriteSpeed = 2;

function update() {
  if (this.sprite) {
    var sprite = this.sprite;

    if (keyUp.isDown) {
      sprite.y -= spriteSpeed; //this.sprite.rotation = -3.14;
    }

    if (keyDown.isDown) {
      sprite.y += spriteSpeed; //this.sprite.rotation = 0;
    }

    if (keyLeft.isDown) {
      sprite.x -= spriteSpeed; //this.sprite.rotation = 3.14 / 2;

      sprite.setFlipX(true);
    }

    if (keyRight.isDown) {
      sprite.x += spriteSpeed; //this.sprite.rotation = -3.14 / 2;

      sprite.setFlipX(false);
    }

    if (keyLeft.isDown || keyRight.isDown || keyDown.isDown) {
      sprite.anims.play("player-walk", true);
    } else if (keyUp.isDown) {
      sprite.anims.play("player-walk-back", true);
    } else {
      sprite.anims.stop();
    } // emit player movement


    var x = this.sprite.x;
    var y = this.sprite.y;
    var r = this.sprite.rotation;

    if (this.sprite.oldPosition && (x !== this.sprite.oldPosition.x || y !== this.sprite.oldPosition.y || r !== this.sprite.oldPosition.rotation)) {
      this.socket.emit('playerMovement', {
        x: this.sprite.x,
        y: this.sprite.y,
        rotation: this.sprite.rotation
      });
    } // save old position data


    this.sprite.oldPosition = {
      x: this.sprite.x,
      y: this.sprite.y,
      rotation: this.sprite.rotation
    };
  }
}
},{"./audioSocket":"js/audioSocket.js","./playerSocket":"js/playerSocket.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53794" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/main.js"], null)
//# sourceMappingURL=/main.fb6bbcaf.js.map