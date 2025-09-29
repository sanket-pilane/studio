
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
  fetchUserProfile: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUserProfile = useCallback(async (firebaseUser: User | null = auth.currentUser) => {
    if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if(userDoc.exists()){
            setUserProfile(userDoc.data() as UserProfile);
        } else {
            // Create a default profile if it doesn't exist
            const defaultProfile = { fullName: firebaseUser.displayName || 'New User', vehicle: '' };
            await setDoc(userDocRef, defaultProfile);
            setUserProfile(defaultProfile);
        }
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchUserProfile(user);
        const token = await user.getIdTokenResult();
        setIsAdmin(!!token.claims.admin || user.email === 'admin@example.com');

      } else {
        setIsAdmin(false);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserProfile]);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
    if(email === 'admin@example.com') {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  const signup = async (email: string, pass: string, fullName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), {
        fullName: fullName,
        vehicle: ''
    });
    router.push('/');
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, data, { merge: true });
        await fetchUserProfile();
    }
  };

  const value = { user, userProfile, isAdmin, loading, login, signup, logout, fetchUserProfile, updateUserProfile };

  const publicRoutes = ['/login', '/signup'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!loading) {
      if (!user && !isPublicRoute) {
        router.push('/login');
      }
    }
  }, [user, loading, isPublicRoute, router, isAdmin, pathname]);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <p>Loading...</p>
        </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
