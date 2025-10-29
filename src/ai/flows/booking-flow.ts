
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
import { z } from 'genkit';
import { getDb } from '@/firebase/server-init';
import type { Booking } from '@/lib/types';
import { error } from 'console';

const BookingSchema = z.object({
  stationId: z.string(),
  stationName: z.string(),
  userId: z.string(),
  date: z.string(),
  time: z.string(),
  status: z.enum(['Confirmed', 'Completed', 'Cancelled']),
});

export async function createBooking(input: Omit<Booking, 'id'>): Promise<{ id: string }> {
  const db = getDb();
  const bookingsCollection = collection(db, 'bookings');
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
  const db = getDb();
  const bookingsCollection = collection(db, 'bookings');
  const q = query(bookingsCollection, where("userId", "==", userId));
  try {
    const querySnapshot = await getDocs(q);
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

export async function getAllBookings(): Promise<Booking[]> {
    const db = getDb();
    const bookingsCollection = collection(db, 'bookings');
    try {
        const querySnapshot = await getDocs(bookingsCollection);
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

export async function cancelBooking(bookingId: string): Promise<{ id: string }> {
    if(!bookingId) {
        throw new Error("Booking ID is required to cancel.");
    }
    const db = getDb();
    const bookingRef = doc(db, 'bookings', bookingId);
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
