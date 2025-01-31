// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCi644hmK1BxXoC01WJVYZGf1fM9JVxpz8",
  authDomain: "blessedpomade.firebaseapp.com",
  projectId: "blessedpomade",
  storageBucket: "blessedpomade.firebasestorage.app",
  messagingSenderId: "296440553631",
  appId: "1:296440553631:web:2f5ad7328cca9dc69fc2aa",
  measurementId: "G-NMRP28M9HS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);