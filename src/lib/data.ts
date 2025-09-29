import type { Station, Booking } from './types';

// This file now only contains placeholder booking data for reference.
// Station data is managed in Firestore.

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
