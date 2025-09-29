
'use server';
/**
 * @fileOverview Manages booking data in Firestore.
 * 
 * - createBooking: Creates a new booking document.
 * - getUserBookings: Retrieves all bookings for a specific user.
 * - getAllBookings: Retrieves all bookings (for admin use).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import type { Booking } from '@/lib/types';

const db = getFirestore(app);

const BookingSchema = z.object({
  stationId: z.string(),
  stationName: z.string(),
  userId: z.string(),
  date: z.string(),
  time: z.string(),
  status: z.enum(['Confirmed', 'Completed', 'Cancelled']),
});

export async function createBooking(input: Booking): Promise<{ id: string }> {
  const validatedInput = BookingSchema.parse(input);
  const docRef = await addDoc(collection(db, 'bookings'), validatedInput);
  return { id: docRef.id };
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const q = query(collection(db, "bookings"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  const bookings: Booking[] = [];
  querySnapshot.forEach((doc) => {
    bookings.push({ id: doc.id, ...doc.data() } as Booking);
  });
  return bookings;
}

export async function getAllBookings(): Promise<Booking[]> {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    const bookings: Booking[] = [];
    querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() } as Booking);
    });
    return bookings;
}
