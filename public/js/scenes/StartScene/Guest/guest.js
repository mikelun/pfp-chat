export function guestLevel1(self, Moralis) {
    // MAKE GROUP FOR LEVEL
    self.levelGroup = self.add.group();

    // TEXT
    var text = "It's Guest room. You should't connect Metamask";
    self.label = self.add.text(330, 250-30, '', { fill: "#ffffff", fontSize: "35px", align: "center", fontFamily: "PixelFont" });
    self.levelGroup.add(self.label);
    self.typeTextWithDelay(text);

    self.header = self.add.text(540, 60, 'GUEST', { fill: "#ffffff", fontSize: "60px", fontFamily: "PixelFont", align: "center" });
    self.levelGroup.add(self.header);

    // BUTTON WITH CONNECT TEXT
    self.button1 = self.rexUI.add.label({
        background: self.add.image(0, 0, 'background-button'),
        text: self.add.text(0, 0, 'CONTINUE', { fill: "#000000", fontSize: "35px", fontFamily: "PixelFont" }),
        space: {
            left: 100,
            right: 100,
            top: 20,
            bottom: 40
        }
    }).layout().setPosition(600, 370-30).setAlpha(0);

    self.button1.setInteractive().on('pointerdown', () => {
        if (self.step != 1) return;
        self.step = 2;
        self.showCurrentLevel();
        }
    );

}
