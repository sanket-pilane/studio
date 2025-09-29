
export type Connector = {
  type: 'Tesla' | 'CCS' | 'Type 2' | 'CHAdeMO';
  speed: number; // in kW
};

export type Station = {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  connectors: Connector[];
  price: number; // per kWh
  totalChargers: number;
  availableChargers: number;
  rating: number; // 1-5
};

export type Booking = {
  id?: string;
  stationId: string;
  stationName: string;
  userId: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
};
