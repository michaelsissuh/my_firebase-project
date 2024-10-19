// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_330d3HUdyuyIudqwv4mQG6KpWf0sSrE",
  authDomain: "salesapp-704e5.firebaseapp.com",
  projectId: "salesapp-704e5",
  storageBucket: "salesapp-704e5.appspot.com",
  messagingSenderId: "678030370735",
  appId: "1:678030370735:web:7e7b9b01316d1f842b715a",
  measurementId: "G-FSXRDLMY2C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export the Firestore database instance
export { db };  // Named export
