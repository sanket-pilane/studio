
'use client';

import { useState } from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { Zap } from 'lucide-react';
import type { Station } from '@/lib/types';
import { cn } from '@/lib/utils';

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
      <div className="relative animate-fade-in-up">
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 transform-gpu shadow-lg cursor-pointer',
            isAvailable ? 'bg-green-500' : 'bg-muted',
            isHovered && 'scale-110 -translate-y-1'
          )}
        >
          <Zap className={cn('h-5 w-5', isAvailable ? 'text-white' : 'text-muted-foreground')} />
        </div>
        {isHovered && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 text-sm font-semibold text-primary-foreground bg-primary rounded-md shadow-lg whitespace-nowrap">
            {isAvailable 
              ? `${station.availableChargers} charger${station.availableChargers > 1 ? 's' : ''} available`
              : 'Station full'
            }
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-primary" />
          </div>
        )}
      </div>
    </AdvancedMarker>
  );
}
