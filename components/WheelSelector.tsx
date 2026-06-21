import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { COLORS, SHADOWS } from '../constants';

type WheelType = 'reward' | 'punishment' | 'break';

interface WheelSelectorProps {
  selectedWheel: WheelType;
  onSelectWheel: (wheel: WheelType) => void;
  canSpinReward: boolean;
}

const WHEEL_OPTIONS: { type: WheelType; icon: string; name: string; description: string }[] = [
  {
    type: 'reward',
    icon: '🎁',
    name: 'Reward Wheel',
    description: 'Spend 1 point for a treat',
  },
  {
    type: 'break',
    icon: '☕',
    name: 'Break Wheel',
    description: 'Free break activities',
  },
  {
    type: 'punishment',
    icon: '😤',
    name: 'Punishment',
    description: 'Face the consequences',
  },
];

export const WheelSelector: React.FC<WheelSelectorProps> = ({
  selectedWheel,
  onSelectWheel,
  canSpinReward,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {WHEEL_OPTIONS.map((option) => {
        const isSelected = selectedWheel === option.type;
        const isDisabled =
          option.type === 'reward' && !canSpinReward;

        return (
          <TouchableOpacity
            key={option.type}
            style={[
              styles.wheelCard,
              SHADOWS.medium,
              isSelected && styles.selectedCard,
              isDisabled && styles.disabledCard,
            ]}
            onPress={() => onSelectWheel(option.type)}
            disabled={isDisabled}
            activeOpacity={isDisabled ? 1 : 0.8}
          >
            <Text style={styles.icon}>{option.icon}</Text>
            <Text style={[styles.name, isSelected && styles.selectedName]}>
              {option.name}
            </Text>
            <Text
              style={[
                styles.description,
                isSelected && styles.selectedDescription,
              ]}
            >
              {option.description}
            </Text>
            {isDisabled && (
              <View style={styles.disabledOverlay}>
                <Text style={styles.disabledText}>🚫 No Points</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginHorizontal: 16,
  },
  contentContainer: {
    paddingRight: 16,
  },
  wheelCard: {
    width: 160,
    backgroundColor: COLORS.purpleDark,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.textGray,
  },
  selectedCard: {
    backgroundColor: COLORS.purple,
    borderColor: COLORS.gold,
    borderWidth: 3,
  },
  disabledCard: {
    opacity: 0.5,
  },
  icon: {
    fontSize: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textWhite,
    marginBottom: 4,
    textAlign: 'center',
  },
  selectedName: {
    color: COLORS.gold,
  },
  description: {
    fontSize: 12,
    color: COLORS.textGray,
    textAlign: 'center',
  },
  selectedDescription: {
    color: COLORS.neonGreen,
  },
  disabledOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledText: {
    color: COLORS.red,
    fontWeight: 'bold',
    fontSize: 12,
  },
});
