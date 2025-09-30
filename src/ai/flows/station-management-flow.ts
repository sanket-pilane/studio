'use server';
/**
 * @fileOverview Manages charging station data in-memory.
 *
 * - getStations: Retrieves all stations.
 * - createStation: Creates a new station in the in-memory list.
 * - updateStation: Updates an existing station in the in-memory list.
 * - deleteStation: Deletes a station from the in-memory list.
 */

import { StationSchema } from '@/lib/zod-schemas';
import type { Station } from '@/lib/types';
import { randomUUID } from 'crypto';

let stations: Station[] = [
  {
    id: 'station-1',
    name: 'Koregaon Park Charge-Up',
    address: 'Lane 7, Koregaon Park, Pune',
    coordinates: { lat: 18.536, lng: 73.893 },
    connectors: [
      { type: 'CCS', speed: 50 },
      { type: 'CHAdeMO', speed: 40 },
    ],
    price: 18,
    totalChargers: 4,
    availableChargers: 2,
    rating: 4.7,
  },
  {
    id: 'station-2',
    name: 'Hinjewadi IT Park Superchargers',
    address: 'Phase 1, Hinjewadi Rajiv Gandhi Infotech Park, Pune',
    coordinates: { lat: 18.591, lng: 73.738 },
    connectors: [
      { type: 'Tesla', speed: 150 },
      { type: 'Type 2', speed: 22 },
    ],
    price: 20,
    totalChargers: 8,
    availableChargers: 8,
    rating: 4.9,
  },
  {
    id: 'station-3',
    name: 'Viman Nagar Power Point',
    address: 'Near Phoenix Marketcity, Viman Nagar, Pune',
    coordinates: { lat: 18.563, lng: 73.918 },
    connectors: [
      { type: 'CCS', speed: 100 },
      { type: 'Type 2', speed: 22 },
    ],
    price: 17,
    totalChargers: 6,
    availableChargers: 5,
    rating: 4.6,
  },
  {
    id: 'station-4',
    name: 'Pune Airport E-Boost',
    address: 'Pune International Airport, Lohegaon',
    coordinates: { lat: 18.579, lng: 73.909 },
    connectors: [{ type: 'CCS', speed: 50 }],
    price: 22,
    totalChargers: 2,
    availableChargers: 1,
    rating: 4.4,
  },
  {
    id: 'station-5',
    name: 'Baner-Balewadi Juice Stop',
    address: 'High Street, Balewadi, Pune',
    coordinates: { lat: 18.57, lng: 73.774 },
    connectors: [
      { type: 'Type 2', speed: 22 },
      { type: 'CCS', speed: 50 },
    ],
    price: 19,
    totalChargers: 5,
    availableChargers: 3,
    rating: 4.8,
  },
];

export async function getStations(): Promise<Station[]> {
  // Return a copy to prevent direct mutation
  return Promise.resolve(JSON.parse(JSON.stringify(stations)));
}

export async function createStation(
  stationData: Omit<Station, 'id'>
): Promise<{ id: string }> {
  const validationSchema = StationSchema.omit({ id: true }).refine(
    (data) => data.availableChargers <= data.totalChargers,
    {
      message: 'Available chargers cannot exceed total chargers.',
      path: ['availableChargers'],
    }
  );
  const validatedData = validationSchema.parse(stationData);

  const newStation: Station = {
    ...validatedData,
    id: randomUUID(),
  };

  stations.push(newStation);
  return { id: newStation.id };
}

export async function updateStation(
  stationId: string,
  stationData: Partial<Omit<Station, 'id'>>
): Promise<{ id: string }> {
  const updateSchema = StationSchema.omit({ id: true })
    .partial()
    .refine(
      (data) =>
        data.availableChargers === undefined ||
        data.totalChargers === undefined ||
        data.availableChargers <= data.totalChargers,
      {
        message: 'Available chargers cannot exceed total chargers.',
        path: ['availableChargers'],
      }
    );
  const validatedData = updateSchema.parse(stationData);

  const stationIndex = stations.findIndex((s) => s.id === stationId);
  if (stationIndex === -1) {
    throw new Error('Station not found');
  }

  stations[stationIndex] = { ...stations[stationIndex], ...validatedData };
  return { id: stationId };
}

export async function deleteStation(stationId: string): Promise<{ id: string }> {
  const stationIndex = stations.findIndex((s) => s.id === stationId);
  if (stationIndex === -1) {
    throw new Error('Station not found');
  }
  stations.splice(stationIndex, 1);
  return { id: stationId };
}
