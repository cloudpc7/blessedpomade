import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from 'firebase/functions';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { setUser, setAuthError } from './utils/userActions';
import { doc, setDoc } from 'firebase/firestore';

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
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export const handleAnonymousSignIn = (dispatch) => {
  signInAnonymously(auth)
    .then((userCredential) => {
      const user = userCredential.user;
      dispatch(setUser({
        uid: user.uid,
        isAnonymous: true,
      }));
      // Write to database here
      writeUserIdToDatabase(user.uid);
    })
    .catch((error) => {
      console.error("Error signing in anonymously:", error);
      dispatch(setAuthError(error.message));
    });
};

export const writeUserIdToDatabase = async (userId) => {
  try {
    await setDoc(doc(db, "carts", userId), {
      userId: userId,
      createdAt: new Date()
    });
  } catch (error) {
    console.error("Error writing user ID to database:", error);
  }
};
export { db, functions, auth };