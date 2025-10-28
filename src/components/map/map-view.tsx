
'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
} from '@vis.gl/react-google-maps';
import { getStations } from '@/ai/flows/station-management-flow';
import type { Station } from '@/lib/types';
import StationDetailSheet from './station-detail-sheet';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import CustomMarker from './custom-marker';

const PUNE_CENTER = { lat: 18.5204, lng: 73.8567 };

// A simple component for the user's location marker
const UserLocationMarker = () => (
    <div className="relative w-4 h-4">
        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping"></div>
        <div className="relative w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
    </div>
);


export default function MapView() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);

  const fetchStations = useCallback(async () => {
    try {
      setLoading(true);
      const stationsData = await getStations();
      setStations(stationsData);
    } catch (error) {
      console.error("Failed to fetch stations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStations();
    
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn(`Geolocation error: ${error.message}. Defaulting to Pune.`);
          // App continues to work even if permission is denied
        }
      );
    }
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

  const mapCenter = userPosition || PUNE_CENTER;

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-lg relative">
      <APIProvider apiKey={apiKey}>
        <Map
          center={mapCenter}
          defaultZoom={12}
          mapId="chargerspot_map"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {userPosition && (
              <AdvancedMarker position={userPosition}>
                  <UserLocationMarker/>
              </AdvancedMarker>
          )}

          {!loading && stations.map((station) => (
            <CustomMarker 
              key={station.id} 
              station={station} 
              onClick={() => setSelectedStation(station)}
            />
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
                fetchStations();
            }
        }}
      />
    </div>
  );
}
