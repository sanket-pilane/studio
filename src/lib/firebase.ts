
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "studio-4704287603-f1b1f",
  appId: "1:407389153009:web:4e37c5a20887b5375dab50",
  apiKey: "AIzaSyDJCcpWa1BN_R_aQehwytBXckCLIzCrNz8",
  authDomain: "studio-4704287603-f1b1f.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "407389153009"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

let resolveInitialization: (value: boolean) => void;
const initializationPromise = new Promise<boolean>((resolve) => {
    resolveInitialization = resolve;
});

async function initializeFirebase() {
    if (getApps().length) {
        app = getApp();
        auth = getAuth(app);
        db = getFirestore(app);
        resolveInitialization(true);
        return;
    }

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    if (typeof window !== 'undefined') {
        try {
            await enableIndexedDbPersistence(db);
        } catch (err: any) {
            if (err.code == 'failed-precondition') {
                console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
            } else if (err.code == 'unimplemented') {
                console.warn('The current browser does not support all of the features required to enable persistence.');
            }
        }
    }
    resolveInitialization(true);
}

// Immediately start initialization
initializeFirebase();

export { app, auth, db, initializationPromise };
