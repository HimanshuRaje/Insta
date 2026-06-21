import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import VehicleInfoCard from '../components/VehicleInfoCard';
import VehicleMarker from '../components/VehicleMarker';
import {
  mockVehicles,
  PARUL_UNIVERSITY_COORDINATE,
} from '../constants/mockVehicles';
import {
  getCurrentUserCoordinate,
  subscribeToUserLocation,
  UserCoordinate,
} from '../services/locationService';
import { Vehicle } from '../types/Vehicle';

const INITIAL_REGION: Region = {
  latitude: PARUL_UNIVERSITY_COORDINATE.latitude,
  longitude: PARUL_UNIVERSITY_COORDINATE.longitude,
  latitudeDelta: 0.018,
  longitudeDelta: 0.018,
};

export default function TrackingScreen() {
  const mapRef = useRef<MapView>(null);
  const [vehicles] = useState<Vehicle[]>(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [userCoordinate, setUserCoordinate] = useState<UserCoordinate | null>(
    null
  );
  const [isCentering, setIsCentering] = useState(false);

  const fleetSummary = useMemo(
    () => ({
      total: vehicles.length,
      active: vehicles.filter((vehicle) => vehicle.status === 'Active').length,
      charging: vehicles.filter((vehicle) => vehicle.status === 'Charging')
        .length,
    }),
    [vehicles]
  );

  useEffect(() => {
    let isMounted = true;
    let subscription: { remove: () => void } | undefined;

    getCurrentUserCoordinate().then((coordinate) => {
      if (isMounted) {
        setUserCoordinate(coordinate);
      }
    });

    subscribeToUserLocation((coordinate) => {
      if (isMounted) {
        setUserCoordinate(coordinate);
      }
    }).then((locationSubscription) => {
      subscription = locationSubscription;
    });

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, []);

  const centerOnMe = async () => {
    setIsCentering(true);

    try {
      const coordinate = await getCurrentUserCoordinate();

      if (!coordinate) {
        Alert.alert(
          'Location unavailable',
          'Please allow location access to center the map on you.'
        );
        return;
      }

      setUserCoordinate(coordinate);
      mapRef.current?.animateToRegion(
        {
          ...coordinate,
          latitudeDelta: 0.012,
          longitudeDelta: 0.012,
        },
        700
      );
    } finally {
      setIsCentering(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        onPress={() => setSelectedVehicle(null)}
        showsCompass
        showsScale
      >
        {vehicles.map((vehicle) => (
          <VehicleMarker
            key={vehicle.id}
            vehicle={vehicle}
            onPress={setSelectedVehicle}
          />
        ))}

        {userCoordinate ? (
          <Marker coordinate={userCoordinate} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.userMarkerOuter}>
              <View style={styles.userMarkerInner} />
            </View>
          </Marker>
        ) : null}
      </MapView>

      <View style={styles.topBar}>
        <View>
          <Text style={styles.kicker}>EV Fleet GPS</Text>
          <Text style={styles.title}>Live Tracking</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Mock Live</Text>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.centerButton,
          pressed && styles.centerButtonPressed,
        ]}
        onPress={centerOnMe}
      >
        {isCentering ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.centerButtonText}>Center on Me</Text>
        )}
      </Pressable>

      {selectedVehicle ? <VehicleInfoCard vehicle={selectedVehicle} /> : null}

      <View style={styles.summaryCard}>
        <SummaryMetric label="Total EVs" value={fleetSummary.total} />
        <View style={styles.summaryDivider} />
        <SummaryMetric label="Active EVs" value={fleetSummary.active} />
        <View style={styles.summaryDivider} />
        <SummaryMetric label="Charging EVs" value={fleetSummary.charging} />
      </View>
    </SafeAreaView>
  );
}

type SummaryMetricProps = {
  label: string;
  value: number;
};

function SummaryMetric({ label, value }: SummaryMetricProps) {
  return (
    <View style={styles.summaryMetric}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    position: 'absolute',
    top: 58,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  kicker: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  liveText: {
    color: '#047857',
    fontSize: 12,
    fontWeight: '800',
  },
  centerButton: {
    position: 'absolute',
    right: 16,
    bottom: 190,
    minWidth: 136,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 8,
  },
  centerButtonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  centerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  userMarkerOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.18)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userMarkerInner: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#2563EB',
  },
  summaryCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 12,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 10,
  },
  summaryMetric: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryValue: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '900',
  },
  summaryLabel: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },
  summaryDivider: {
    width: 1,
    height: 34,
    backgroundColor: '#E5E7EB',
  },
});
