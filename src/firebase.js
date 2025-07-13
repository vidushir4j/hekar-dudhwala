// src/firebase.js

// Import from Firebase modular SDK
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore'; // ✅ Firestore added

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrCaNlMvsfrlEt7LqFL28HZiwrbKLG360",
  authDomain: "hekar-dudhwala.firebaseapp.com",
  projectId: "hekar-dudhwala",
  storageBucket: "hekar-dudhwala.firebasestorage.app",
  messagingSenderId: "279586318815",
  appId: "1:279586318815:web:d3378536b7294e6a75bc6a",
  measurementId: "G-7M3GRY05CQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // ✅ Firestore initialized

// Export so you can use in App.js
export { db, analytics };
