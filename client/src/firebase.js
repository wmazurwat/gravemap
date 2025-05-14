import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAsA37xKfsNWkQzOt60cIKWKM_YbNXX5BQ",
  authDomain: "gravemap-7a32b.firebaseapp.com",
  projectId: "gravemap-7a32b",
  storageBucket: "gravemap-7a32b.firebasestorage.app",
  messagingSenderId: "213927617389",
  appId: "1:213927617389:web:fb030f2d528af588d1f064",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
