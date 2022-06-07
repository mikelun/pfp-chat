// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, TwitterAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export function getCurrentUser() {
    console.log(getAuth(app).currentUser);
}

export function loginByGoogle() {
    const provider = new GoogleAuthProvider();
    login(provider);
}

export function loginByTwitter() {
    const provider = new TwitterAuthProvider();
    login(provider);
}

function login(provider) {

    const auth = getAuth();
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
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