import BBCodeText from "phaser3-rex-plugins/plugins/bbcodetext";
import { TextEdit } from "phaser3-rex-plugins/plugins/textedit";
import { sceneEvents } from "../../Events/EventsCenter";
import { blockMovement, unblockMovement } from "../../utils/utils";
import { makeButtonInteractive } from "./lowButttons";
import CircleMaskImage from 'phaser3-rex-plugins/plugins/circlemaskimage.js';

/*
        _..._
      .'     '.      _
     /    .-""-\   _/ \
   .-|   /:.   |  |   |
   |  \  |:.   /.-'-./
   | .-'-;:__.'    =/
   .'=  *=|ILON _.='
  /   _.  |    ;
 ;-.-'|    \   |
/   | \    _\  _\
\__/'._;.  ==' ==\
         \    \   |
         /    /   /
         /-._/-._/
         \   `\  \
          `-._/._/
*/
var backgroundSelectMap, addIcon, mapName, mapImage;

var self;

var selectedMapId;

var defaultText = 'WHAT DO YOU WANT TO TALK ABOUT?';

var spacePanelGroup, selectMapGroup;
export function initialiezeSpacePanel(newSelf) {
    self = newSelf;

    spacePanelGroup = self.add.group();
    selectMapGroup = self.add.group();

    createSpacePanel();

    spacePanelGroup.setVisible(false);
    selectMapGroup.setVisible(false);
}

function createSpacePanel() {
    var panel = self.add.image(650, 320, 'shop-panel').setScale(2.5);
    var delta = 10;

    var closeButton = self.add.image(panel.x + 275, 90, 'close-button').setScale(2).setAlpha(0.8);
    makeButtonInteractive(closeButton, '', 25, -15, true);
    closeButton.on('pointerdown', function () {
        spacePanelGroup.setVisible(false);
        selectMapGroup.setVisible(false);
    });

    var heading = self.add.text(panel.x - 5, panel.y - 180, 'CREATE YOUR SPACE', { fontFamily: 'PixelFont', fontSize: '45px', color: '#ffffff' }).setOrigin(0.5);

    var text1 = self.add.text(panel.x - 275, panel.y - 100 + delta, 'NAME YOUR SPACE', { fontFamily: 'PixelFont', fontSize: '35px', color: '#ffffff' }).setOrigin(0);

    mapName = self.add.text(panel.x - 275, panel.y + 10 + delta, 'SELECT MAP', { fontFamily: 'PixelFont', fontSize: '35px', color: '#ffffff' }).setOrigin(0);

    var editSpaceNameText = createEditText();

    backgroundSelectMap = self.rexUI.add.roundRectangle(430, 430, 120, 90, 10, 0x121A2B).setAlpha(0.8);
    addIcon = self.add.image(backgroundSelectMap.x, backgroundSelectMap.y, 'add-icon').setScale(0.8).setTint(0x888888);

    makeButtonInteractive(backgroundSelectMap, '', 0, 0);
    backgroundSelectMap.on('pointerdown', () => {
        createSelectMap();
    });

    const startNowButton = createStartNowButton(panel.x + 150, panel.y + 160 + delta);
    makeButtonInteractive(startNowButton, '', 10, 10);
    startNowButton.on('pointerdown', () => {
        if (!selectedMapId || !editSpaceNameText.text || editSpaceNameText.text === defaultText) {
            sceneEvents.emit('createErrorMessage', 'Please fill all fields');
            return;
        }

        sceneEvents.emit('createSpace', {
            name: editSpaceNameText.text,
            mapId: selectedMapId
        });

        sceneEvents.emit('createLoader', 'Creating your space...');

        spacePanelGroup.setVisible(false);
        editSpaceNameText.setText('');
    });

    //createSelectMap();

    spacePanelGroup.add(panel);
    spacePanelGroup.add(closeButton);
    spacePanelGroup.add(heading);
    spacePanelGroup.add(text1);
    spacePanelGroup.add(mapName);
    spacePanelGroup.add(editSpaceNameText);
    spacePanelGroup.add(backgroundSelectMap);
    spacePanelGroup.add(addIcon);
    spacePanelGroup.add(startNowButton);
}

export function setVisibleSpacePanel() {
    spacePanelGroup.setVisible(true);
}

function mapSelected(data) {
    addIcon.destroy();
    if (mapImage) mapImage.destroy();

    mapImage = new CircleMaskImage(self, 430, 430, data.texture, {
        maskType: 'roundRectangle',
        radius: 50,
    });
    // set size 120x90
    mapName.setText("MAP: " + data.name);
    mapImage.setScale(120 / mapImage.width, 90 / mapImage.height);
    self.add.existing(mapImage);

    spacePanelGroup.add(mapImage);

    selectedMapId = data.mapId;
}

function clearGroup(group) {
    group.getChildren().forEach(function (child) {
        child.setVisible(false);
    });
    group.getChildren().forEach(function (child) {
        child.destroy();
    });
    group.getChildren().forEach(function (child) {
        if (child.clear) child.clear(true);
    });
    group.clear(true);
}


function createEditText() {
    var editTextBackground = self.rexUI.add.roundRectangle(630, 290 + 10, 520, 50, 10, 0x121A2B);

    var editNameText = self.rexUI.add.BBCodeText(editTextBackground.x, editTextBackground.y - 3, defaultText, {
        color: '#FFFFFF',
        fontSize: '35px',
        fixedWidth: 510,
        fixedHeight: 50,
        valign: 'center',
        fontFamily: 'PixelFont',
    }).setOrigin(0.5).setAlpha(0.6)

    editTextBackground.setInteractive()
    .on('pointerdown', function () {

        var config = {
            selectAll: true,
            onOpen: function (edit) {
                editNameText.setAlpha(1);
                blockMovement();
                //self.tipsText.alpha = 0;
            },
            onTextChanged: function (editNameText, text) {
                editNameText.text = text;
            },
            onClose: function (editNameText) {
                unblockMovement();
            },
            // enterClose: false
        }
        var editor = new TextEdit(editNameText);
        editor.open(config);
    });

    spacePanelGroup.add(editTextBackground);
    spacePanelGroup.add(editNameText);

    return editNameText;


}

function createStartNowButton(x, y) {
    const startNowButton = self.rexUI.add.label({
        x: x, y: y,
        background: self.rexUI.add.roundRectangle(0, 0, 2, 2, 10, 0x121A2B).setStrokeStyle(2, 0x242A3B),
        text: self.add.text(0, 0, 'START NOW', { fontFamily: 'PixelFont', fontSize: '35px', color: '#ffffff' }).setOrigin(0.5),
        space: {
            left: 30,
            right: 30,
            top: 10,
            bottom: 17
        }
    }).layout().setAlpha(0.8);

    spacePanelGroup.add(startNowButton);

    return startNowButton;
}

function createSelectMap() {
    selectMapGroup.clear(true);

    var panel = self.add.image(1320, 360, 'cell-info').setScale(5, 4.8);

    var header = self.add.text(1130, 50, 'SELECT MAP', { fontFamily: 'PixelFont', fontSize: '45px', color: '#ffffff' }).setOrigin(0.5);

    // // add scroll panel
    // var scroll = self.rexUI.add.scrollablePanel({
    //     x: 1180,
    //     y: 300,
    //     width: 310,
    //     height: 500,
    //     scrollMode: 0,
    //     mouseWheelScroller: {
    //         focus: false,
    //         speed: 0.1
    //     },
    //     panel: {
    //         child: createGrid(),
    //     }
    // }).layout().setOrigin(0, 0);


    addRoomImage(1130, 200 + 0 * 220, {texture: 'room1', name: 'CONFERENCE ROOM', mapId: 10});
    addRoomImage(1130, 200 + 1 * 220, {texture: 'room2', name: 'ISLAND', mapId: 3});

    selectMapGroup.add(panel);
    selectMapGroup.add(header);

    // for (let i = 0; i < 3; i++) {
    //     sizer.add(self.add.text(1130, 200 + i * 220 + 100, 'HELLO', { fontFamily: 'PixelFont', fontSize: '35px', color: '#ffffff' }));
    // }


    //var room1 =  self.add.image(300, 300, 'room1').setScale(0.5);
}

function createGrid() {
    sizer = self.rexUI.add.sizer({
        x: 0, y: 0,
        orientation: 'y',
        align: 'left',
        space: {
            item: 20,
        }
    });
    return sizer;
}

function addRoomImage(x, y, data) {
    var image = new CircleMaskImage(self, x, y, data.texture, {
        maskType: 'roundRectangle',
        radius: 50,
    });
    self.add.existing(image);
    image.setScale(0.25).setAlpha(0.8);
    makeButtonInteractive(image, '', 0, 0);

    var text = self.add.text(image.x, image.y + 100, data.name, { fontFamily: 'PixelFont', fontSize: '25px', color: '#ffffff' }).setOrigin(0.5);

    selectMapGroup.add(image);
    selectMapGroup.add(text);

    image.on('pointerdown', () => {
        mapSelected(data);
        selectMapGroup.clear(true);
    });


}