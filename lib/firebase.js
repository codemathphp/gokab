import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: 'gokab-5b404',
  storageBucket: 'gokab-5b404.firebasestorage.app',
};

const apps = getApps();
const app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0];
const db = getFirestore(app);

export { app, db };
