export function buildshipLevel2(self, Moralis) {
    // MAKE GROUP FOR LEVEL
    self.levelGroup = self.add.group();

    self.buildship = self.add.image(700, 600, 'buildship').setScale(0.3);
    self.fire = self.add.sprite(100, 100, 'blue-fire').setRotation(-3.14 / 4 + 3 * 3.14 / 2).setScale(0.3);
    
    // add animation with 6 frames
    self.anims.create({
        key: 'blue-fire',
        frames: self.anims.generateFrameNumbers('blue-fire', { start: 0, end: 5 }),
        frameRate: 16,
        repeat: -1
    })
    self.fire.play('blue-fire');
    self.levelGroup.add(self.buildship);
    self.levelGroup.add(self.fire);
    
    self.buildshipText = self.add.text(470, 60, 'BUILDSHIP.XYZ', { fill: "#ffffff", fontSize: "60px", fontFamily: "PixelFont" });
    self.levelGroup.add(self.buildshipText);
    // TEXT
    var text = 'This is the main room! You can enter without any NFT :)';
    self.label = self.add.text(200, 200, '', { fill: "#ffffff", fontSize: "35px", fontFamily: "PixelFont" });
    self.levelGroup.add(self.label);
    self.typeTextWithDelay(text);

    self.levelGroup.add(self.buildshipText);


    // BUTTON WITH START TEXT
    self.button1 = self.rexUI.add.label({
        background: self.add.image(0, 0, 'background-button'),
        text: self.add.text(0, 0, 'CONTINUE', { fill: "#000000", fontSize: "35px", fontFamily: "PixelFont" }),
        space: {
            left: 90,
            right: 90,
            top: 20,
            bottom: 40
        }
    }).layout().setPosition(335, 300).setAlpha(0);

    // SET BUTTONS INTERCTIVE
    self.button1.setInteractive().on('pointerdown', () => {
        if (self.step != 2) return;
        self.step = 3;
        self.showCurrentLevel();
    });
}

export function updateBuildship(self) {
    if (self.fire) {
        self.buildship.x += 0.5;
        self.buildship.y -= 0.5;
        self.fire.x = self.buildship.x - 70;
        self.fire.y = self.buildship.y + 85;
    }
}