export var addTextBox = function (scene, message) {
    return scene.rexUI.add.textBox({
        x: 0,
        y: 0,
        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 5, 0x333366)
            .setStrokeStyle(2, 0x000033).setAlpha(0.5),

        // text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
        text: scene.rexUI.add.BBCodeText(0, 0, message, {
            wrap: {
                mode: 'word',
                width:  600,
            },
            fontSize: '25px',
            fill: "#ffffff",
            fontFamily: 'PixelFont',
            maxLines: 5
        }),

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
        }
    }).setOrigin(0).layout();
};