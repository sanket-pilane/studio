
'use server';
/**
 * @fileOverview Manages charging station data in Firestore.
 *
 * - getStations: Retrieves all stations. If none exist, returns dummy data.
 * - createStation: Creates a new station document.
 * - updateStation: Updates an existing station document.
 * - deleteStation: Deletes a station document.
 */

import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, DocumentData, writeBatch } from 'firebase/firestore';
import { z } from 'genkit';
import { app } from '@/lib/firebase';
import type { Station } from '@/lib/types';
import { RefinedStationSchema } from '@/lib/zod-schemas';


const db = getFirestore(app);
const stationsCollection = collection(db, 'stations');

const dummyStations: Omit<Station, 'id'>[] = [
    {
        name: "Koregaon Park Charge-Up",
        address: "Lane 7, Koregaon Park, Pune",
        coordinates: { lat: 18.536, lng: 73.893 },
        connectors: [{ type: "CCS", speed: 50 }, { type: "CHAdeMO", speed: 40 }],
        price: 18,
        totalChargers: 4,
        availableChargers: 2,
        rating: 4.7
    },
    {
        name: "Hinjewadi IT Park Superchargers",
        address: "Phase 1, Hinjewadi Rajiv Gandhi Infotech Park, Pune",
        coordinates: { lat: 18.591, lng: 73.738 },
        connectors: [{ type: "Tesla", speed: 150 }, { type: "Type 2", speed: 22 }],
        price: 20,
        totalChargers: 8,
        availableChargers: 8,
        rating: 4.9
    },
    {
        name: "Viman Nagar Power Point",
        address: "Near Phoenix Marketcity, Viman Nagar, Pune",
        coordinates: { lat: 18.563, lng: 73.918 },
        connectors: [{ type: "CCS", speed: 100 }, { type: "Type 2", speed: 22 }],
        price: 17,
        totalChargers: 6,
        availableChargers: 5,
        rating: 4.6
    },
    {
        name: "Pune Airport E-Boost",
        address: "Pune International Airport, Lohegaon",
        coordinates: { lat: 18.579, lng: 73.909 },
        connectors: [{ type: "CCS", speed: 50 }],
        price: 22,
        totalChargers: 2,
        availableChargers: 1,
        rating: 4.4
    },
    {
        name: "Baner-Balewadi Juice Stop",
        address: "High Street, Balewadi, Pune",
        coordinates: { lat: 18.570, lng: 73.774 },
        connectors: [{ type: "Type 2", speed: 22 }, { type: "CCS", speed: 50 }],
        price: 19,
        totalChargers: 5,
        availableChargers: 3,
        rating: 4.8
    }
];

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
    
    if (querySnapshot.empty) {
        console.log("No stations found. Seeding database with dummy data.");
        const batch = writeBatch(db);
        const newStations: Station[] = [];
        
        dummyStations.forEach(stationData => {
            const docRef = doc(stationsCollection); 
            batch.set(docRef, stationData);
            newStations.push({ id: docRef.id, ...stationData });
        });
        
        await batch.commit();
        return newStations;
    }
    
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
