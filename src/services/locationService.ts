import * as Location from 'expo-location';

export type UserCoordinate = {
  latitude: number;
  longitude: number;
};

export type LocationPermissionResult = {
  granted: boolean;
  message?: string;
};

export async function requestLocationPermission(): Promise<LocationPermissionResult> {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== Location.PermissionStatus.GRANTED) {
    return {
      granted: false,
      message: 'Location permission is required to center the fleet map on you.',
    };
  }

  return { granted: true };
}

export async function getCurrentUserCoordinate(): Promise<UserCoordinate | null> {
  const permission = await requestLocationPermission();

  if (!permission.granted) {
    return null;
  }

  const currentLocation = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: currentLocation.coords.latitude,
    longitude: currentLocation.coords.longitude,
  };
}

export function subscribeToUserLocation(
  onLocationChange: (coordinate: UserCoordinate) => void
) {
  return Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.Balanced,
      distanceInterval: 10,
      timeInterval: 5000,
    },
    (location) => {
      onLocationChange({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  );
}
