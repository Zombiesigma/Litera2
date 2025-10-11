import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDF_0g55ME0-GEDoDBKsQUe7LV5q0k7fhE",
  authDomain: "litera-50b33.firebaseapp.com",
  databaseURL: "https://litera-50b33-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "litera-50b33",
  storageBucket: "litera-50b33.firebasestorage.app",
  messagingSenderId: "965279035193",
  appId: "1:965279035193:web:a4c59829d50cb6eb0182e8",
  measurementId: "G-SEY0WJXSSF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
