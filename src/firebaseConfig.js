// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyARYcv3MY2jt7r2Ik9TgwB5Yxt1ng2bm3Q",
  authDomain: "levelstudio-807b5.firebaseapp.com",
  projectId: "levelstudio-807b5",
  storageBucket: "levelstudio-807b5.firebasestorage.app",
  messagingSenderId: "456507487427",
  appId: "1:456507487427:web:0d40185dd0aadd947bde76",
  measurementId: "G-G5QDLQYEF0"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };