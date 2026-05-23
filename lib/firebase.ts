import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCHewMZiVf31otnRfjbwPeES0fATv9T8GE",
  authDomain: "synaps-ai-57e67.firebaseapp.com",
  projectId: "synaps-ai-57e67",
  storageBucket: "synaps-ai-57e67.firebasestorage.app",
  messagingSenderId: "872732712381",
  appId: "1:872732712381:web:234b0546f383ddb12386d4",
  measurementId: "G-51RKGQ5TE7"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
