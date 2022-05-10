const COLOR_PRIMARY = 0x25254d;
const COLOR_LIGHT = 0x323266;
const COLOR_DARK = 0x25254d;


var sizer;

export function buildVoiceChatPanel(self) {

    self.voiceChatPanel = self.rexUI.add.scrollablePanel({
        x: -10,
        y: 420,
        width: 210,
        height: 250,
        background: self.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),
        scrollMode: 0,
        panel: {
            child: createGrid(self),
            mask: {
                mask: true,
                padding: 1,
            }
        },
        mouseWheelScroller: {
            focus: false,
            speed: 0.1
        },
        header: self.rexUI.add.label({
            height: 30,
            background: self.rexUI.add.roundRectangle(0, 0, 20, 20, 10, COLOR_LIGHT),
            text: self.add.text(0, 0, 'VOICE CHAT', {fontSize : '25px', fill: "#ffffff", fontFamily: 'PixelFont'}),
            space:{
                left: 60,
                bottom: 3,
            }
        }),
        space: {

            panel: 10,
        }

    }).setOrigin(0).layout()
    //self.rexUI.add.roundRectangle(0, 380, 300, 200, 10, 0x323266).setOrigin(0);
    return;

    // CLEAR ALL PLAYER LIST
    self.playerNFTIcons.forEach(nft => {
        nft.destroy();
    });
    self.playerList.clear(true);

    const voiceChatText = self.add.text(1070, 50, 'PLAYERS IN VOICE CHAT', { fontSize: '23px', fill: "#ffffff", fontFamily: 'PixelFont', align: 'center' });
    self.playerList.add(voiceChatText);
    // ADD PLAYERS
    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        const playerNameText = player.name;
        self.playerList.add(self.add.image(1160, 120 + i * 65, "pixel-box").setScale(0.3, 0.3))
        if (player.nft) {
            const nft = player.nft;
            const dom = document.createElement('img');
            dom.src = nft;
            dom.style.width = '40px';
            dom.style.height = '40px';
            const playerNFT = self.add.dom(1160 - 60, 120 + i * 65, dom);
            self.playerNFTIcons.push(playerNFT);
            self.playerList.add(self.add.text(1160 - 38, 120 + i * 65 - 15, playerNameText, { fontSize: '24px', fill: "#fffffff", fontFamily: 'PixelFont' }));
            //console.log(player.name + " HAS NFT");
        } else {
            self.playerList.add(self.add.text(1160 - 70, 120 + i * 65 - 15, playerNameText, { fontSize: '24px', fill: "#fffffff", fontFamily: 'PixelFont' }));
        }
    }
}

var createGrid = function (scene) {
    // Create table body
    sizer = scene.rexUI.add.sizer({
        x: 0, y: 0,
        orientation: 'y',
        align: 'left',
        space: {
        }
    })

    return sizer;
}

export function updateVoiceChatPanel(self, players, playerName) {
    self.playerName = playerName;
    const scene = self;
    // remove all items from sizer
    sizer.removeAll(true);
    // add new items to sizer
    for (var i = 0; i < players.length; i++) {
        sizer.add(scene.rexUI.add.label({
            width: 210, height: 40,
            background: scene.rexUI.add.roundRectangle(0, 0, 250, 60, 10, COLOR_DARK).setStrokeStyle(2, COLOR_LIGHT),
            text: scene.add.text(0, 0, players[i].name, {
                fontSize: '25px',
                fontFamily: 'PixelFont',
                fill: "#ffffff"

            }),

            space: {
                left: 20,
                right: 10,
                top: 10,
                bottom: 10,
            },
            // icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 14, COLOR_PRIMARY),
        }));
    }
    sizer.layout();
    self.voiceChatPanel.layout();
}