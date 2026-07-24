import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Vite exposes only VITE_* values to the browser; authorization still belongs
// in deployed Firebase rules because these client configuration values are public.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const requiredFirebaseConfig = {
  VITE_FIREBASE_API_KEY: firebaseConfig.apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  VITE_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  VITE_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
  VITE_FIREBASE_APP_ID: firebaseConfig.appId,
}

export const missingFirebaseEnvironmentVariables = Object.entries(
  requiredFirebaseConfig,
)
  .filter(([, value]) => !value)
  .map(([key]) => key)

export function assertFirebaseConfigured() {
  if (missingFirebaseEnvironmentVariables.length) {
    throw new Error(
      `Firebase is not configured. Add ${missingFirebaseEnvironmentVariables.join(
        ', ',
      )} to your .env file and restart the application.`,
    )
  }
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
