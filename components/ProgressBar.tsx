import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

interface ProgressBarProps {
  progress: number; // 0-1
  height?: number;
  animated?: boolean;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  animated = true,
  color = COLORS.gold,
}) => {
  const percentage = Math.min(100, progress * 100);

  return (
    <View style={[styles.container, { height }]}>
      <View
        style={[
          styles.progress,
          {
            backgroundColor: color,
            height,
            width: `${percentage}%` as any,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.purple,
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progress: {
    borderRadius: 8,
  },
});
