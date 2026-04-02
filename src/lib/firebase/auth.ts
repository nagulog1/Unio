//src/lib/firebase/auth.ts
import {
  onAuthStateChanged,
  signOut,
  User,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { setDocData, getDocById } from "./db";

/**
 * Watch authentication state changes
 */
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Sign out the current user
 */
export async function firebaseSignOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

/**
 * Update user profile information
 */
export async function updateUserProfile(
  displayName?: string,
  photoURL?: string
): Promise<void> {
  try {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: displayName || auth.currentUser.displayName,
        photoURL: photoURL || auth.currentUser.photoURL,
      });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

/**
 * Store user document in Firestore during signup
 */
export async function createUserDocument(
  uid: string,
  email: string,
  name: string,
  image?: string
): Promise<void> {
  try {
    await setDocData("users", uid, {
      id: uid,
      email,
      name,
      image: image || null,
      college: null,
      branch: null,
      year: null,
      bio: null,
      skills: [],
      xp: 0,
      streak: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error creating user document:", error);
    throw error;
  }
}

/**
 * Get user document from Firestore
 */
export async function getUserDocument(uid: string) {
  try {
    return await getDocById("users", uid);
  } catch (error) {
    console.error("Error getting user document:", error);
    throw error;
  }
}

/**
 * Update user document in Firestore
 */
export async function updateUserDocument(uid: string, data: any): Promise<void> {
  try {
    await setDocData("users", uid, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating user document:", error);
    throw error;
  }
}

/**
 * Enable Firebase persistence
 */
export async function enablePersistence(): Promise<void> {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (error) {
    console.error("Error enabling persistence:", error);
    throw error;
  }
}
