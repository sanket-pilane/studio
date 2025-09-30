import RecommendationTool from '@/components/ai/recommendation-tool';
import MapView from '@/components/map/map-view';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:p-8 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        <div className="lg:col-span-4 xl:col-span-3 animate-fade-in-up">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>AI Station Finder</CardTitle>
              <CardDescription>Let our AI find the perfect charging station for you.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecommendationTool />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-8 xl:col-span-9 min-h-[500px] lg:min-h-0 animate-fade-in-up animation-delay-200">
          <MapView />
        </div>
      </div>
    </div>
  );
}
