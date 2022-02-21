// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import {apiKey,authDomain,projectId,storageBucket,messagingSenderId,appId,measurementId} from '@env'

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
