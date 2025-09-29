'use client';

import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Station } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Star, Zap, Plug, DollarSign, MapPin, ExternalLink, Navigation } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type StationDetailSheetProps = {
  station: Station | null;
  onOpenChange: (isOpen: boolean) => void;
};

export default function StationDetailSheet({ station, onOpenChange }: StationDetailSheetProps) {
    const stationImage = PlaceHolderImages[0];

  const handleGetDirections = () => {
    if (station) {
      const { lat, lng } = station.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Sheet open={!!station} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg p-0">
        {station && (
          <>
            <SheetHeader className="p-6 pb-2">
              <SheetTitle className="text-2xl">{station.name}</SheetTitle>
              <SheetDescription className="flex items-center gap-2">
                <MapPin className="h-4 w-4"/> {station.address}
              </SheetDescription>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold">{station.rating}</span>
                    <span className="text-xs text-muted-foreground">/ 5.0</span>
                </div>
                <Badge variant={station.availableChargers > 0 ? 'default' : 'destructive'} className="bg-green-500 hover:bg-green-600 text-white">
                    {station.availableChargers > 0 ? 'Available' : 'Full'}
                </Badge>
              </div>
            </SheetHeader>
            <div className="p-6 pt-0">
                {stationImage && (
                    <div className="aspect-video rounded-md overflow-hidden relative mb-4">
                        <Image
                            src={stationImage.imageUrl}
                            alt={stationImage.description}
                            fill
                            style={{objectFit: 'cover'}}
                            data-ai-hint={stationImage.imageHint}
                        />
                    </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 mt-0.5 text-primary"/>
                        <div>
                            <p className="text-muted-foreground">Availability</p>
                            <p className="font-semibold">{station.availableChargers} / {station.totalChargers} chargers</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-2">
                        <DollarSign className="h-4 w-4 mt-0.5 text-primary"/>
                        <div>
                            <p className="text-muted-foreground">Price</p>
                            <p className="font-semibold">${station.price} / kWh</p>
                        </div>
                    </div>
                </div>

                <Separator className="my-4" />

                <h4 className="font-semibold mb-3 flex items-center gap-2"><Plug className="h-4 w-4 text-primary" /> Connectors</h4>
                <div className="space-y-2">
                    {station.connectors.map((c, i) => (
                        <div key={i} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                            <span className="font-medium">{c.type}</span>
                            <Badge variant="secondary">{c.speed} kW</Badge>
                        </div>
                    ))}
                </div>

                <Separator className="my-4" />

                <h4 className="font-semibold mb-3">Book a Slot</h4>
                <p className="text-sm text-muted-foreground mb-4">Secure your spot before you arrive.</p>

                 <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Book Now
                </Button>

            </div>
            <SheetFooter className="p-6 bg-muted/50">
              <Button onClick={handleGetDirections} className="w-full">
                <Navigation className="mr-2 h-4 w-4" /> Get Directions
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
