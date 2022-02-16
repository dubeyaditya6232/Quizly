// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBraC_dvTP2_cmxCUeKFut9DqA3drYzbA0",
  authDomain: "quiz-73e09.firebaseapp.com",
  projectId: "quiz-73e09",
  storageBucket: "quiz-73e09.appspot.com",
  messagingSenderId: "159610694531",
  appId: "1:159610694531:web:768711cc917033b465a4b6",
  measurementId: "G-HEB8N72TRX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
