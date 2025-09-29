
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

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
    await signInWithEmailAndPassword(auth, email, pass);
    if(email === 'admin@example.com') {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  const signup = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
    router.push('/');
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
        if(isAdmin){
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      }
    }
  }, [user, loading, isPublicRoute, router, isAdmin]);

  // This prevents a flash of the login page if the user is already logged in.
  if (loading || (!user && !isPublicRoute)) {
    return (
        <div className="flex items-center justify-center h-screen">
            {/* You can replace this with a more sophisticated loader component */}
            <p>Loading...</p>
        </div>
    );
  }
  
  // This prevents a flash of the public page if the user is logged in.
  if (user && isPublicRoute) {
      return (
        <div className="flex items-center justify-center h-screen">
            <p>Redirecting...</p>
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
