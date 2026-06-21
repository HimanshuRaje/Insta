import { Vehicle } from '../types/Vehicle';

export const PARUL_UNIVERSITY_COORDINATE = {
  latitude: 22.2882,
  longitude: 73.3637,
};

export const mockVehicles: Vehicle[] = [
  {
    id: 'vehicle-101',
    vehicleNumber: 'EV-101',
    driverName: 'Aarav Mehta',
    latitude: 22.2882,
    longitude: 73.3637,
    batteryPercentage: 84,
    occupancy: 3,
    status: 'Active',
    speed: 28,
  },
  {
    id: 'vehicle-102',
    vehicleNumber: 'EV-102',
    driverName: 'Riya Shah',
    latitude: 22.2911,
    longitude: 73.3651,
    batteryPercentage: 57,
    occupancy: 2,
    status: 'Charging',
    speed: 0,
  },
  {
    id: 'vehicle-103',
    vehicleNumber: 'EV-103',
    driverName: 'Kabir Patel',
    latitude: 22.2865,
    longitude: 73.3619,
    batteryPercentage: 72,
    occupancy: 4,
    status: 'Active',
    speed: 34,
  },
  {
    id: 'vehicle-104',
    vehicleNumber: 'EV-104',
    driverName: 'Nisha Rao',
    latitude: 22.2898,
    longitude: 73.3598,
    batteryPercentage: 39,
    occupancy: 1,
    status: 'Idle',
    speed: 0,
  },
  {
    id: 'vehicle-105',
    vehicleNumber: 'EV-105',
    driverName: 'Dev Desai',
    latitude: 22.2849,
    longitude: 73.3658,
    batteryPercentage: 91,
    occupancy: 5,
    status: 'Active',
    speed: 31,
  },
];
