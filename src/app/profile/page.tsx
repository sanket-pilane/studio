
'use client';

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { CreditCard, Car, Loader2, XCircle } from "lucide-react"
import { getUserBookings, cancelBooking } from "@/ai/flows/booking-flow";
import type { Booking } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import EditProfileDialog from "@/components/profile/edit-profile-dialog";

export default function ProfilePage() {
  const { user, loading: authLoading, userProfile, fetchUserProfile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchBookings = () => {
    if (user) {
      setLoadingBookings(true);
      getUserBookings(user.uid)
        .then(setBookings)
        .finally(() => setLoadingBookings(false));
    }
  }

  useEffect(() => {
    fetchBookings();
    if(user) fetchUserProfile();
  }, [user]);
  
  const handleCancelBooking = async (bookingId?: string) => {
    if(!bookingId || !user) return;
    try {
        await cancelBooking(user.uid, bookingId);
        toast({
            title: "Booking Cancelled",
            description: "Your booking has been successfully cancelled.",
        });
        fetchBookings(); // Refresh bookings list
    } catch (error) {
        console.error("Failed to cancel booking:", error);
        toast({
            variant: "destructive",
            title: "Cancellation Failed",
            description: "Could not cancel your booking. Please try again.",
        });
    }
  }

  if (authLoading || !user || !userProfile) {
    return (
      <div className="container mx-auto p-4 md:p-8 flex justify-center items-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const profile = {
    name: userProfile.fullName || user.displayName || "Alex Doe",
    email: user.email || "alex.doe@example.com",
    initials: userProfile.fullName?.charAt(0) || user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase() || "A",
    avatarUrl: user.photoURL || undefined,
    vehicle: userProfile.vehicle || "Not set",
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                <AvatarFallback>{profile.initials}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <CardDescription>{profile.email}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
               <div className="flex items-center">
                <Car className="mr-3 h-5 w-5" />
                <span>Vehicle: <strong>{profile.vehicle}</strong></span>
              </div>
              <div className="flex items-center">
                <CreditCard className="mr-3 h-5 w-5" />
                <span>Payment: <strong>Visa **** 4242</strong></span>
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => setIsEditDialogOpen(true)}>
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Booking History</CardTitle>
              <CardDescription>A record of all your past and upcoming charging sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingBookings ? (
                 <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Station</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.length > 0 ? bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.stationName}</TableCell>
                        <TableCell>{booking.date} at {booking.time}</TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={
                              booking.status === 'Confirmed' ? 'default' :
                              booking.status === 'Completed' ? 'secondary' :
                              'destructive'
                            }
                            className={cn({
                              'bg-blue-500 hover:bg-blue-600 text-white': booking.status === 'Confirmed',
                              'bg-green-500 hover:bg-green-600': booking.status === 'Completed',
                              'bg-red-500 hover:bg-red-600 text-white': booking.status === 'Cancelled',
                            })}
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            {booking.status === 'Confirmed' && (
                                <Button variant="ghost" size="sm" onClick={() => handleCancelBooking(booking.id)}>
                                    <XCircle className="mr-2 h-4 w-4" /> Cancel
                                </Button>
                            )}
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">No bookings found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <EditProfileDialog 
        isOpen={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        onProfileUpdate={() => {
          fetchUserProfile();
          toast({ title: 'Profile Updated', description: 'Your profile has been successfully updated.' });
        }}
      />
    </div>
  )
}
