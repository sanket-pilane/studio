
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, Firestore } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { Loader2 } from 'lucide-react';

interface UserProfile {
    fullName: string;
    vehicle: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, fullName: string) => Promise<void>;
  logout: () => void;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth, firestore, isUserLoading } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserProfile = useCallback(async (firebaseUser: User | null, db: Firestore) => {
    if (!firebaseUser) {
        setUserProfile(null);
        return;
    }
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
        } else {
            // This might happen if the user record is created in Auth but the Firestore doc creation fails.
            console.log("User profile doesn't exist, creating one.");
            const defaultProfile = { 
                fullName: firebaseUser.displayName || firebaseUser.email!.split('@')[0], 
                vehicle: '' 
            };
            await setDoc(userDocRef, defaultProfile);
            setUserProfile(defaultProfile);
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }
  }, []);

  useEffect(() => {
    if (isUserLoading) {
      setLoading(true);
      return;
    };
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setUser(user);
      if (user) {
        await fetchUserProfile(user, firestore);
        const token = await user.getIdTokenResult();
        // Check for admin claim OR the hardcoded admin email
        const adminStatus = !!token.claims.admin || user.email === 'admin@example.com';
        setIsAdmin(adminStatus);
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore, isUserLoading, fetchUserProfile]);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
    // onAuthStateChanged will handle the rest
  };

  const signup = async (email: string, pass: string, fullName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    // Create user profile document in Firestore
    await setDoc(doc(firestore, 'users', user.uid), {
        fullName: fullName,
        vehicle: ''
    });
    // Manually trigger profile fetch since onAuthStateChanged might not have the profile yet
    await fetchUserProfile(user, firestore);
  };

  const logout = async () => {
    await signOut(auth);
    // Clear local state immediately
    setUser(null);
    setUserProfile(null);
    setIsAdmin(false);
    router.push('/login');
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        await setDoc(userDocRef, data, { merge: true });
        await fetchUserProfile(user, firestore); // Re-fetch to update state
    }
  };

  const value = { 
      user, 
      userProfile, 
      isAdmin, 
      loading: isUserLoading || loading, 
      login, 
      signup, 
      logout, 
      fetchUserProfile: () => fetchUserProfile(user, firestore), 
      updateUserProfile 
    };

  return (
    <AuthContext.Provider value={value}>
        {(isUserLoading || loading) ? (
             <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
