
'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from '@vis.gl/react-google-maps';
import { getStations } from '@/ai/flows/station-management-flow';
import type { Station } from '@/lib/types';
import StationDetailSheet from './station-detail-sheet';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

const PUNE_CENTER = { lat: 18.5204, lng: 73.8567 };

export default function MapView() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStations = useCallback(async () => {
    try {
      setLoading(true);
      const stationsData = await getStations();
      setStations(stationsData);
    } catch (error) {
      console.error("Failed to fetch stations:", error);
      // Optionally show a toast or error message to the user
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

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
    <div className="h-full w-full rounded-lg overflow-hidden shadow-lg relative">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={PUNE_CENTER}
          defaultZoom={12}
          mapId="chargerspot_map"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {!loading && stations.map((station) => (
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
      
      {loading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      <StationDetailSheet 
        station={selectedStation} 
        onOpenChange={(isOpen) => {
            if (!isOpen) {
                setSelectedStation(null);
                // Re-fetch stations when the sheet is closed, as data might have changed
                // This is a simple way to sync state after dashboard edits.
                fetchStations();
            }
        }}
      />
    </div>
  );
}
