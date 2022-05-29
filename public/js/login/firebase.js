import { getAuth, signInWithPopup, TwitterAuthProvider, signInWithRedirect } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";



export function initializeFirebase() {
    return;
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
    //const app = initializeApp(firebaseConfig);

    //connectTwitter(app);
}

export function connectTwitter(app) {
    const provider = new TwitterAuthProvider();
    const auth = getAuth(app);
    //need to pass returnSecureToken set to true in the request
    provider.setCustomParameters({
        'lang': 'en',
        
    });
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
            // You can use these server side with your app's credentials to access the Twitter API.
            const credential = TwitterAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const secret = credential.secret;

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
            const credential = TwitterAuthProvider.credentialFromError(error);
            // ...
            console.log(errorCode, errorMessage, email, credential);
        });

}