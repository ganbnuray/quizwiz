import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHRNHsnAD8xEn3cBFxsIyfEowuHMhWthE",
  authDomain: "flashcard-saas1.firebaseapp.com",
  projectId: "flashcard-saas1",
  storageBucket: "flashcard-saas1.appspot.com",
  messagingSenderId: "301077309810",
  appId: "1:301077309810:web:f155c3bc241383cd8215eb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
