
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db, initializationPromise } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserProfile = useCallback(async (firebaseUser: User | null) => {
    if (!firebaseUser) {
        setUserProfile(null);
        return;
    }
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
    } else {
        const defaultProfile = { 
            fullName: firebaseUser.displayName || firebaseUser.email!.split('@')[0], 
            vehicle: '' 
        };
        try {
            await setDoc(userDocRef, defaultProfile);
            setUserProfile(defaultProfile);
        } catch (error) {
            console.error("Error creating user profile:", error);
        }
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      await initializationPromise; // Wait for Firebase to be ready
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUser(user);
          await fetchUserProfile(user);
          const token = await user.getIdTokenResult();
          setIsAdmin(!!token.claims.admin || user.email === 'admin@example.com');
        } else {
          setUser(null);
          setUserProfile(null);
          setIsAdmin(false);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    };

    initialize();
  }, [fetchUserProfile]);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (email: string, pass: string, fullName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), {
        fullName: fullName,
        vehicle: ''
    });
    await fetchUserProfile(user);
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, data, { merge: true });
        await fetchUserProfile(user);
    }
  };

  const value = { 
      user, 
      userProfile, 
      isAdmin, 
      loading, 
      login, 
      signup, 
      logout, 
      fetchUserProfile: () => fetchUserProfile(user), 
      updateUserProfile 
    };

  return (
    <AuthContext.Provider value={value}>
        {loading ? (
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
