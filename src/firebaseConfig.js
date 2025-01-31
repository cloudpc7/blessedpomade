import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions } from 'firebase/functions';
import { getAuth, signInAnonymously, connectAuthEmulator } from 'firebase/auth';
import { setUser, setAuthError } from './utils/userActions';
import { doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const functions = getFunctions(app);

if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080); // Firestore port
  connectAuthEmulator(auth, "http://localhost:9099"); // Auth port if needed
}
// Export a function to handle anonymous sign-in that can be called from a component
export const handleAnonymousSignIn = (dispatch) => {
  signInAnonymously(auth)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Anonymous user signed in:", user.uid);
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
  console.log('Attempting to write user ID:', userId);
  try {
    await setDoc(doc(db, "carts", userId), {
      userId: userId,
      createdAt: new Date()
    });
    console.log(`User ID ${userId} written to database`);
  } catch (error) {
    console.error("Error writing user ID to database:", error);
  }
};
export { db, functions, auth };