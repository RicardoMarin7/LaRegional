import firebase from 'firebase'
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCa3HF4NBdtTJmCXLYk9W2FA23nQ1MOXuc",
    authDomain: "la-regional-test.firebaseapp.com",
    projectId: "la-regional-test",
    storageBucket: "la-regional-test.appspot.com",
    messagingSenderId: "487961288254",
    appId: "1:487961288254:web:e6b87f45b4f2abea65bb6f",
    measurementId: "G-Q980MWFWDD"
}

firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({experimentalForceLongPolling: true})
const database = firebase.firestore();
export default database