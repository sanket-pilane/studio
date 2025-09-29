import type { Station, Booking } from './types';

export const stations: Station[] = [
  {
    id: 'station-1',
    name: 'Downtown Supercharge Hub',
    address: '123 Market St, San Francisco, CA 94103',
    coordinates: { lat: 37.7915, lng: -122.4021 },
    connectors: [
      { type: 'Tesla', speed: 250 },
      { type: 'CCS', speed: 150 },
    ],
    price: 0.48,
    totalChargers: 12,
    availableChargers: 8,
    rating: 4.8,
  },
  {
    id: 'station-2',
    name: 'Fisherman\'s Wharf Power-Up',
    address: '456 Jefferson St, San Francisco, CA 94109',
    coordinates: { lat: 37.8080, lng: -122.4177 },
    connectors: [
      { type: 'Type 2', speed: 50 },
      { type: 'CHAdeMO', speed: 50 },
    ],
    price: 0.42,
    totalChargers: 6,
    availableChargers: 2,
    rating: 4.5,
  },
  {
    id: 'station-3',
    name: 'Golden Gate Bridge View Chargers',
    address: '789 Lincoln Blvd, San Francisco, CA 94129',
    coordinates: { lat: 37.8065, lng: -122.4752 },
    connectors: [
      { type: 'CCS', speed: 350 },
      { type: 'Tesla', speed: 250 },
    ],
    price: 0.55,
    totalChargers: 8,
    availableChargers: 7,
    rating: 4.9,
  },
  {
    id: 'station-4',
    name: 'SoMa Tech Park Charging',
    address: '101 Howard St, San Francisco, CA 94105',
    coordinates: { lat: 37.7892, lng: -122.3942 },
    connectors: [
      { type: 'Type 2', speed: 22 },
      { type: 'CCS', speed: 50 },
    ],
    price: 0.35,
    totalChargers: 16,
    availableChargers: 15,
    rating: 4.3,
  },
  {
    id: 'station-5',
    name: 'Mission District Juice Point',
    address: '321 Valencia St, San Francisco, CA 94103',
    coordinates: { lat: 37.7685, lng: -122.4222 },
    connectors: [
      { type: 'CHAdeMO', speed: 62.5 },
      { type: 'CCS', speed: 100 },
    ],
    price: 0.45,
    totalChargers: 4,
    availableChargers: 1,
    rating: 4.6,
  },
];

export const bookings: Booking[] = [
    {
      id: 'booking-1',
      stationId: 'station-3',
      stationName: 'Golden Gate Bridge View Chargers',
      userId: 'user-123',
      date: '2024-08-15',
      time: '14:00',
      status: 'Completed',
    },
    {
      id: 'booking-2',
      stationId: 'station-1',
      stationName: 'Downtown Supercharge Hub',
      userId: 'user-123',
      date: '2024-09-01',
      time: '10:30',
      status: 'Confirmed',
    },
     {
      id: 'booking-3',
      stationId: 'station-5',
      stationName: 'Mission District Juice Point',
      userId: 'user-123',
      date: '2024-07-22',
      time: '18:00',
      status: 'Cancelled',
    },
  ];
