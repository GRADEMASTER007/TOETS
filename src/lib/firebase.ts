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
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc,
  serverTimestamp 
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

// Authentication Helpers
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  
  // Upsert user profile document
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName || 'AfriTrade User',
      email: user.email,
      photoURL: user.photoURL,
      lastLogin: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn('Could not upsert user document to Firestore:', err);
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
  try {
    const favsRef = collection(db, 'users', userId, 'favorites');
    const snapshot = await getDocs(favsRef);
    return snapshot.docs.map((d) => d.id);
  } catch (err) {
    console.warn('Error fetching favorites from Firestore:', err);
    return [];
  }
}

export async function toggleFavoriteInFirestore(userId: string, listingId: string, isFav: boolean): Promise<void> {
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
    console.warn('Error toggling favorite in Firestore:', err);
  }
}

// ----------------------------------------------------------------------
// Firestore Database Operations: Listings
// ----------------------------------------------------------------------
export async function saveListingToFirestore(listing: Listing): Promise<void> {
  try {
    const listingDocRef = doc(db, 'listings', listing.id);
    await setDoc(listingDocRef, {
      ...listing,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn('Error saving listing to Firestore:', err);
  }
}

export async function fetchFirestoreListings(): Promise<Listing[]> {
  try {
    const listingsRef = collection(db, 'listings');
    const snapshot = await getDocs(listingsRef);
    return snapshot.docs.map((d) => d.data() as Listing);
  } catch (err) {
    console.warn('Error fetching listings from Firestore:', err);
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
  try {
    const leadsRef = collection(db, 'leads');
    const docRef = await addDoc(leadsRef, {
      ...lead,
      createdAt: serverTimestamp(),
      status: 'pending',
    });
    return docRef.id;
  } catch (err) {
    console.warn('Error submitting lead to Firestore:', err);
    return `local_${Date.now()}`;
  }
}

// ----------------------------------------------------------------------
// Firestore Database Operations: Reviews
// ----------------------------------------------------------------------
export async function submitReviewToFirestore(review: Review): Promise<void> {
  try {
    const reviewDocRef = doc(db, 'reviews', review.id);
    await setDoc(reviewDocRef, {
      ...review,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Error submitting review to Firestore:', err);
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
  try {
    const kycDocRef = doc(db, 'kyc', kycData.userId);
    await setDoc(kycDocRef, {
      ...kycData,
      status: 'verified', // Instant demo verification for preview
      submittedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn('Error submitting KYC to Firestore:', err);
  }
}

// ----------------------------------------------------------------------
// Firestore Database Operations: AI Chat Logs & History
// ----------------------------------------------------------------------
export async function saveChatSessionToFirestore(userId: string, messages: any[], role: string, model: string): Promise<void> {
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
    console.warn('Error saving chat session to Firestore:', err);
  }
}
