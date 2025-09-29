'use client';

import { useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from '@vis.gl/react-google-maps';
import { stations } from '@/lib/data';
import type { Station } from '@/lib/types';
import StationDetailSheet from './station-detail-sheet';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

const SAN_FRANCISCO_CENTER = { lat: 37.7749, lng: -122.4194 };

export default function MapView() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-muted rounded-lg">
        <Alert variant="destructive" className="w-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription>
            Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-lg">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={SAN_FRANCISCO_CENTER}
          defaultZoom={12}
          mapId="chargerspot_map"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {stations.map((station) => (
            <AdvancedMarker
              key={station.id}
              position={station.coordinates}
              onClick={() => setSelectedStation(station)}
            >
              <Pin
                background={'hsl(var(--primary))'}
                borderColor={'hsl(var(--primary-foreground))'}
                glyphColor={'hsl(var(--primary-foreground))'}
              />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
      
      <StationDetailSheet 
        station={selectedStation} 
        onOpenChange={(isOpen) => {
            if (!isOpen) {
                setSelectedStation(null);
            }
        }}
      />
    </div>
  );
}
