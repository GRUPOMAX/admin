// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Para o Firestore
import { getStorage } from "firebase/storage"; // Para o Storage

// Configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCy9jt4EMilBN677Dam8Gd7olePTVkk4xs",
  authDomain: "area-administrativa---pc.firebaseapp.com",
  projectId: "area-administrativa---pc",
  storageBucket: "area-administrativa---pc.appspot.com",
  messagingSenderId: "240808376953",
  appId: "1:240808376953:web:68b63459fbfaed7b4e72a8",
  measurementId: "G-TKRTWX0EXH"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Inicialize o Firestore e o Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
