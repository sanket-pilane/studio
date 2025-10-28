
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';
import RecommendationTool from '@/components/ai/recommendation-tool';
import MapView from '@/components/map/map-view';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-[80%] mx-auto p-4 md:p-8 h-full">
      <div className="flex flex-col gap-8 h-full">
        <div className="animate-fade-in-up">
          <Card>
            <CardHeader>
              <CardTitle>AI Station Finder</CardTitle>
              <CardDescription>Let our AI find the perfect charging station for you.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecommendationTool />
            </CardContent>
          </Card>
        </div>
        <div className="h-[600px] animate-fade-in-up animation-delay-200">
          <MapView />
        </div>
      </div>
    </div>
  );
}
