
'use server';
/**
 * @fileOverview Manages booking data in Firestore.
 * 
 * - createBooking: Creates a new booking document.
 * - getUserBookings: Retrieves all bookings for a specific user.
 * - getAllBookings: Retrieves all bookings (for admin use).
 * - cancelBooking: Cancels a specific booking.
 */

import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { z } from 'genkit';
import type { Booking } from '@/lib/types';
import { getFirebaseAdminApp } from '@/firebase/server-init';

const BookingSchema = z.object({
  stationId: z.string(),
  stationName: z.string(),
  userId: z.string(),
  date: z.string(),
  time: z.string(),
  status: z.enum(['Confirmed', 'Completed', 'Cancelled']),
});

export async function createBooking(input: Omit<Booking, 'id'>): Promise<{ id: string }> {
  const db = getFirestore(getFirebaseAdminApp());
  const bookingsCollection = collection(db, 'users', input.userId, 'bookings');
  try {
    const validatedInput = BookingSchema.parse(input);
    const docRef = await addDoc(bookingsCollection, validatedInput);
    return { id: docRef.id };
  } catch (e) {
    console.error("Error creating booking: ", e);
    throw new Error("Failed to create booking.");
  }
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  if (!userId) {
    console.error("getUserBookings called with no userId");
    return [];
  }
  const db = getFirestore(getFirebaseAdminApp());
  const bookingsCollection = collection(db, 'users', userId, 'bookings');
  try {
    const querySnapshot = await getDocs(bookingsCollection);
    const bookings: Booking[] = [];
    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() } as Booking);
    });
    // Sort by date and time, most recent first
    return bookings.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB.getTime() - dateA.getTime();
    });
  } catch(e) {
    console.error("Error getting user bookings: ", e);
    // In a real app, you'd want more robust error handling, maybe return an error object
    return [];
  }
}

// NOTE: This function as-is would be insecure without proper admin checks.
// In a real app, this should be protected by an admin-only role.
export async function getAllBookings(): Promise<Booking[]> {
    const db = getFirestore(getFirebaseAdminApp());
    // This is inefficient. A real app would query each user's booking subcollection.
    // For this demo, we assume a simplified (and less secure) 'bookings' root collection for admins.
    const rootBookingsCollection = collection(db, 'bookings'); 
    try {
        const querySnapshot = await getDocs(rootBookingsCollection);
        const bookings: Booking[] = [];
        querySnapshot.forEach((doc) => {
            bookings.push({ id: doc.id, ...doc.data() } as Booking);
        });
        return bookings;
    } catch(e) {
        console.error("Error getting all bookings: ", e);
        return [];
    }
}

export async function cancelBooking(userId: string, bookingId: string): Promise<{ id: string }> {
    if(!userId || !bookingId) {
        throw new Error("User ID and Booking ID are required to cancel.");
    }
    const db = getFirestore(getFirebaseAdminApp());
    const bookingRef = doc(db, 'users', userId, 'bookings', bookingId);
    try {
        await updateDoc(bookingRef, {
            status: 'Cancelled'
        });
        return { id: bookingId };
    } catch(e) {
        console.error("Error cancelling booking: ", e);
        throw new Error("Failed to cancel booking.");
    }
}
