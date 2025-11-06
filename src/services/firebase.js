import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  query, 
  where, 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
};

// Env guard: surface clear messages during local dev and production if keys are missing
const missingKeys = Object.entries({
  VITE_FIREBASE_API_KEY: firebaseConfig.apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  VITE_FIREBASE_PROJECTID: firebaseConfig.projectId,
  VITE_FIREBASE_STORAGEBUCKET: firebaseConfig.storageBucket,
  VITE_FIREBASE_MESSAGINGSENDERID: firebaseConfig.messagingSenderId,
  VITE_FIREBASE_APPID: firebaseConfig.appId,
})
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missingKeys.length) {
  console.error(
    `[Firebase config missing] The following env vars are not set: ${missingKeys.join(", ")}\n` +
      "Add them to your .env (local) or Vercel Project Settings > Environment Variables. See .env.example."
  );
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
export { query, where, collection, getDocs,getDoc, doc, updateDoc,addDoc, onSnapshot };
