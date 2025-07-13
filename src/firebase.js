// src/firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const analytics = getAnalytics(app);

