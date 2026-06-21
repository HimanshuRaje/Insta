import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../constants';
import * as pointsLogic from '../logic/pointsLogic';

interface PointsBarProps {
  current: number;
  todayEarned: number;
  totalXP: number;
}

export const PointsBar: React.FC<PointsBarProps> = ({
  current,
  todayEarned,
  totalXP,
}) => {
  return (
    <View style={[styles.container, SHADOWS.medium]}>
      <View style={styles.pointItem}>
        <Text style={styles.label}>🪙 Points</Text>
        <Text style={[styles.value, styles.currentValue]}>
          {pointsLogic.formatPoints(current)}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.pointItem}>
        <Text style={styles.label}>📅 Today</Text>
        <Text style={[styles.value, styles.todayValue]}>
          +{pointsLogic.formatPoints(todayEarned)}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.pointItem}>
        <Text style={styles.label}>⭐ XP</Text>
        <Text style={[styles.value, styles.xpValue]}>
          {pointsLogic.formatPoints(totalXP)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.purpleDark,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  pointItem: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: COLORS.textGray,
    marginBottom: 4,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentValue: {
    color: COLORS.gold,
  },
  todayValue: {
    color: COLORS.neonGreen,
  },
  xpValue: {
    color: COLORS.info,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.textGray,
    marginHorizontal: 12,
    opacity: 0.3,
  },
});
