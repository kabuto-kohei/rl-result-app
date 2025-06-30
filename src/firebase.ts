// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 

// Firebase の設定
const firebaseConfig = {
  apiKey: "AIzaSyDkEQjHE0MRiX1Lp5ZMAwei4ke73xiN7HQ",
  authDomain: "rl-result-app.firebaseapp.com",
  projectId: "rl-result-app",
  storageBucket: "rl-result-app.appspot.com",
  messagingSenderId: "266324058585",
  appId: "1:266324058585:web:93623af637e76b8f46f9c8"
};

// Firebase 初期化
const app = initializeApp(firebaseConfig);

// Firestore & Auth インスタンスをエクスポート
export const db = getFirestore(app);
export const auth = getAuth(app); 
