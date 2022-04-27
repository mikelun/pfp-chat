export function cryptoDuckiesLevel2(self, Moralis) {

    // MAKE GROUP FOR LEVEL
    self.levelGroup = self.add.group();

    self.penguin = self.add.image(650, 520, 'duckies').setScale(0.25);
    self.levelGroup.add(self.penguin);
    //self.robots = self.add.image(600, 600, 'ailoverse-robots').setScale(0.2);
    self.ailoverseText = self.add.text(400, 100, 'CRYPTO DUCKIES (on-chain)', { fill: "#ffffff", fontSize: "60px", fontFamily: "PixelFont" });
    self.levelGroup.add(self.ailoverseText);
    //self.levelGroup.add(self.cats);
    //self.levelGroup.add(self.robots);
    // TEXT
    var text = 'TO ENTER THE ROOM YOU SHOULD HAVE CRYPTO DUCKIES (on-chain) NFT';
    self.label = self.add.text(200, 200, '', { fill: "#ffffff", fontSize: "35px", align: "center", fontFamily: "PixelFont" });
    self.levelGroup.add(self.label);
    self.typeTextWithDelay(text);

    // BUTTON WITH START TEXT
    self.button1 = self.rexUI.add.label({
        background: self.add.image(0, 0, 'background-button'),
        text: self.add.text(0, 0, 'CHECK NFT', { fill: "#000000", fontSize: "35px", fontFamily: "PixelFont" }),
        space: {
            left: 90,
            right: 90,
            top: 20,
            bottom: 40
        }
    }).layout().setPosition(650, 300).setAlpha(0);

    // SET BUTTONS INTERCTIVE
    self.button1.setInteractive().on('pointerdown', () => {
        if (self.step != 2) return;
        self.penguin.setAlpha(0);
        self.progress.setAlpha(1);
        self.button1.setAlpha(0);
        self.label.setPosition(520, 480);
        self.label.text = 'CHECKING YOUR NFT...';
        const token_address = "0x922dc160f2ab743312a6bb19dd5152c1d3ecca33";
        self.checkNFTForProject(token_address);
    });
}