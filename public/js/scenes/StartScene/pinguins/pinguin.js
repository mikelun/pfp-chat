export function pinguinLevel0(self, Moralis) {
    // MAKE GROUP FOR LEVEL
    self.levelGroup = self.add.group();

    // TEXT
    var text = 'Hello from OpenMetaverse!\nHere you can chat and chill with other players\nIf you want to say something, we need your microphone access\n';
    self.label = self.add.text(200, 200, '', { fill: "#ffffff", fontSize: "24px"});
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

export function pinguinLevel1(self, Moralis) {
    // MAKE GROUP FOR LEVEL
    self.levelGroup = self.add.group();

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


export function pinguinLevel2(self, Moralis) {

    // MAKE GROUP FOR LEVEL
    self.levelGroup = self.add.group();

    self.penguin = self.add.image(600, 500, 'penguin').setScale(0.5);
    //self.robots = self.add.image(600, 600, 'ailoverse-robots').setScale(0.2);
    self.ailoverseText = self.add.text(440, 100, 'PUDGY PENGUINS', { fill: "#ffffff", fontSize: "48px", fontFamily: "PixelFont" });
    
    //self.levelGroup.add(self.cats);
    //self.levelGroup.add(self.robots);
    // TEXT
    var text = 'TO ENTER THE ROOM YOU SHOULD HAVE PUDGY PENGUINS NFT';
    self.label = self.add.text(270, 200, '', { fill: "#ffffff", fontSize: "24px", align: "center" });
    self.levelGroup.add(self.label);
    self.typeTextWithDelay(text);

    // BUTTON WITH START TEXT
    self.button1 = self.rexUI.add.label({
        background: self.add.image(0, 0, 'background-button'),
        text: self.add.text(0, 0, 'CHECK NFT', { fill: "#000000", fontSize: "24px" }),
        space: {
            left: 90,
            right: 90,
            top: 20,
            bottom: 30
        }
    }).layout().setPosition(650, 300).setAlpha(0);

    // SET BUTTONS INTERCTIVE
    self.button1.setInteractive().on('pointerdown', () => {
        if (self.step != 2) return;
        self.penguin.setAlpha(0);
        self.progress.setAlpha(1);
        self.button1.setAlpha(0);
        self.label.setPosition(500, 480);
        self.label.text = 'CHECKING YOUR NFT...';
        const token_address = "0xbd3531da5cf5857e7cfaa92426877b022e612cf8";
        self.checkNFTForProject(token_address);
    });
}