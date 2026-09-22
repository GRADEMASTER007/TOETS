import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  onSnapshot, 
  getDocFromServer,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Listing, Order } from '../types';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

// Validation helper for Firestore errors
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Auth Helpers
export const onAuthUserChanged = (callback: (user: any) => void) => onAuthStateChanged(auth, callback);

export const getUserProfile = async (uid: string): Promise<any> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

export const logOut = () => signOut(auth);

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Sync user profile to Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    let profileData: any;
    if (!userSnap.exists()) {
      profileData = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: 'user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(userRef, profileData);
    } else {
      profileData = userSnap.data();
    }
    
    return profileData;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Data Helpers
export const fetchFirestoreListings = async (): Promise<Listing[]> => {
  const q = query(collection(db, 'listings'), where('status', '==', 'active'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as unknown as Listing[];
};

export const saveListingToFirestore = async (listing: any) => {
  const listingId = listing.id || doc(collection(db, 'listings')).id;
  const listingRef = doc(db, 'listings', listingId);
  await setDoc(listingRef, { ...listing, id: listingId, updatedAt: serverTimestamp() }, { merge: true });
  return listingId;
};

export const fetchUserFavoritesFromFirestore = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data().favorites || [] : [];
};

export const toggleFavoriteInFirestore = async (uid: string, listingId: string, isFavorite: boolean) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const favorites = userSnap.data().favorites || [];
    const updated = isFavorite 
      ? [...new Set([...favorites, listingId])]
      : favorites.filter((id: string) => id !== listingId);
    await updateDoc(userRef, { favorites: updated, updatedAt: serverTimestamp() });
  }
};

export const fetchOrders = async (): Promise<Order[]> => {
  const snap = await getDocs(collection(db, 'orders'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as unknown as Order[];
};

export const submitLeadToFirestore = async (leadData: any) => {
  const leadRef = doc(collection(db, 'leads'));
  await setDoc(leadRef, {
    ...leadData,
    createdAt: serverTimestamp(),
  });
  return leadRef.id;
};

export const submitReviewToFirestore = async (reviewData: any) => {
  const reviewRef = doc(collection(db, 'reviews'));
  await setDoc(reviewRef, {
    ...reviewData,
    createdAt: serverTimestamp(),
  });
  return reviewRef.id;
};

export const createOrder = async (orderData: any) => {
  const orderRef = doc(collection(db, 'orders'));
  await setDoc(orderRef, {
    ...orderData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return orderRef.id;
};

export const saveChatSessionToFirestore = async (uid: string, messages: any[], role: string, model: string) => {
  const chatRef = doc(collection(db, 'chats'));
  await setDoc(chatRef, {
    participantIds: [uid],
    role,
    model,
    updatedAt: serverTimestamp(),
  });
  
  // Add messages subcollection
  for (const msg of messages) {
    const msgRef = doc(collection(db, `chats/${chatRef.id}/messages`));
    await setDoc(msgRef, {
      ...msg,
      createdAt: serverTimestamp(),
    });
  }
  return chatRef.id;
};

export const logout = logOut;

// Connection test
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot,
  Timestamp,
  serverTimestamp
};
