const COLOR_PRIMARY = 0x25254d;
const COLOR_LIGHT = 0x323266;
const COLOR_DARK = 0x25254d;


var sizer;

export function buildVoiceChatPanel(self) {

    self.voiceChatPanel = self.rexUI.add.scrollablePanel({
        x: -30,
        y: 405,
        width: 310,
        height: 250,
        background: self.add.image(0, 0, 'inventory-panel'),
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
            text: self.add.text(0, 0, 'VOICE CHAT', {fontSize : '24px', fill: "#ffffff", fontFamily: 'PixelFont'}),
            space:{
                left: 110,
                bottom: 20,
                top: 20
            }
        }),
        space: {

            panel: 10,
            bottom: 20
        }

    }).setOrigin(0).layout()
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
            text: scene.add.text(0, 0, players[i].name, {
                fontSize: '24px',
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