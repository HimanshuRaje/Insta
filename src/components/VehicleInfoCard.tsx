import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Vehicle } from '../types/Vehicle';
import { getVehicleStatusColor } from './VehicleMarker';

type VehicleInfoCardProps = {
  vehicle: Vehicle;
};

export default function VehicleInfoCard({ vehicle }: VehicleInfoCardProps) {
  const statusColor = getVehicleStatusColor(vehicle.status);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.vehicleNumber}>{vehicle.vehicleNumber}</Text>
          <Text style={styles.driverName}>{vehicle.driverName}</Text>
        </View>

        <View style={[styles.statusPill, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{vehicle.status}</Text>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <Metric label="Battery" value={`${vehicle.batteryPercentage}%`} />
        <Metric label="Occupancy" value={`${vehicle.occupancy}`} />
        <Metric label="Speed" value={`${vehicle.speed} km/h`} />
      </View>
    </View>
  );
}

type MetricProps = {
  label: string;
  value: string;
};

function Metric({ label, value }: MetricProps) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 110,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  vehicleNumber: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '800',
  },
  driverName: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  metric: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  metricLabel: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricValue: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
  },
});
