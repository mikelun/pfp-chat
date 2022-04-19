export function buildshipLevel0(self, Moralis) {
    // MAKE GROUP FOR LEVEL
    self.levelGroup = self.add.group();

    // TEXT
    var text = 'Hello from OpenMetaverse!\nHere you can chat and chill with other players\nIf you want to say something, we need your microphone access\n';
    self.label = self.add.text(200, 200, '', { fill: "#ffffff", fontSize: "24px" });
    self.levelGroup.add(self.label);
    self.typeTextWithDelay(text);

    // BUTTON WITH ALLOW TEXT
    self.button1 = self.rexUI.add.label({
        background: self.add.image(0, 0, 'background-button'),
        text: self.add.text(0, 0, 'ALLOW', { fill: "#000000", fontSize: "24px" }),
        space: {
            left: 90,
            right: 90,
            top: 20,
            bottom: 30
        }
    }).layout().setPosition(325, 350).setAlpha(0);

    // BUTTON WITH "NO, CONTINUE" TEXT
    self.button2 = self.rexUI.add.label({
        background: self.add.image(0, 0, 'background-button'),
        text: self.add.text(0, 0, 'NO, CONTINUE', { fill: "#000000", fontSize: "24px" }),
        space: {
            left: 40,
            right: 40,
            top: 20,
            bottom: 30
        }
    }).layout().setPosition(325, 420).setAlpha(0);

    // SET BUTTONS INTERCTIVE
    self.button1.setInteractive().on('pointerdown', () => {
        if (self.step != 0) return;
        try {
            navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
                self.stream = stream;
                localStorage.setItem('microphone', 'true');
                self.step = 1;
                self.showCurrentLevel();
            });
        } catch (e) {
            alert("YOUR MICROPHONE DOESN'T WORKING! " + e);
        }
    });

    self.button2.setInteractive().on('pointerdown', () => {
        if (self.step != 0) return;
        self.step = 1;
        self.stream = null;
        self.showCurrentLevel();
    });

}

export function buildshipLevel1(self, Moralis) {

    // TEXT
    var text = 'IF YOU WANT TO SHOW OFF YOUR NFT\nOR FIND YOUR NFT COMMUNITY ROOM\nPLEASE CONNECT METAMASK';
    self.label = self.add.text(200, 200, '', { fill: "#ffffff", fontSize: "24px" });
    self.levelGroup.add(self.label);
    self.typeTextWithDelay(text);

    // BUTTON WITH CONNECT TEXT
    self.button1 = self.rexUI.add.label({
        background: self.add.image(0, 0, 'background-button'),
        text: self.add.text(0, 0, 'CONNECT', { fill: "#000000", fontSize: "24px" }),
        space: {
            left: 100,
            right: 100,
            top: 20,
            bottom: 30
        }
    }).layout().setPosition(325, 350).setAlpha(0);

    // BUTTON WITH CONTINUE AS GUEST TEXT
    // self.button2 = self.rexUI.add.label({
    //     background: self.add.image(0, 0, 'background-button'),
    //     text: self.add.text(0, 0, 'CONTINUE AS GUEST', { fill: "#000000", fontSize: "24px" }),
    //     space: {
    //         left: 30,
    //         right: 40,
    //         top: 20,
    //         bottom: 30
    //     }
    // }).layout().setPosition(325, 420).setAlpha(0);

    // SET BUTTONS INTERCTIVE
    self.button1.setInteractive().on('pointerdown', () => {
        if (self.step != 1) return;

        // connect to Moralis
        self.startMoralis();

        async function login() {
            var user = Moralis.User.current();
            self.progress.setAlpha(1);
            if (!user) {
                self.label.setPosition(460, 460);
                self.label.text = 'CONNECTING YOUR METAMASK...'
                user = await Moralis.authenticate({
                    signingMessage: "Log in using Moralis",
                })
                    .then(function (user) {
                        localStorage.setItem('Moralis', 'true');
                        self.step = 2;
                        self.user = user;
                        self.showCurrentLevel();
                        self.progress.setAlpha(0);
                    })
                    .catch(function (error) {
                        self.progress.setAlpha(0);
                        self.label.text = 'ERROR, TRY AGAIN'
                        alert(error);
                    });
            } else {
                self.user = user;
                localStorage.setItem('Moralis', 'true');
                self.step = 2;
                self.progress.setAlpha(0);
                self.showCurrentLevel();
            }
        }
        login();
        self.button1.setAlpha(0);

    });
    // self.button2.setInteractive().on('pointerdown', () => {
    //     if (self.step != 1) return;
    //     self.step = 2;
    //     self.useMoralis = false;
    //     //Moralis = null;
    //     self.showCurrentLevel();
    // });

}


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

    self.buildshipText = self.add.text(470, 60, 'BUILDSHIP.XYZ', { fill: "#ffffff", fontSize: "48px", fontFamily: "PixelFont" });

    // TEXT
    var text = 'This is the main room! You can enter without any NFT :)';
    self.label = self.add.text(200, 200, '', { fill: "#ffffff", fontSize: "24px" });
    self.levelGroup.add(self.label);
    self.typeTextWithDelay(text);

    // BUTTON WITH START TEXT
    self.button1 = self.rexUI.add.label({
        background: self.add.image(0, 0, 'background-button'),
        text: self.add.text(0, 0, 'CONTINUE', { fill: "#000000", fontSize: "24px" }),
        space: {
            left: 90,
            right: 90,
            top: 20,
            bottom: 30
        }
    }).layout().setPosition(325, 300).setAlpha(0);

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