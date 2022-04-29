import { createButton } from "./level-utils";
import { showCurrentLevel, typeTextWithDelay } from "./showLevels";

// Get microphone access
export function defaultLevel0(self, Moralis) {
    // MAKE GROUP FOR LEVEL
    self.levelGroup = self.add.group();

    // TEXT
    var text = 'Hello from Open Metaverse!\nIf you want to talk with people on planets\nwe need your microphone access\n';
    var newText = 'Hello from Open Metaverse!\nAre you ready to see the most cozy place with\nBEAUTIFUL music?\nIf you want to talk with people on planets\nwe need your microphone access\n';
    newText = newText.toUpperCase();
    
    self.label = self.add.text(330, 210, '', { fill: "#ffb900", fontSize: "35px", fontFamily: "PixelFont", align : "left" });
    
    self.levelGroup.add(self.label);

    typeTextWithDelay(self,  text)

    self.button1 = createButton(self, 435, 450, "ALLOW", {left: 60, right: 60, top: 30, bottom: 45});

    self.button2 = createButton(self, 700, 450, "NGMI(NO)", {left: 40, right: 40, top: 30, bottom: 45});


    // SET BUTTONS INTERCTIVE
    self.button1.setInteractive().on('pointerdown', () => {
        if (self.step != 0) return;
        try {
            navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
                self.stream = stream;
                localStorage.setItem('microphone', 'true');
                self.step = 1;
                showCurrentLevel(self);
            });
        } catch (e) {
            alert("YOUR MICROPHONE DOESN'T WORKING! " + e);
        }
    });

    self.button2.setInteractive().on('pointerdown', () => {
        if (self.step != 0) return;
        self.step = 1;
        self.stream = null;
        showCurrentLevel(self);
    });

}

// get metamask
export function defaultLevel1(self, Moralis) {
    // TEXT
    var text = 'IF YOU WANT TO SHOW OFF YOUR NFT\nOR FIND YOUR NFT COMMUNITY PLANET\nPLEASE CONNECT METAMASK';
    self.label = self.add.text(330, 210, '', { fill: "#ffb900", fontSize: "35px", fontFamily: "PixelFont", align : "left" });
    self.levelGroup.add(self.label);
    typeTextWithDelay(self, text);

   self.button1 = createButton(self, 450, 450, 'CONNECT', {left: 60, right: 60, top: 40, bottom: 50});

    // SET BUTTONS INTERCTIVE
    self.button1.setInteractive().on('pointerdown', () => {
        if (self.step != 1) return;

        // connect to Moralis
        startMoralis(Moralis);

        async function login() {
            var user = Moralis.User.current();
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
                        showCurrentLevel(self);
                        self.progress.setAlpha(0);
                    })
                    .catch(function (error) {
                        self.label.text = 'ERROR, RESTART THE PAGE'
                        alert(error);
                    });
            } else {
                self.user = user;
                localStorage.setItem('Moralis', 'true');
                self.step = 2;
                showCurrentLevel(self);
            }
        }
        login();
        self.button1.setAlpha(0);

    });
}


// START Moralis
function startMoralis(Moralis) {
    const serverUrl = "https://aehuzyu1u1bu.useMoralis.com:2053/server";
    const appId = "qjkycuFOWtZY1v6bpU8N2e4oxTqdvxNt6ajnsNIm";
    Moralis.start({ serverUrl, appId });
}