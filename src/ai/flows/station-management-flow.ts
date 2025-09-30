'use server';
/**
 * @fileOverview Manages charging station data in Firestore.
 *
 * - getStations: Retrieves all stations, seeding initial data if necessary.
 * - createStation: Creates a new station in Firestore.
 * - updateStation: Updates an existing station in Firestore.
 * - deleteStation: Deletes a station from Firestore.
 */

import {
  StationSchema,
  RefinedStationSchema,
  CreateStationSchema,
} from "@/lib/zod-schemas";
import type { Station } from "@/lib/types";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  getDoc,
  runTransaction,
} from "firebase/firestore";
import { app } from "@/lib/firebase";

const db = getFirestore(app);
const stationsCollection = collection(db, "stations");

const initialStations: Omit<Station, "id">[] = [
  {
    name: "Koregaon Park Charge-Up",
    address: "Lane 7, Koregaon Park, Pune",
    coordinates: { lat: 18.536, lng: 73.893 },
    connectors: [
      { type: "CCS", speed: 50 },
      { type: "CHAdeMO", speed: 40 },
    ],
    price: 18,
    totalChargers: 4,
    availableChargers: 2,
    rating: 4.7,
  },
  {
    name: "Hinjewadi IT Park Superchargers",
    address: "Phase 1, Hinjewadi Rajiv Gandhi Infotech Park, Pune",
    coordinates: { lat: 18.591, lng: 73.738 },
    connectors: [
      { type: "Tesla", speed: 150 },
      { type: "Type 2", speed: 22 },
    ],
    price: 20,
    totalChargers: 8,
    availableChargers: 8,
    rating: 4.9,
  },
  {
    name: "Viman Nagar Power Point",
    address: "Near Phoenix Marketcity, Viman Nagar, Pune",
    coordinates: { lat: 18.563, lng: 73.918 },
    connectors: [
      { type: "CCS", speed: 100 },
      { type: "Type 2", speed: 22 },
    ],
    price: 17,
    totalChargers: 6,
    availableChargers: 5,
    rating: 4.6,
  },
  {
    name: "Pune Airport E-Boost",
    address: "Pune International Airport, Lohegaon",
    coordinates: { lat: 18.579, lng: 73.909 },
    connectors: [{ type: "CCS", speed: 50 }],
    price: 22,
    totalChargers: 2,
    availableChargers: 1,
    rating: 4.4,
  },
  {
    name: "Baner-Balewadi Juice Stop",
    address: "High Street, Balewadi, Pune",
    coordinates: { lat: 18.57, lng: 73.774 },
    connectors: [
      { type: "Type 2", speed: 22 },
      { type: "CCS", speed: 50 },
    ],
    price: 19,
    totalChargers: 5,
    availableChargers: 3,
    rating: 4.8,
  },
];

async function seedInitialStations(): Promise<void> {
    console.log("Attempting to seed initial stations...");
    const metadataRef = doc(db, 'metadata', 'stations');

    try {
        await runTransaction(db, async (transaction) => {
            const metadataDoc = await transaction.get(metadataRef);

            if (metadataDoc.exists() && metadataDoc.data().seeded) {
                console.log("Stations already seeded. Skipping.");
                return;
            }

            console.log("Seeding initial stations into Firestore...");
            for (const stationData of initialStations) {
                const docRef = doc(stationsCollection); // Auto-generate ID
                transaction.set(docRef, stationData);
            }

            // Set the seeded flag
            transaction.set(metadataRef, { seeded: true });
            console.log("Seeding complete and metadata flag set.");
        });
    } catch (error) {
        console.error("Error during seeding transaction: ", error);
        // If the transaction fails, it will automatically roll back.
    }
}


export async function getStations(): Promise<Station[]> {
  const snapshot = await getDocs(stationsCollection);
  if (snapshot.empty) {
    // If the database is empty, seed it with initial data
    await seedInitialStations();
    // Fetch again after seeding
    const afterSeedSnapshot = await getDocs(stationsCollection);
    const stations: Station[] = [];
    afterSeedSnapshot.forEach((doc) => {
      stations.push({ id: doc.id, ...doc.data() } as Station);
    });
    return stations;
  }

  const stations: Station[] = [];
  snapshot.forEach((doc) => {
    stations.push({ id: doc.id, ...doc.data() } as Station);
  });
  return stations;
}

export async function createStation(
  stationData: Omit<Station, "id">
): Promise<{ id: string }> {
  const validatedData = CreateStationSchema.parse(stationData);
  const docRef = await addDoc(stationsCollection, validatedData);
  return { id: docRef.id };
}

export async function updateStation(
  stationId: string,
  stationData: Partial<Omit<Station, "id">>
): Promise<{ id: string }> {
  const stationRef = doc(db, "stations", stationId);
  const stationSnap = await getDoc(stationRef);
  if (!stationSnap.exists()) {
    throw new Error("Station not found");
  }
  const existingStation = stationSnap.data();

  // Create a temporary object for validation that includes all required fields
  const dataToValidate = {
    ...existingStation,
    ...stationData,
    id: stationId, // Add id to satisfy the full schema before parsing
  };

  // Validate full object
  RefinedStationSchema.parse(dataToValidate);

  // Validate only the fields being updated
  const finalUpdateData = StationSchema.omit({ id: true })
    .partial()
    .parse(stationData);

  await updateDoc(stationRef, finalUpdateData);
  return { id: stationId };
}

export async function deleteStation(
  stationId: string
): Promise<{ id: string }> {
  if (!stationId) {
    throw new Error("Station ID is required");
  }
  const stationRef = doc(db, "stations", stationId);
  await deleteDoc(stationRef);
  return { id: stationId };
}
