import { createButton } from "./level-utils";
import { startMoralis } from "./web3-utils";
import { showCurrentLevel, typeTextWithDelay } from "./showLevels";
import { login } from "./web3-utils";
import { signInWithGoogle } from "../../../supabase/supabase";

// Get microphone access
export function defaultLevel0(self, Moralis) {
    // MAKE GROUP FOR LEVEL
    self.levelGroup = self.add.group();

    // TEXT
    var text = 'HELLO FROM PFPCHAT! HERE YOU CAN CHAT&TALK\nWITH PEOPLE, LISTEN TO PODCASTS AND CHILL\nWITH YOUR FRIENDS.\nIf you want to talk using voice chat\nwe need your microphone access\n';
    text = text.toUpperCase();
    //var newText = 'Hello from Open Metaverse!\nAre you ready to see the most cozy place with\nBEAUTIFUL music?\nIf you want to talk with people on planets\nwe need your microphone access\n';
    //newText = newText.toUpperCase();

    self.label = self.add.text(330, 210, '', { fill: "#ffb900", fontSize: "35px", fontFamily: "PixelFont", align: "left" });

    self.levelGroup.add(self.label);

    typeTextWithDelay(self, text)

    self.button1 = createButton(self, 435, 450, "ALLOW", { left: 60, right: 60, top: 30, bottom: 45 });

    self.button2 = createButton(self, 700, 450, "NGMI(NO)", { left: 40, right: 40, top: 30, bottom: 45 });


    // SET BUTTONS INTERCTIVE
    self.button1.setInteractive().on('pointerdown', () => {
        //if (self.step != 1) return;
        try {
            navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(stream => {
                self.stream = stream;
                localStorage.setItem('microphone', 'true');
                stream.getTracks().forEach(track => {
                    track.stop();
                });
                self.step++;
                showCurrentLevel(self);
            });
        } catch (e) {
            alert("YOUR MICROPHONE DOESN'T WORKING! " + e);
        }
    });

    self.button2.setInteractive().on('pointerdown', () => {
        //if (self.step != 1) return;
        self.step++;
        self.stream = null;
        showCurrentLevel(self);
    });
}

// get metamask
export function defaultLevel1(self, Moralis) {
    // TEXT
    var text = 'IF YOU WANT TO SHOW OFF YOUR NFT\nOR FIND YOUR NFT COMMUNITY PLANET\nPLEASE CONNECT METAMASK';
    self.label = self.add.text(330, 210, '', { fill: "#ffb900", fontSize: "35px", fontFamily: "PixelFont", align: "left" });
    self.levelGroup.add(self.label);
    typeTextWithDelay(self, text);

    self.button1 = createButton(self, 450, 450, 'CONNECT', { left: 60, right: 60, top: 40, bottom: 50 });

    // SET BUTTONS INTERCTIVE
    self.button1.setInteractive().on('pointerdown', () => {
        if (self.step != 1) return;

        // connect to Moralis
        startMoralis(Moralis);

        login(self, Moralis);
        self.button1.setAlpha(0);

    });
}

// get metamask
export function defaultLevel1WithGuestEnter(self, Moralis) {
    self.levelGroup = self.add.group();
    // TEXT
    var text = 'IF YOU WANT TO SHOW OFF YOUR NFT CONNECT\nMETAMASK';
    self.label = self.add.text(330, 210, '', { fill: "#ffb900", fontSize: "35px", fontFamily: "PixelFont", align: "left" });
    self.levelGroup.add(self.label);
    typeTextWithDelay(self, text);

    self.button1 = createButton(self, 450, 450, "CONNECT", { left: 60, right: 60, top: 30, bottom: 45 });

    self.button2 = createButton(self, 715, 450, "SKIP", { left: 90, right: 90, top: 30, bottom: 45 });

    // SET BUTTONS INTERCTIVE
    self.button1.setInteractive().on('pointerdown', () => {
        //if (self.step != 1) return;

        // connect to Moralis
        startMoralis(Moralis);

        login(self, Moralis);
        self.button1.setAlpha(0);
        self.button2.setAlpha(0);

    });

    self.button2.setInteractive().on('pointerdown', () => {
        //if (self.step != 1) return;

        self.step++;
        showCurrentLevel(self);
    });
}

export function connectGoogleLevel(self) {
    self.levelGroup = self.add.group();
    // TEXT
    var text = 'HELLO FROM PFPCHAT! HERE YOU CAN CHAT&TALK WITH\nPEOPLE, LISTEN TO PODCASTS AND CHILL WITH\nYOUR FRIENDS. TO CONTINUE WE NEED TO CONNECT\nYOUR GOOGLE ACCOUNT';
    self.label = self.add.text(330, 210, '', { fill: "#ffb900", fontSize: "34px", fontFamily: "PixelFont", align: "left" });
    self.levelGroup.add(self.label);
    typeTextWithDelay(self, text);

    self.button1 = createButton(self, 480, 450, "CONNECT GOOGLE", { left: 20, right: 20, top: 40, bottom: 55 });

    // SET BUTTONS INTERCTIVE
    self.button1.setInteractive().on('pointerdown', () => {
        signInWithGoogle().then(user => {
            if (!user) {
                self.label.setText('CONNECTING GOOGLE...');
            } else {
                self.step++;
                showCurrentLevel(self);
            }
        })
    });
}
