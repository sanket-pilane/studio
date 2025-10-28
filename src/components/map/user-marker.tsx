
'use client';

import { AdvancedMarker } from '@vis.gl/react-google-maps';

type UserMarkerProps = {
  position: google.maps.LatLngLiteral;
};

export default function UserMarker({ position }: UserMarkerProps) {
  return (
    <AdvancedMarker position={position}>
      <div className="relative">
        {/* Outer pulse animation */}
        <div className="absolute w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-50"></div>
        {/* Inner solid dot */}
        <div className="relative w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
      </div>
    </AdvancedMarker>
  );
}
