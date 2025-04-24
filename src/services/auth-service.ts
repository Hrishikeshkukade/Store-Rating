import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  User
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  collection,
  query,
  where,
  orderBy,
  updateDoc
} from 'firebase/firestore';
import { auth, db } from './firebase';

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  STORE_OWNER: 'store_owner'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export interface UserData {
  uid: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  createdAt: number;
}

// Sign up a new user
export const signUpUser = async (
  email: string, 
  password: string, 
  name: string, 
  address: string,
  role: UserRole = USER_ROLES.USER
): Promise<UserData> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const userData: UserData = {
      uid: user.uid,
      name,
      email,
      address,
      role,
      createdAt: Date.now()
    };
    
    await setDoc(doc(db, 'users', user.uid), userData);
    
    return userData;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Create a new user (admin only)
export const createAdminUser = async (
  email: string,
  password: string,
  name: string,
  address: string,
  role: UserRole
): Promise<UserData> => {
  try {
    // Create user document first
    const userData: UserData = {
      uid: '', // Will be updated with actual UID
      name,
      email,
      address,
      role,
      createdAt: Date.now()
    };

    // Create the user in Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;
    
    // Update the UID and save to Firestore
    userData.uid = newUser.uid;
    await setDoc(doc(db, 'users', newUser.uid), userData);

    // Sign out the new user immediately to maintain admin session
    await signOut(auth);

    // Sign back in as admin (the current user)
    const adminEmail = auth.currentUser?.email;
    if (adminEmail) {
      await signInWithEmailAndPassword(auth, adminEmail, password);
    }
    
    return userData;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update user data
export const updateUserData = async (
  userId: string,
  data: Partial<Omit<UserData, 'uid' | 'createdAt'>>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Sign in existing user
export const signInUser = async (email: string, password: string): Promise<void> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign out the current user
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Get current user data from Firestore
export const getCurrentUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// Get all users
export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map(doc => ({
      ...doc.data(),
      uid: doc.id
    } as UserData));
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

// Update user's password
export const updateUserPassword = async (
  user: User,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    const credential = EmailAuthProvider.credential(
      user.email!,
      currentPassword
    );
    
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

