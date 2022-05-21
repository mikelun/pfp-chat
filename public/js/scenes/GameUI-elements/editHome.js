import { sceneEvents } from "../../Events/EventsCenter";
import { hideAllButtons, makeButtonInteractive, showAllButtons } from "./lowButttons";

var height, width;
var closeButton, buildButton, removeButton;

var editHomeGroup, objectsPanelGroup;
var self;

var objectsPanel;


var tileObjects = [298, 439, 438, 470, 471, 472, 649, 364, 330, 331, 297, 512, 513, 514, 515];
export function editHome(newSelf) {
    self = newSelf;

    height = self.sys.game.config.height;
    width = self.sys.game.config.width;

    editHomeGroup = self.add.group();
    objectsPanelGroup = self.add.group();

    // hide low buttons
    hideAllButtons();

    closeButton = self.add.image(1150, 100, 'close-button').setScale(4).setAlpha(0.5);

    makeButtonInteractive(closeButton, '', 0, 40);

    closeButton.on('pointerdown', () => {
        showAllButtons()
        closeButton.destroy();
        editHomeGroup.clear(true);
        objectsPanel.destroy();
    });

    buildButton = self.add.image(width / 2 - 50, height * 0.90, 'build-button').setScale(2).setAlpha(0.8);
    makeButtonInteractive(buildButton, 'BUILD', 0, 40);
    buildButton.on('pointerdown', () => {
        if (objectsPanel && objectsPanel.visible) {
            objectsPanel.setVisible(false);
            buildButton.selected = false;
            buildButton.setAlpha(0.8);
        } else {
            objectsPanel.setVisible(true);
            buildButton.selected = true;
            buildButton.setAlpha(1);
        }
    })
    removeButton = self.add.image(width / 2 + 50, height * 0.90, 'remove-button').setScale(2).setAlpha(0.8);
    makeButtonInteractive(removeButton, 'REMOVE', 0, 40);

    removeButton.on('pointerdown', () => {
        objectsPanel.setVisible(false);
        sceneEvents.emit('start-remove');
    });


    editHomeGroup.add(closeButton);
    editHomeGroup.add(buildButton);
    editHomeGroup.add(removeButton);

    createObjectsPanel();
}


function createObjectsPanel() {
    //var backgroundPanel = self.add.image(width / 2, height / 2 - 30, 'cell-info').setScale(3, 3);

    objectsPanel = self.rexUI.add.scrollablePanel({
        x: width / 2,
        y: height / 2 - 30,
        width: 400,
        height: 400,
        scrollMode: 0,
        background: self.add.image(0, 0, 'cell-info').setScale(3, 3),
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
        space: {
            top: 20,
            bottom: 20
        }

    }).layout();

    objectsPanel.setChildrenInteractive().on('child.click', function (child)  {
        var index = child.children[2].frame.name;
        objectsPanel.setVisible(false);
        sceneEvents.emit('start-build', index);
    });
    
    objectsPanel.setVisible(false);

}

function createGrid() {
    var sizer = self.rexUI.add.fixWidthSizer({
        space: {
            left: 30,
            right: 20,
        },
    });

    for (var i = 0; i < tileObjects.length; ++i) {
        sizer.add(self.rexUI.add.label({
            width: 110, height: 110,

            background: self.add.image(0, 0, 'cell-panel'),
            icon: self.add.sprite(0, 0, 'spritesheet-TilemapDay').setFrame(tileObjects[i]).setScale(2),
            align: 'center',
            space: {
                left: 5,
                right: 10,
                top: 0,
                bottom: 15,
            }
        })).layout();
    }

    return sizer;
}