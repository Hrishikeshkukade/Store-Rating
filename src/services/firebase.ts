import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For development purposes, you'll need to replace these with your Firebase config
// In production, these would typically be in environment variables
const firebaseConfig = {
  apiKey: "AIzaSyCEZWw9KqxgAlHOBJlW_oms08ONqpPSGBY",
  authDomain: "store-rating-webapp.firebaseapp.com",
  projectId: "store-rating-webapp",
  storageBucket: "store-rating-webapp.firebasestorage.app",
  messagingSenderId: "258830020460",
  appId: "1:258830020460:web:e3ee72fb26fc1a849d4d49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export Firebase app
export default app;