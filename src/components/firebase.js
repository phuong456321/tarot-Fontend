// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzVt-CMQEMIwepa1fP4cwFa2oNw_9ojuQ",
  authDomain: "zodiac-tarot.firebaseapp.com",
  projectId: "zodiac-tarot",
  storageBucket: "zodiac-tarot.firebasestorage.app",
  messagingSenderId: "989750755115",
  appId: "1:989750755115:web:78a652939ca803af164f6e",
  measurementId: "G-YW7XNJ6D1D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };