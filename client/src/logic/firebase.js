// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, TwitterAuthProvider, isSignInWithEmailLink, signInWithEmailLink, sendSignInLinkToEmail, connectAuthEmulator, sendEmailVerification } from "firebase/auth";
import { store } from "../stores";
import { updateFirebaseUser } from "../stores/loginReducer";

var app;

export async function initializeFirebase() {
    const firebaseConfig = {
        apiKey: "AIzaSyBhE82fWVhzvXCSIFq03GHNbBAzKcpbhtg",
        authDomain: "pfpchat-9a3c1.firebaseapp.com",
        projectId: "pfpchat-9a3c1",
        storageBucket: "pfpchat-9a3c1.appspot.com",
        messagingSenderId: "475475338783",
        appId: "1:475475338783:web:24995d0149d593dff0d72a",
        measurementId: "G-C4FJBJKJKP"
    };

    // Initialize Firebase
    app = initializeApp(firebaseConfig);


    getAuthUserID();

}

export function signInByEmail() {
    const actionCodeSettings = {
        url: 'http://localhost:3000/',
        handleCodeInApp: true,
    };

    const email = 'erin78115@gmail.com';
    const auth = getAuth(app);
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
            console.log('Email sent.');
            // The link was successfully sent. Inform the user.
            // Save the email locally so you don't need to ask the user for it again
            // if they open the link on the same device.
            window.localStorage.setItem('emailForSignIn', email);
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(error);
            // ...
        });

}

export function confirmEmail() {
    const auth = getAuth(app);
    if (isSignInWithEmailLink(auth, window.location.href)) {
        
        // Additional state parameters can also be passed via URL.
        // This can be used to continue the user's intended action before triggering
        // the sign-in operation.
        // Get the email if available. This should be available if the user completes
        // the flow on the same device where they started it.
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            // User opened the link on a different device. To prevent session fixation
            // attacks, ask the user to provide the associated email again. For example:
            email = window.prompt('Please provide your email for confirmation');
        }
        console.log("email: " + email);
        // The client SDK will parse the code from the link for you.
        // get oobCode params
        const oobCode = window.location.search.substring(1).split('=')[1];
        console.log(auth);
        signInWithEmailLink(auth, email, window.location.href)
            .then((result) => {
                console.log(result);
                // Clear email from storage.
                window.localStorage.removeItem('emailForSignIn');
                // You can access the new user via result.user
                // Additional user info profile not available via:
                // result.additionalUserInfo.profile == null
                // You can check if the user is new or existing:
                // result.additionalUserInfo.isNewUser
            })
            .catch((error) => {
                console.log(error);
                // Some error occurred, you can inspect the code: error.code
                // Common errors could be invalid email and invalid or expired OTPs.
            });
    }
}

async function getAuthUserID() {
    getAuth().onIdTokenChanged(async (user) => {
        // update firebase user
        store.dispatch(updateFirebaseUser(user));
        console.log(user);
    })
}


export function loginByTwitter() {
    const provider = new TwitterAuthProvider();
    login(provider);
}

function login(provider) {

    const auth = getAuth();
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log(user);
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
}