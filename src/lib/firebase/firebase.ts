import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8hQsvKzJ-EiimSJXrBpXG2uMCkklvmXI",
  authDomain: "uni-o-ae3b3.firebaseapp.com",
  projectId: "uni-o-ae3b3",
  storageBucket: "uni-o-ae3b3.firebasestorage.app",
  messagingSenderId: "159769036055",
  appId: "1:159769036055:web:708b9482ff71784c17e352",
  measurementId: "G-56X5PSL4P3"
};

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
