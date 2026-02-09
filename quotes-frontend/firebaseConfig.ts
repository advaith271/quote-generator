import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBAg0LW2gE56Tmpf_ao7kk912L8VKWk9P8",
  authDomain: "quote-generator-a3504.firebaseapp.com",
  projectId: "quote-generator-a3504",
  storageBucket: "quote-generator-a3504.firebasestorage.app",
  messagingSenderId: "120927189436",
  appId: "1:120927189436:web:0aac2a7db9faefe84fd3b9",
  measurementId: "G-W5F99E0XJK"
};

const app=initializeApp(firebaseConfig)
export const auth=getAuth(app)


