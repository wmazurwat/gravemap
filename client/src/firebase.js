import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmWTcrCn4TyWPW7GehS2movtyiNl7WBlo",
  authDomain: "gravemap-4108f.firebaseapp.com",
  projectId: "gravemap-4108f",
  storageBucket: "gravemap-4108f.firebasestorage.app",
  messagingSenderId: "919620676838",
  appId: "1:919620676838:web:f3b628ec64c807b7415f27"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);