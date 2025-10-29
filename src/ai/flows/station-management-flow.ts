
'use server';
/**
 * @fileOverview Manages charging station data in Firestore.
 *
 * - getStations: Retrieves all stations, seeding initial data if necessary.
 * - createStation: Creates a new station in Firestore.
 * - updateStation: Updates an existing station in Firestore.
 * - deleteStation: Deletes a station from Firestore.
 */
import { getFirestore } from 'firebase-admin/firestore';
import {
  StationSchema,
  RefinedStationSchema,
  CreateStationSchema,
} from "@/lib/zod-schemas";
import type { Station } from "@/lib/types";
import { getFirebaseAdminApp } from '@/firebase/server-init';
import { PlaceHolderImages } from "@/lib/placeholder-images";

const initialStations: Omit<Station, "id">[] = [
  {
    name: "JW Marriott Pune",
    address: "Senapati Bapat Rd, Shivajinagar, Pune, Maharashtra 411053",
    coordinates: { lat: 18.5303, lng: 73.8344 },
    connectors: [
      { type: "CCS2", speed: 60 },
      { type: "Type-2 AC", speed: 7.4 }
    ],
    price: 19.5,
    totalChargers: 3,
    availableChargers: 1,
    rating: 4.5,
  },
  {
    name: "Westend Mall Statiq Station",
    address: "1st Floor Parking, Parihar Chowk, Aundh, Pune, Maharashtra 411007",
    coordinates: { lat: 18.5678, lng: 73.8015 },
    connectors: [
      { type: "CCS2", speed: 50 },
      { type: "CHAdeMO", speed: 50 }
    ],
    price: 18.0,
    totalChargers: 4,
    availableChargers: 3,
    rating: 4.7
  },
  {
    name: "TML Panchjanya Motors",
    address: "Block D2, Chinchwad East, Pimpri-Chinchwad, Maharashtra 411019",
    coordinates: { lat: 18.6508, lng: 73.8052 },
    connectors: [
      { type: "CCS2", speed: 25 },
      { type: "Type-2 AC", speed: 3.3 }
    ],
    price: 15.0,
    totalChargers: 4,
    availableChargers: 0,
    rating: 4.1
  },
  {
    name: "Amanora Park Town ChargeGrid",
    address: "Magarpatta Road, Hadapsar, Pune, Maharashtra 411028",
    coordinates: { lat: 18.5262, lng: 73.9478 },
    connectors: [
      { type: "CCS2", speed: 50 }
    ],
    price: 17.5,
    totalChargers: 1,
    availableChargers: 1,
    rating: 4.8
  },
  {
    name: "PMC - Ganesh Kala Krida Manch",
    address: "Swargate, Shukrawar Peth, Pune, Maharashtra 411042",
    coordinates: { lat: 18.5085, lng: 73.8569 },
    connectors: [
      { type: "Type-2 AC", speed: 7.4 }
    ],
    price: 14.0,
    totalChargers: 2,
    availableChargers: 2,
    rating: 3.9
  }
];

async function seedInitialStations(): Promise<void> {
    console.log("Attempting to seed initial stations...");
    const db = getFirestore(getFirebaseAdminApp());
    try {
        await db.runTransaction(async (transaction) => {
            const metadataRef = db.collection('metadata').doc('stations');
            const stationsCol = db.collection("stations");
            
            const metadataDoc = await transaction.get(metadataRef);

            if (metadataDoc.exists && metadataDoc.data()?.seeded) {
                console.log("Stations already seeded. Skipping.");
                return;
            }

            console.log("Seeding initial stations into Firestore...");
            for (const stationData of initialStations) {
                const docRef = stationsCol.doc(); // Auto-generate ID
                transaction.set(docRef, stationData);
            }

            // Set the seeded flag
            transaction.set(metadataRef, { seeded: true });
            console.log("Seeding complete and metadata flag set.");
        });
    } catch (error) {
        console.error("Error during seeding transaction: ", error);
    }
}


export async function getStations(): Promise<Station[]> {
  const db = getFirestore(getFirebaseAdminApp());
  const stationsCol = db.collection('stations');
  const snapshot = await stationsCol.get();
  
  if (snapshot.empty) {
    await seedInitialStations();
    const afterSeedSnapshot = await stationsCol.get();
    const stations: Station[] = [];
    afterSeedSnapshot.forEach((doc, index) => {
      const image = PlaceHolderImages.length > 0 ? PlaceHolderImages[index % PlaceHolderImages.length] : undefined;
      stations.push({ id: doc.id, ...doc.data(), imageUrl: image?.imageUrl } as Station);
    });
    return stations;
  }

  const stations: Station[] = [];
  snapshot.forEach((doc, index) => {
    const image = PlaceHolderImages.length > 0 ? PlaceHolderImages[index % PlaceHolderImages.length] : undefined;
    stations.push({ id: doc.id, ...doc.data(), imageUrl: image?.imageUrl } as Station);
  });
  return stations;
}

export async function createStation(
  stationData: Omit<Station, "id">
): Promise<{ id: string }> {
  const db = getFirestore(getFirebaseAdminApp());
  const stationsCol = db.collection('stations');
  const validatedData = CreateStationSchema.parse(stationData);
  const docRef = await stationsCol.add(validatedData);
  return { id: docRef.id };
}

export async function updateStation(
  stationId: string,
  stationData: Partial<Omit<Station, "id">>
): Promise<{ id: string }> {
  const db = getFirestore(getFirebaseAdminApp());
  const stationRef = db.collection("stations").doc(stationId);
  const stationSnap = await stationRef.get();
  if (!stationSnap.exists) {
    throw new Error("Station not found");
  }
  const existingStation = stationSnap.data();

  const dataToValidate = {
    ...existingStation,
    ...stationData,
    id: stationId, 
  };

  RefinedStationSchema.parse(dataToValidate);

  const finalUpdateData = StationSchema.omit({ id: true })
    .partial()
    .parse(stationData);

  await stationRef.update(finalUpdateData);
  return { id: stationId };
}

export async function deleteStation(
  stationId: string
): Promise<{ id: string }> {
  if (!stationId) {
    throw new Error("Station ID is required");
  }
  const db = getFirestore(getFirebaseAdminApp());
  const stationRef = db.collection("stations").doc(stationId);
  await stationRef.delete();
  return { id: stationId };
}
