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
  getDocFromServer,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  updateDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Listing, Review, UserProfile, Order, UserRole } from '../types';

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore targeting the provisioned database ID
const config = firebaseConfig as any;
export const db = config.firestoreDatabaseId
  ? getFirestore(app, config.firestoreDatabaseId)
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
export async function signInWithGoogle(): Promise<UserProfile> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  
  // Upsert user profile document
  const pathForUser = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    let role: UserRole = 'buyer';
    // Set super admin based on user email
    if (user.email === 'healthyfieldsbus2@gmail.com') {
      role = 'admin';
    } else if (userDoc.exists()) {
      role = userDoc.data().role || 'buyer';
    }

    const profile: Partial<UserProfile> = {
      uid: user.uid,
      displayName: user.displayName || 'Market Place Hub User',
      email: user.email || '',
      photoURL: user.photoURL || undefined,
      role: role,
      lastLogin: new Date().toISOString(),
    };

    if (!userDoc.exists()) {
      profile.memberSince = new Date().toISOString();
      profile.commissionRate = 0.05; // 5% default
    }

    await setDoc(userRef, profile, { merge: true });
    return { ...userDoc.data(), ...profile } as UserProfile;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, pathForUser);
    throw err;
  }
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

export function onAuthUserChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? (userDoc.data() as UserProfile) : null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
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

export async function fetchFirestoreListings(filters?: { vendorId?: string }): Promise<Listing[]> {
  const pathForListings = 'listings';
  try {
    let listingsRef = collection(db, 'listings');
    let q = query(listingsRef);
    
    if (filters?.vendorId) {
      q = query(listingsRef, where('vendor.id', '==', filters.vendorId));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => d.data() as Listing);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, pathForListings);
    return [];
  }
}

// ----------------------------------------------------------------------
// Firestore Database Operations: Orders & Transactions
// ----------------------------------------------------------------------
export async function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const path = 'orders';
  try {
    const ordersRef = collection(db, 'orders');
    const docRef = await addDoc(ordersRef, {
      ...order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
}

export async function fetchOrders(filters?: { buyerId?: string, sellerId?: string }): Promise<Order[]> {
  const path = 'orders';
  try {
    const ordersRef = collection(db, 'orders');
    let q = query(ordersRef, orderBy('createdAt', 'desc'));
    
    if (filters?.buyerId) {
      q = query(ordersRef, where('buyerId', '==', filters.buyerId), orderBy('createdAt', 'desc'));
    } else if (filters?.sellerId) {
      q = query(ordersRef, where('sellerId', '==', filters.sellerId), orderBy('createdAt', 'desc'));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
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
