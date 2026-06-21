import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { Vehicle, VehicleStatus } from '../types/Vehicle';

type VehicleMarkerProps = {
  vehicle: Vehicle;
  onPress: (vehicle: Vehicle) => void;
};

const STATUS_COLORS: Record<VehicleStatus, string> = {
  Active: '#18A558',
  Charging: '#F59E0B',
  Idle: '#8E8E93',
};

export function getVehicleStatusColor(status: VehicleStatus) {
  return STATUS_COLORS[status];
}

export default function VehicleMarker({ vehicle, onPress }: VehicleMarkerProps) {
  const markerColor = getVehicleStatusColor(vehicle.status);

  return (
    <Marker
      coordinate={{
        latitude: vehicle.latitude,
        longitude: vehicle.longitude,
      }}
      onPress={() => onPress(vehicle)}
      tracksViewChanges={false}
    >
      <View style={[styles.marker, { backgroundColor: markerColor }]}>
        <Text style={styles.markerText}>EV</Text>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  marker: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  markerText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
