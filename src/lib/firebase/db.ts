import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  Query,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Get a single document by ID
 */
export async function getDocById<T extends DocumentData>(collectionName: string, id: string): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as T) : null;
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Get all documents from a collection
 */
export async function getAllDocs<T extends DocumentData>(collectionName: string): Promise<T[]> {
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Query documents with filters
 */
export async function queryDocs<T extends DocumentData>(
  collectionName: string,
  constraints: any[]
): Promise<T[]> {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Create or update a document
 */
export async function setDocData(collectionName: string, id: string, data: any): Promise<void> {
  try {
    await setDoc(doc(db, collectionName, id), data, { merge: true });
  } catch (error) {
    console.error(`Error setting document in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Update a document
 */
export async function updateDocData(collectionName: string, id: string, data: any): Promise<void> {
  try {
    await updateDoc(doc(db, collectionName, id), data);
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Delete a document
 */
export async function deleteDocData(collectionName: string, id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Get documents by field query
 */
export async function getDocsByField<T extends DocumentData>(
  collectionName: string,
  fieldName: string,
  value: any
): Promise<T[]> {
  try {
    const q = query(collection(db, collectionName), where(fieldName, "==", value));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
  } catch (error) {
    console.error(`Error querying by field ${fieldName} in ${collectionName}:`, error);
    throw error;
  }
}
