
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "studio-4704287603-f1b1f",
  appId: "1:407389153009:web:4e37c5a20887b5375dab50",
  apiKey: "AIzaSyDJCcpWa1BN_R_aQehwytBXckCLIzCrNz8",
  authDomain: "studio-4704287603-f1b1f.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "407389153009"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence
if (typeof window !== 'undefined') {
  try {
    enableIndexedDbPersistence(db);
  } catch (err: any) {
    if (err.code == 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
    } else if (err.code == 'unimplemented') {
      console.warn('The current browser does not support all of the features required to enable persistence.');
    }
  }
}


export { app, auth, db };
