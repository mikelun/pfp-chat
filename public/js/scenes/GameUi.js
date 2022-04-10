import Phaser from 'phaser'

import { sceneEvents } from '../Events/EventsCenter';
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
export class GameUi extends Phaser.Scene {
    constructor() {
        super({ key: "game-ui" });
    }

    create() {
        this.timer = 0;
        this.playerList = this.add.group();

        // get the game width and height
        const width = this.game.config.width;
        const height = this.game.config.height;
        for (let i = 0; i < 4; i++) {
            this.add.image(width / 3 + i * (width / 8), height * 0.90, 'player').setScale(2.5);
        }
        // this.add.image(150, height - 150, 'player').setScale(5);
        // this.add.image(150, height - 150, '1').setScale(0.5);
        // this.add.image(150, height -150, 'x').setScale(0.6).setAlpha(0.4);


        this.add.image(width / 3 + 0 * (width / 8), height * 0.90 - 5, '1').setScale(0.2).setInteractive()
            .on('pointerdown', () => {
                sceneEvents.emit('toggleMute');
            });
        this.microphoneIsWorking = this.add.image(width / 3 + 0 * (width / 8) - 3, height * 0.90 - 5, 'x').setScale(0.3).setAlpha(0.4);


        this.add.image(width / 3 + 1 * (width / 8), height * 0.90, '2').setScale(1.5).setInteractive()
            .on('pointerdown', () => {
                if (!this.scrollablePanel) {
                    var waitText = this.add.text(this.game.config.width / 2 - 160, this.game.config.height / 2 + 130, "YOUR NFTS ARE LOADING\nPLEASE WAIT", { fontSize: '32px', fill: '#ffffff', align: 'center' });
                    var timer = this.time.addEvent({
                        delay: 1300,                // ms
                        callback: () => {
                            waitText.destroy();
                        },
                        loop: false
                    });

                }
                else {
                    if (this.scrollablePanel.alpha == 0) {
                        this.scrollablePanel.alpha = 1;
                        this.closePanelButton.alpha = 1;
                    } else {
                        this.scrollablePanel.alpha = 0;
                        this.closePanelButton.alpha = 0;
                    }
                }
            });
        this.add.image(width / 3 + 2 * (width / 8), height * 0.90, '3').setScale(1.5);
        this.add.image(width / 3 + 3 * (width / 8), height * 0.90, '4').setScale(1.5);
        //this.add.image(120, 80, 'leaderboard-ui').setScale(0.7);
        for (let i = 0; i < 4; i++) {
            this.playerList.add(this.add.image(120, 60 + i * 65, "pixel-box").setScale(0.3, 0.3));
            this.playerList.add(this.add.text(50, 60 + i * 65 - 5, "Player" + i));
            this.playerList.add(this.add.image(180, 60 + i * 65, "microphoneMuted"));
        }
        this.playerList.clear(true);


        // SCENE EVENTS
        sceneEvents.on('microphone-toggled', this.handleMicrophoneStatus, this)

        sceneEvents.on('currentPlayers', this.updateCurrentPlayers, this);

        sceneEvents.on('newPlayerNFT', this.updateCurrentPlayers, this);

        this.addDomNFTs([]);
        //sceneEvents.on('getPlayerNFTs', this.addDomNFTs, this);
    }

    update(time, delta) {
        if (this.timer > 0) {
            this.timer -= delta;
            if (this.timer < 0) {
                this.addPanel(this.nfts);
                this.timer = 0;
            }
        }

    }

    handleMicrophoneStatus(status) {
        if (status) {
            this.microphoneIsWorking.alpha = 0;
        } else {
            this.microphoneIsWorking.alpha = 0.4;
        }
    }

    updateCurrentPlayers(players) {
        const self = this;
        this.playerList.clear(true);
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            this.playerList.add(this.add.image(120, 60 + i * 65, "pixel-box").setScale(0.3, 0.3))
            this.playerList.add(this.add.image(190, 60 + i * 65, player.microphoneStatus ? "microphone" : "microphoneMuted").setScale(0.7));
            if (player.nft) {
                const nft = player.nft;
                if (nft.image.startsWith("data")) {
                    if (!this.textures.exists(nft.name)) {
                         this.textures.addBase64(nft.name, nft.image);
                    } else {
                        showNFTOnPlayerList(nft);
                    }

                } else {
                    if (!this.textures.exists(nft.name)) {
                        this.load.image(nft.name, nft.image);
                    } else {
                        showNFTOnPlayerList(nft);
                    }
                }
                this.load.on('filecomplete', function (key, type, data) {
                    if (key == nft.name) {
                        showNFTOnPlayerList(nft);
                    }
                });
                this.textures.on('onload', () => {
                    if (this.textures.exists(nft.name)) {
                        showNFTOnPlayerList(nft);
                    }

                })

                
                function showNFTOnPlayerList(nft) {
                    const playerNFT = self.add.image(60, 60 + i * 65, nft.name);
                        playerNFT.setScale(40/playerNFT.width, 40/playerNFT.height);
                        self.playerList.add(playerNFT);
                }


                this.playerList.add(this.add.text(82, 60 + i * 65 - 5, player.name, { fontSize: '12px', fill: "#fffffff" }));
                //console.log(player.name + " HAS NFT");
            } else {
                this.playerList.add(this.add.text(50, 60 + i * 65 - 5, player.name, { fontSize: '12px', fill: "#fffffff" }));
            }
        }
    }

    updatePlayerStatus(status) {

    }

    addDomNFTs(nfts) {
        console.log("HERE");
        this.add.rectangle(675, 325, 800, 550, COLOR_PRIMARY);
        this.add.rectangle(675, 75, 800, 50, COLOR_DARK);
        this.add.text(590, 60, "YOUR NFTs", { fontSize: '32px', fill: '#ffffff' });
        for (let i = 0; i < 12; i++) {
            //this.add.rectangle(370 + (i % 4) * 200, 170 + (Math.floor(i / 4)) * 150, 100, 100, 0x333333);
            const dom = document.createElement('img');
            dom.src = "https://upload.wikimedia.org/wikipedia/commons/c/c1/Duck_on_Yeadon_Tarn_%2813th_November_2010%29_002.jpg";
            dom.style.width = "100px";
            dom.style.height = "100px";
            this.add.dom(370 + (i % 4) * 200, 170 + (Math.floor(i / 4)) * 150, dom);
            this.add.text(320 + (i % 4) * 200, 230 + (Math.floor(i / 4)) * 150, "NFT#" + i, { fontSize: '14px', fill: '#ffffff' });
        }
    }
    loadNfts(nfts) {
        console.log(nfts);
        const self = this;
        self.nfts = nfts;
        let k = 0;
        nfts.forEach(nft => {
            k++;
            // check substring svg
            if (nft.image.startsWith("data")) {
                this.textures.addBase64(nft.name, nft.image);
            } else {
                this.load.image(nft.name, nft.image);
            }

        });
        this.load.start();

        var countLoadedImages = 0;
        this.load.on('filecomplete', function (key, type, data) {
            self.timer = 1000;
        });
        this.textures.on('onload', () => {
            self.timer = 1000;
        })

    }

    addPanel(nfts) {
        nfts = nfts.filter(nft => this.textures.exists(nft.name));
        const self = this;
        
        self.scrollablePanel = self.rexUI.add.scrollablePanel({
            x: self.game.config.width / 2 + 25,
            y: 300,
            width: 500,
            height: 500,

            scrollMode: 0,

            background: self.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY),

            panel: {
                child: createGrid(self, 1, nfts.length, nfts),
                mask: {
                    mask: true,
                    padding: 1,
                }
            },

            slider: {
                track: self.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
                thumb: self.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
                // position: 'left'
            },

            mouseWheelScroller: {
                focus: false,
                speed: 0.1
            },
            header: self.rexUI.add.label({
                align: 'center',
                height: 30,
                orientation: 'vertical',
                background: self.rexUI.add.roundRectangle(0, 0, 20, 20, 10, COLOR_DARK),
                text: self.add.text(0, 0, 'Your NFTs', { fontSize: '18px', fill: "#ffffff" }),
            }),

            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,

                panel: 10,
                header: 10,
                footer: 10,
            }
        })
            .layout()
            self.closePanelButton = self.add.image(950, 85, 'x-button').setScale(0.5).setInteractive()
            .on('pointerdown', () => {
                self.scrollablePanel.alpha = 0;
                self.closePanelButton.alpha = 0;
            })
    }

}
var createGrid = function (scene, col, row, nfts) {
    var sizer = scene.rexUI.add.gridSizer({
        column: col,
        row: row,

        columnProportions: 1,
    })
    for (var i = 0; i < col; i++) {
        for (var j = 0; j < row; j++) {
            sizer.add(
                createItem(scene, i, j, nfts[i * row + j]), // child
                i, // columnIndex
                j, // rowIndex
                'center', // align
                0, // paddingConfig
                false, // expand
            )
        }
    }
    return sizer;
}

var createItem = function (scene, colIdx, rowIdx, nft) {
    console.log(scene.textures.exists(nft.name));
    var image = scene.add.image(0, 0, nft.name);
    image.setScale(150 / image.width, 150 / image.height);


    var item = scene.rexUI.add.label({
        orientation: "v",
        text: scene.add.text(0, 0, nft.name, {
            fontSize: 16
        }),
        icon: image,
        space: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20,

            icon: 20,
        }
    })
        .setDepth(3)
        item.setInteractive()
            .on('pointerdown', function () {
                sceneEvents.emit('nftSelected', nft);
            });
    return item;
}