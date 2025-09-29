
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAuth, onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Hardcoded admin check
        setIsAdmin(user.email === 'admin@example.com');
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const authInstance = getAuth();
    await signInWithEmailAndPassword(authInstance, email, pass);
    if(email === 'admin@example.com') {
      router.push('/dashboard');
    } else {
      router.push('/profile');
    }
  };

  const signup = async (email: string, pass: string) => {
    const authInstance = getAuth();
    await createUserWithEmailAndPassword(authInstance, email, pass);
    router.push('/profile');
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const value = { user, isAdmin, loading, login, signup, logout };

  const publicRoutes = ['/login', '/signup'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!loading) {
      if (!user && !isPublicRoute) {
        router.push('/login');
      }
      if (user && isPublicRoute) {
        router.push('/');
      }
    }
  }, [user, loading, isPublicRoute, router]);

  if (loading || (!user && !isPublicRoute) || (user && isPublicRoute)) {
    return null; // Or a loading spinner
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
