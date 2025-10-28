
'use client';

import { useEffect, useState } from 'react';
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Logo from "@/components/icons/logo"
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const { signup, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
        router.push('/');
    }
  }, [user, authLoading, router]);


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password, fullName);
      // The useEffect will handle the redirect
    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message,
      });
      setLoading(false);
    }
  }

  if (authLoading || user) {
    return (
     <div className="flex items-center justify-center h-screen">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
     </div>
   );
 }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] px-4">
    <Card className="w-full max-w-sm bg-background/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
            <Logo className="h-12 w-12 text-primary"/>
        </div>
        <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
        <CardDescription>
          Get started with ChargeSpot Navigator today.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input 
                id="full-name"
                placeholder="Max Robinson" 
                required 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin"/> : 'Create an account'}
            </Button>
          </div>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
