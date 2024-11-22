import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { maybeCompleteAuthSession } from 'expo-web-browser';

// Ensure the auth redirect can complete
maybeCompleteAuthSession();

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1-ien6C4J-2Cndd_C9Xnmaj8EP9LHVy4",
  authDomain: "wordleapp-ef35a.firebaseapp.com",
  projectId: "wordleapp-ef35a",
  storageBucket: "wordleapp-ef35a.firebasestorage.app",
  messagingSenderId: "1088510527644",
  appId: "1:1088510527644:web:469fbcfcdadeceff778559",
  measurementId: "G-YNFQJTH1YD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };
export default app;
