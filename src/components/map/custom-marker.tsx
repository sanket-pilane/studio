
'use client';

import { useState } from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { Zap, Star, IndianRupee } from 'lucide-react';
import type { Station } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

type CustomMarkerProps = {
  station: Station;
  onClick: () => void;
};

export default function CustomMarker({ station, onClick }: CustomMarkerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isAvailable = station.availableChargers > 0;

  return (
    <AdvancedMarker
      position={station.coordinates}
      onClick={onClick}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <div className="relative animate-fade-in-up flex justify-center">
        {/* The Info Window that appears on hover */}
        {isHovered && (
          <div className="absolute bottom-full mb-3 w-64 transform transition-all duration-200 ease-in-out">
            <div className="bg-background border border-border rounded-lg shadow-xl p-4">
              <h3 className="font-bold text-base mb-2">{station.name}</h3>
              <div className="flex justify-between items-center text-sm space-x-4">
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-green-500" />
                  <span className="font-semibold">{station.availableChargers} / {station.totalChargers}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="font-semibold">{station.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-4 w-4 text-primary" />
                  <span className="font-semibold">₹{station.price}/kWh</span>
                </div>
              </div>
               {/* Arrow pointing down to the marker */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[-9px] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-background" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-border" style={{ zIndex: -1 }}/>
            </div>
          </div>
        )}
        
        {/* The Marker Pin */}
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 transform-gpu shadow-lg cursor-pointer',
            isAvailable ? 'bg-green-500' : 'bg-muted',
            isHovered && 'scale-110 -translate-y-1'
          )}
        >
          <Zap className={cn('h-5 w-5', isAvailable ? 'text-white' : 'text-muted-foreground')} />
        </div>
      </div>
    </AdvancedMarker>
  );
}
