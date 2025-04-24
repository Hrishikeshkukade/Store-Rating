import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getCurrentUserData, UserData, UserRole, USER_ROLES } from '../services/auth-service';

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  isAdmin: boolean;
  isStoreOwner: boolean;
  isNormalUser: boolean;
  loading: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  isAdmin: false,
  isStoreOwner: false,
  isNormalUser: false,
  loading: true,
  refreshUserData: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔍 DEBUG: See exactly what role is coming from Firestore



  // Function to fetch user data from Firestore
  const fetchUserData = async (user: User) => {
    try {
      const data = await getCurrentUserData(user.uid);
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null);
    }
  };

  // Function to refresh user data (useful after profile updates)
  const refreshUserData = async () => {
    if (currentUser) {
      await fetchUserData(currentUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await fetchUserData(user);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Derived state for user roles - strictly compare with role constants
  const isAdmin = userData?.role === USER_ROLES.ADMIN;
  const isStoreOwner = userData?.role === USER_ROLES.STORE_OWNER;
  const isNormalUser = userData?.role === USER_ROLES.USER;

  const value = {
    currentUser,
    userData,
    isAdmin,
    isStoreOwner,
    isNormalUser,
    loading,
    refreshUserData,
  };

  useEffect(() => {
    console.log('🔐 currentUser UID →', currentUser?.uid ?? 'none');
    console.log('🗂️  userData →', userData);
    console.log('🏷️  userData.role →', userData?.role ?? 'undefined');
    console.log('🔑 USER_ROLES.ADMIN →', USER_ROLES.ADMIN);
    console.log('🧐 isAdmin derived →', isAdmin);
  }, [currentUser, userData, isAdmin]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};