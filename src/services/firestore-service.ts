import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot 
} from 'firebase/firestore';
import { db } from './firebase';
import { UserData } from './auth-service';

// Store interface
export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  createdAt: number;
  role: string;
}

// Rating interface
export interface Rating {
  id: string;
  storeId: string;
  userId: string;
  value: number;
  createdAt: number;
  updatedAt: number | null;
}

// Get all stores
export const getAllStores = async (): Promise<Store[]> => {
  try {
    const storesSnapshot = await getDocs(collection(db, 'stores'));
    return storesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Store));
  } catch (error) {
    console.error('Error getting stores:', error);
    throw error;
  }
};

// Get store by ID
export const getStoreById = async (storeId: string): Promise<Store | null> => {
  try {
    const storeDoc = await getDoc(doc(db, 'stores', storeId));
    
    if (storeDoc.exists()) {
      return {
        id: storeDoc.id,
        ...storeDoc.data()
      } as Store;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting store by ID:', error);
    throw error;
  }
};

// Add a new store
export const addStore = async (storeData: Omit<Store, 'id'>): Promise<string> => {
  try {
    const storeRef = await addDoc(collection(db, 'stores'), storeData);
    return storeRef.id;
  } catch (error) {
    console.error('Error adding store:', error);
    throw error;
  }
};

// Update store data
export const updateStore = async (
  storeId: string,
  data: Partial<Omit<Store, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
    const storeRef = doc(db, 'stores', storeId);
    await updateDoc(storeRef, data);
  } catch (error) {
    console.error('Error updating store:', error);
    throw error;
  }
};

// Get all users
export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map(doc => ({
      ...doc.data()
    } as UserData));
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

// Get store's ratings
export const getStoreRatings = async (storeId: string): Promise<Rating[]> => {
  try {
    // First try without ordering to prevent initial index error
    const ratingsQuery = query(
      collection(db, 'ratings'),
      where('storeId', '==', storeId)
    );
    
    const ratingsSnapshot = await getDocs(ratingsQuery);
    
    return ratingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Rating)).sort((a, b) => b.createdAt - a.createdAt); // Sort in memory instead
  } catch (error) {
    console.error('Error getting store ratings:', error);
    throw error;
  }
};
// Add or update a rating
export const upsertRating = async (
  userId: string,
  storeId: string,
  value: number
): Promise<void> => {
  try {
    // Check if rating already exists
    const ratingsQuery = query(
      collection(db, 'ratings'),
      where('userId', '==', userId),
      where('storeId', '==', storeId),
      limit(1)
    );
    
    const existingRatingSnapshot = await getDocs(ratingsQuery);
    
    if (!existingRatingSnapshot.empty) {
      // Update existing rating
      const existingRatingDoc = existingRatingSnapshot.docs[0];
      await updateDoc(doc(db, 'ratings', existingRatingDoc.id), {
        value,
        updatedAt: Date.now()
      });
    } else {
      // Create new rating
      const ratingData: Omit<Rating, 'id'> = {
        userId,
        storeId,
        value,
        createdAt: Date.now(),
        updatedAt: null
      };
      
      await addDoc(collection(db, 'ratings'), ratingData);
    }
  } catch (error) {
    console.error('Error upserting rating:', error);
    throw error;
  }
};

// Get user's rating for a specific store
export const getUserRatingForStore = async (
  userId: string,
  storeId: string
): Promise<Rating | null> => {
  try {
    const ratingQuery = query(
      collection(db, 'ratings'),
      where('userId', '==', userId),
      where('storeId', '==', storeId),
      limit(1)
    );
    
    const ratingSnapshot = await getDocs(ratingQuery);
    
    if (!ratingSnapshot.empty) {
      const ratingDoc = ratingSnapshot.docs[0];
      return {
        id: ratingDoc.id,
        ...ratingDoc.data()
      } as Rating;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user rating for store:', error);
    throw error;
  }
};

// Get users who rated a store
export const getUsersWhoRatedStore = async (storeId: string): Promise<UserData[]> => {
  try {
    const ratings = await getStoreRatings(storeId);
    const userIds = ratings.map(rating => rating.userId);
    
    // No ratings found
    if (userIds.length === 0) {
      return [];
    }
    
    const users: UserData[] = [];
    
    // Get user data for each user ID
    for (const userId of userIds) {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        users.push(userDoc.data() as UserData);
      }
    }
    
    return users;
  } catch (error) {
    console.error('Error getting users who rated store:', error);
    throw error;
  }
};

// Get total counts for dashboard
export const getDashboardCounts = async (): Promise<{
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}> => {
  try {
    const [usersSnapshot, storesSnapshot, ratingsSnapshot] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'stores')),
      getDocs(collection(db, 'ratings'))
    ]);
    
    return {
      totalUsers: usersSnapshot.size,
      totalStores: storesSnapshot.size,
      totalRatings: ratingsSnapshot.size
    };
  } catch (error) {
    console.error('Error getting dashboard counts:', error);
    throw error;
  }
};

// 🔍 get the store whose ownerId equals a user’s uid
export const getStoreByOwner = async (ownerId: string): Promise<Store | null> => {
  const q = query(
    collection(db, 'stores'),
    where('ownerId', '==', ownerId),
    limit(1)
  );

  const snap = await getDocs(q);
  if (!snap.empty) {
    const doc = snap.docs[0];
    return { id: doc.id, ...doc.data() } as Store;
  }
  return null;
};
