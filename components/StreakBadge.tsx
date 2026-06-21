import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../constants';

interface StreakBadgeProps {
  current: number;
  longest: number;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  current,
  longest,
}) => {
  return (
    <View style={[styles.container, SHADOWS.medium]}>
      <View style={styles.streakItem}>
        <Text style={styles.icon}>🔥</Text>
        <View>
          <Text style={styles.label}>Current Streak</Text>
          <Text style={styles.value}>{current} days</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.streakItem}>
        <Text style={styles.icon}>🏆</Text>
        <View>
          <Text style={styles.label}>Longest Streak</Text>
          <Text style={styles.value}>{longest} days</Text>
        </View>
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
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.neonGreen,
  },
  streakItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  label: {
    fontSize: 12,
    color: COLORS.textGray,
    marginBottom: 4,
    fontWeight: '500',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.neonGreen,
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: COLORS.textGray,
    marginHorizontal: 12,
    opacity: 0.3,
  },
});
