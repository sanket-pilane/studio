
'use server';
/**
 * @fileOverview Manages charging station data in Firestore.
 *
 * - getStations: Retrieves all stations.
 * - createStation: Creates a new station document.
 * - updateStation: Updates an existing station document.
 * - deleteStation: Deletes a station document.
 */

import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, DocumentData } from 'firebase/firestore';
import { z } from 'genkit';
import { app } from '@/lib/firebase';
import type { Station } from '@/lib/types';
import { RefinedStationSchema } from '@/lib/zod-schemas';


const db = getFirestore(app);
const stationsCollection = collection(db, 'stations');

function docToStation(doc: DocumentData): Station {
    const data = doc.data();
    return {
        id: doc.id,
        name: data.name,
        address: data.address,
        coordinates: data.coordinates,
        connectors: data.connectors,
        price: data.price,
        totalChargers: data.totalChargers,
        availableChargers: data.availableChargers,
        rating: data.rating,
    };
}

export async function getStations(): Promise<Station[]> {
  const querySnapshot = await getDocs(stationsCollection);
  return querySnapshot.docs.map(docToStation);
}


export async function createStation(stationData: Omit<Station, 'id'>): Promise<{ id: string }> {
    const validatedData = RefinedStationSchema.omit({id: true}).parse(stationData);
    const docRef = await addDoc(stationsCollection, validatedData);
    return { id: docRef.id };
}

export async function updateStation(stationId: string, stationData: Partial<Omit<Station, 'id'>>): Promise<{ id: string }> {
    const validatedData = RefinedStationSchema.omit({id: true}).partial().parse(stationData);
    const stationRef = doc(db, 'stations', stationId);
    await updateDoc(stationRef, validatedData);
    return { id: stationId };
}

export async function deleteStation(stationId: string): Promise<{ id: string }> {
    const stationRef = doc(db, 'stations', stationId);
    await deleteDoc(stationRef);
    return { id: stationId };
}
