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
  appId: import.meta.env.VITE_FIREBASE_APPID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
export { query, where, collection, getDocs,getDoc, doc, updateDoc,addDoc, onSnapshot };
