
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
import { Star, Zap, Plug, DollarSign, MapPin, Navigation, Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ScrollArea } from '../ui/scroll-area';
import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';
import { createBooking } from '@/ai/flows/booking-flow';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type StationDetailSheetProps = {
  station: Station | null;
  onOpenChange: (isOpen: boolean) => void;
};

export default function StationDetailSheet({ station, onOpenChange }: StationDetailSheetProps) {
    const stationImage = PlaceHolderImages[0];
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [bookingLoading, setBookingLoading] = useState(false);

  const handleGetDirections = () => {
    if (station) {
      const { lat, lng } = station.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, '_blank');
    }
  };

  const handleBookNow = async () => {
    if (!user || !station) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to book a station.",
        });
        router.push('/login');
        return;
    }

    setBookingLoading(true);
    try {
        const now = new Date();
        const booking = {
            stationId: station.id,
            stationName: station.name,
            userId: user.uid,
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().split(' ')[0].slice(0,5),
            status: 'Confirmed' as const
        };
        await createBooking(booking);
        toast({
            title: "Booking Successful!",
            description: `Your booking at ${station.name} is confirmed.`,
        });
        onOpenChange(false);
        router.push('/profile');
    } catch (error) {
        console.error("Booking failed:", error);
        toast({
            variant: "destructive",
            title: "Booking Failed",
            description: "Could not create your booking. Please try again.",
        });
    } finally {
        setBookingLoading(false);
    }
  };


  return (
    <Sheet open={!!station} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg p-0 flex flex-col">
        {station && (
          <>
            <ScrollArea className="flex-grow">
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

                   <Button className="w-full" onClick={handleBookNow} disabled={bookingLoading || station.availableChargers === 0}>
                      {bookingLoading ? <Loader2 className="animate-spin" /> : 
                       station.availableChargers === 0 ? "Station Full" : "Book Now"
                      }
                  </Button>

              </div>
            </ScrollArea>
            <SheetFooter className="p-6 bg-muted/50 mt-auto">
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
