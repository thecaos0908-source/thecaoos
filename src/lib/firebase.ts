import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Valores enviados pelo usuário (fallback) caso as variáveis de ambiente não estejam definidas
const FALLBACK_CONFIG = {
  apiKey: "AIzaSyDvM0z18xQ0QgkoYIftFEPtPt_RV8MxC5Q",
  authDomain: "thecaos-67943.firebaseapp.com",
  projectId: "thecaos-67943",
  storageBucket: "thecaos-67943.firebasestorage.app",
  messagingSenderId: "306804346111",
  appId: "1:306804346111:web:61e1abdb4b7d62668950ca",
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || FALLBACK_CONFIG.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || FALLBACK_CONFIG.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || FALLBACK_CONFIG.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || FALLBACK_CONFIG.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || FALLBACK_CONFIG.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || FALLBACK_CONFIG.appId,
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);


