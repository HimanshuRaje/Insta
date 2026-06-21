export type VehicleStatus = 'Active' | 'Idle' | 'Charging';

export type Vehicle = {
  id: string;
  vehicleNumber: string;
  driverName: string;
  latitude: number;
  longitude: number;
  batteryPercentage: number;
  occupancy: number;
  status: VehicleStatus;
  speed: number;
};
