// IMPORTANT: This file is used for server-side (admin) initialization of Firebase.
// It should not be imported into any client-side code.

import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './config';

// Attempt to load service account credentials from environment variable
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (e) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT JSON:', e);
  }
}

const getFirebaseAdminApp = (): App => {
    if (getApps().length > 0) {
        return getApps()[0];
    }
    
    // In a deployed environment (like Firebase App Hosting),
    // initializeApp() can often be called without arguments.
    // For local development, we use the service account if available.
    if (serviceAccount) {
        return initializeApp({
            credential: cert(serviceAccount),
            projectId: firebaseConfig.projectId,
        });
    }

    console.warn("Firebase Admin SDK initializing without explicit credentials. This is expected in a deployed Google environment, but may fail locally if GOOGLE_APPLICATION_CREDENTIALS is not set.")
    return initializeApp({
        projectId: firebaseConfig.projectId,
    });
};


const adminApp = getFirebaseAdminApp();
const db = getFirestore(adminApp);

export { adminApp, db };
