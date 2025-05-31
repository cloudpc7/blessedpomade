import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from 'firebase/functions';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { setUser, setAuthError } from './utils/userActions';
import { doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {

  apiKey: "AIzaSyDlKz8HnSnMIXtpbG0J5e2TbfIfup3UUIE",

  authDomain: "blessedpomade-450103.firebaseapp.com",

  projectId: "blessedpomade-450103",

  storageBucket: "blessedpomade-450103.firebasestorage.app",

  messagingSenderId: "193388602680",

  appId: "1:193388602680:web:7343bad6d26b30bcfc0dcd",

  measurementId: "G-PB25CFWSF3"

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