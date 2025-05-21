import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyCf8ikFURw8I__Q6azio016RNuVM7bYGGg",
    authDomain: "test-react-mbkm.firebaseapp.com",
    projectId: "test-react-mbkm",
    storageBucket: "test-react-mbkm.firebasestorage.app",
    messagingSenderId: "709614467701",
    appId: "1:709614467701:web:e00e69adfdb0d67529963c",
    measurementId: "G-QJ9LXT47N3"
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
// const analytics = getAnalytics(app);

export { app, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword};