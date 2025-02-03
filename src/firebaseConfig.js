// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAwXwEtvGfJFqpqGkHbSvwvdvuAQiD6big",
  authDomain: "canchas-cbe9a.firebaseapp.com",
  projectId: "canchas-cbe9a",
  storageBucket: "canchas-cbe9a.firebasestorage.app",
  messagingSenderId: "655036006674",
  appId: "1:655036006674:web:af3919e58a9d36bca4f3cb",
  measurementId: "G-FSYDC9K71T"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };