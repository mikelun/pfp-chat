// Get microphone access
export function defaultLevel0(self, Moralis) {
    // MAKE GROUP FOR LEVEL
    self.levelGroup = self.add.group();

    // TEXT
    var text = 'Hello from OpenMetaverse!\nHere you can chat and chill with other players\nIf you want to say something, we need your microphone access\n';
    self.label = self.add.text(200, 200, '', { fill: "#ffffff", fontSize: "35px", fontFamily: "PixelFont" });
    self.levelGroup.add(self.label);
    self.typeTextWithDelay(text);

    // BUTTON WITH ALLOW TEXT
    self.button1 = self.rexUI.add.label({
        background: self.add.image(0, 0, 'background-button'),
        text: self.add.text(0, 0, 'ALLOW', { fill: "#000000", fontSize: "35px", fontFamily: "PixelFont" }),
        space: {
            left: 90,
            right: 90,
            top: 20,
            bottom: 40
        }
    }).layout().setPosition(315, 360).setAlpha(0);

    // BUTTON WITH "NO, CONTINUE" TEXT
    self.button2 = self.rexUI.add.label({
        background: self.add.image(0, 0, 'background-button'),
        text: self.add.text(0, 0, 'NO, CONTINUE', { fill: "#000000", fontSize: "35px", fontFamily: "PixelFont" }),
        space: {
            left: 45,
            right: 45,
            top: 20,
            bottom: 40
        }
    }).layout().setPosition(315, 440).setAlpha(0);

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

// get metamask
export function defaultLevel1(self, Moralis) {
    // TEXT
    var text = 'IF YOU WANT TO SHOW OFF YOUR NFT\nOR FIND YOUR NFT COMMUNITY ROOM\nPLEASE CONNECT METAMASK';
    self.label = self.add.text(200, 200, '', { fill: "#ffffff", fontSize: "35px", fontFamily: "PixelFont" });
    self.levelGroup.add(self.label);
    self.typeTextWithDelay(text);

    // BUTTON WITH CONNECT TEXT
    self.button1 = self.rexUI.add.label({
        background: self.add.image(0, 0, 'background-button'),
        text: self.add.text(0, 0, 'CONNECT', { fill: "#000000", fontSize: "35px", fontFamily: "PixelFont" }),
        space: {
            left: 100,
            right: 100,
            top: 20,
            bottom: 40
        }
    }).layout().setPosition(335, 360).setAlpha(0);

    // SET BUTTONS INTERCTIVE
    self.button1.setInteractive().on('pointerdown', () => {
        if (self.step != 1) return;

        // connect to Moralis
        self.startMoralis();

        async function login() {
            var user = Moralis.User.current();
            self.progress.setAlpha(1);
            if (!user) {
                self.label.setPosition(480, 470);
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
}
