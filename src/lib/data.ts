import type { Station, Booking } from './types';

export const stations: Station[] = [
  {
    id: 'station-1',
    name: 'Koregaon Park Charge-Up',
    address: '123 N Main Rd, Koregaon Park, Pune, MH 411001',
    coordinates: { lat: 18.5361, lng: 73.8937 },
    connectors: [
      { type: 'Tesla', speed: 250 },
      { type: 'CCS', speed: 150 },
    ],
    price: 18,
    totalChargers: 10,
    availableChargers: 7,
    rating: 4.7,
  },
  {
    id: 'station-2',
    name: 'Deccan Gymkhana Power Point',
    address: '456 JM Road, Deccan Gymkhana, Pune, MH 411004',
    coordinates: { lat: 18.5209, lng: 73.8441 },
    connectors: [
      { type: 'Type 2', speed: 50 },
      { type: 'CHAdeMO', speed: 50 },
    ],
    price: 15,
    totalChargers: 8,
    availableChargers: 3,
    rating: 4.5,
  },
  {
    id: 'station-3',
    name: 'Hinjewadi IT Park Superchargers',
    address: '789 Rajiv Gandhi Infotech Park, Hinjewadi, Pune, MH 411057',
    coordinates: { lat: 18.5912, lng: 73.7389 },
    connectors: [
      { type: 'CCS', speed: 350 },
      { type: 'Tesla', speed: 250 },
    ],
    price: 20,
    totalChargers: 16,
    availableChargers: 12,
    rating: 4.9,
  },
  {
    id: 'station-4',
    name: 'Viman Nagar EV Plaza',
    address: '101 Dutta Mandir Chowk, Viman Nagar, Pune, MH 411014',
    coordinates: { lat: 18.5679, lng: 73.9143 },
    connectors: [
      { type: 'Type 2', speed: 22 },
      { type: 'CCS', speed: 50 },
    ],
    price: 12,
    totalChargers: 12,
    availableChargers: 10,
    rating: 4.3,
  },
  {
    id: 'station-5',
    name: 'Baner-Balewadi Juice Stop',
    address: '321 Baner - Balewadi High St, Balewadi, Pune, MH 411045',
    coordinates: { lat: 18.5704, lng: 73.7760 },
    connectors: [
      { type: 'CHAdeMO', speed: 62.5 },
      { type: 'CCS', speed: 100 },
    ],
    price: 17,
    totalChargers: 6,
    availableChargers: 2,
    rating: 4.6,
  },
];

export const bookings: Booking[] = [
    {
      id: 'booking-1',
      stationId: 'station-3',
      stationName: 'Hinjewadi IT Park Superchargers',
      userId: 'user-123',
      date: '2024-08-15',
      time: '14:00',
      status: 'Completed',
    },
    {
      id: 'booking-2',
      stationId: 'station-1',
      stationName: 'Koregaon Park Charge-Up',
      userId: 'user-123',
      date: '2024-09-01',
      time: '10:30',
      status: 'Confirmed',
    },
     {
      id: 'booking-3',
      stationId: 'station-5',
      stationName: 'Baner-Balewadi Juice Stop',
      userId: 'user-123',
      date: '2024-07-22',
      time: '18:00',
      status: 'Cancelled',
    },
  ];
