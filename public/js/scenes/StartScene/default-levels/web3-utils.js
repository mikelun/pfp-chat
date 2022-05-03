import { showCurrentLevel } from "./showLevels";

const creators = ["0x59E1faC2FAF72765AD41aE1BfAC53d5cd80acB91"];

// login by metamask
export async function login(self, Moralis) {
    // get user
    var user = getUserMoralis(Moralis);

    if (!user) {
        self.label.setPosition(480, 470);
        self.label.text = 'CONNECTING YOUR METAMASK...'

        // LOGIN TO METAMASK HERE
        user = await Moralis.authenticate({
            signingMessage: "Log in using Moralis",
        })
            .then(function (user) {
                localStorage.setItem('Moralis', 'true');
                self.step = 2;
                self.user = user;
                showCurrentLevel(self);
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

// START Moralis
export function startMoralis(Moralis) {
    const serverUrl = "https://aehuzyu1u1bu.useMoralis.com:2053/server";
    const appId = "qjkycuFOWtZY1v6bpU8N2e4oxTqdvxNt6ajnsNIm";
    Moralis.start({ serverUrl, appId });
}

// Get user (if it exists)
export function getUserMoralis(Moralis) {
    return Moralis.User.current();
}

// Check NFT for your project
export async function checkNFTForProject(self, token_address, Moralis) {
    const address = self.user.get('ethAddress');
    
    // creators to lower case
    creators.forEach(creator => {
        creator = creator.toLowerCase();
        console.log(creator, address);
        if (creator == address.toLowerCase()) {

            self.step = 3;
            showCurrentLevel(self);
            return;
        }
    });

    const result = await checkNFT(token_address, Moralis);

    if (result || creators.includes(address)) {
        self.step = 3;
        showCurrentLevel(self);
    } else {
        self.label.x -= 125;
        self.label.y -= 100;
        self.label.text = 'YOU DONT HAVE NFT OF THIS COLLECTION\nYOU CAN VISIT MAIN ROOM WITHOUT NFT\n';
        self.linkText = self.add.text(self.label.x, self.label.y + 70, 'https://meet.buildship.xyz', { fill: "#ffb900", fontSize: "50px", fontFamily: "PixelFont" });
        self.linkText.setInteractive().on('pointerdown', () => {
            // load page origin
            window.location.href = window.location.origin;
        });
    }
}

async function checkNFT(token_address, Moralis) {
    console.log('Checking NFT', token_address, `https://etherscan.io/address/${token_address}`)
    const { total } = await Moralis.Web3API.account.getNFTsForContract({ token_address });
    return total > 0;
}
