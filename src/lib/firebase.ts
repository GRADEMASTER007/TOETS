import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  addDoc,
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Listing, Review } from '../types';

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore targeting the provisioned database ID
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Error Handling Infrastructure (per Firebase Integration Skill)
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Error Context:', JSON.stringify(errInfo));
  return errInfo;
}

// Test Connection on Boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

// Authentication Helpers
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  
  // Upsert user profile document
  const pathForUser = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName || 'Market Place Hub User',
      email: user.email,
      photoURL: user.photoURL,
      lastLogin: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, pathForUser);
  }

  return user;
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

export function onAuthUserChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// ----------------------------------------------------------------------
// Firestore Database Operations: Favorites
// ----------------------------------------------------------------------
export async function fetchUserFavoritesFromFirestore(userId: string): Promise<string[]> {
  const pathForFavs = `users/${userId}/favorites`;
  try {
    const favsRef = collection(db, 'users', userId, 'favorites');
    const snapshot = await getDocs(favsRef);
    return snapshot.docs.map((d) => d.id);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, pathForFavs);
    return [];
  }
}

export async function toggleFavoriteInFirestore(userId: string, listingId: string, isFav: boolean): Promise<void> {
  const pathForFavDoc = `users/${userId}/favorites/${listingId}`;
  try {
    const favDocRef = doc(db, 'users', userId, 'favorites', listingId);
    if (isFav) {
      await setDoc(favDocRef, {
        listingId,
        createdAt: serverTimestamp(),
      });
    } else {
      await deleteDoc(favDocRef);
    }
  } catch (err) {
    handleFirestoreError(err, isFav ? OperationType.WRITE : OperationType.DELETE, pathForFavDoc);
  }
}

// ----------------------------------------------------------------------
// Firestore Database Operations: Listings
// ----------------------------------------------------------------------
export async function saveListingToFirestore(listing: Listing): Promise<void> {
  const pathForListing = `listings/${listing.id}`;
  try {
    const listingDocRef = doc(db, 'listings', listing.id);
    await setDoc(listingDocRef, {
      ...listing,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, pathForListing);
  }
}

export async function fetchFirestoreListings(): Promise<Listing[]> {
  const pathForListings = 'listings';
  try {
    const listingsRef = collection(db, 'listings');
    const snapshot = await getDocs(listingsRef);
    return snapshot.docs.map((d) => d.data() as Listing);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, pathForListings);
    return [];
  }
}

// ----------------------------------------------------------------------
// Firestore Database Operations: Leads & Inquiries
// ----------------------------------------------------------------------
export async function submitLeadToFirestore(lead: {
  listingId: string;
  vendorId?: string;
  senderName: string;
  senderPhone?: string;
  senderEmail?: string;
  message: string;
}): Promise<string> {
  const pathForLeads = 'leads';
  try {
    const leadsRef = collection(db, 'leads');
    const docRef = await addDoc(leadsRef, {
      ...lead,
      createdAt: serverTimestamp(),
      status: 'pending',
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, pathForLeads);
    return `local_${Date.now()}`;
  }
}

// ----------------------------------------------------------------------
// Firestore Database Operations: Reviews
// ----------------------------------------------------------------------
export async function submitReviewToFirestore(review: Review): Promise<void> {
  const pathForReview = `reviews/${review.id}`;
  try {
    const reviewDocRef = doc(db, 'reviews', review.id);
    await setDoc(reviewDocRef, {
      ...review,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, pathForReview);
  }
}

// ----------------------------------------------------------------------
// Firestore Database Operations: KYC Verification Submissions
// ----------------------------------------------------------------------
export async function submitKYCDocToFirestore(kycData: {
  userId: string;
  businessName: string;
  registrationNumber: string;
  documentType: string;
  documentName: string;
  countryCode: string;
}): Promise<void> {
  const pathForKYC = `kyc/${kycData.userId}`;
  try {
    const kycDocRef = doc(db, 'kyc', kycData.userId);
    await setDoc(kycDocRef, {
      ...kycData,
      status: 'verified',
      submittedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, pathForKYC);
  }
}

// ----------------------------------------------------------------------
// Firestore Database Operations: AI Chat Logs & History
// ----------------------------------------------------------------------
export async function saveChatSessionToFirestore(userId: string, messages: any[], role: string, model: string): Promise<void> {
  const pathForChat = `chats/${userId}_${role}`;
  try {
    const chatDocRef = doc(db, 'chats', `${userId}_${role}`);
    await setDoc(chatDocRef, {
      userId,
      role,
      model,
      messages: messages.slice(-20),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, pathForChat);
  }
}
