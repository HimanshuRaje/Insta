import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../constants';
import { triggerHapticOnPress } from '../utils';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'danger-outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const handlePress = async () => {
    await triggerHapticOnPress();
    onPress();
  };
  const getVariantStyle = (): ViewStyle => {
    const baseStyle = {
      borderRadius: 12,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: COLORS.gold,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: COLORS.purple,
          borderWidth: 2,
          borderColor: COLORS.gold,
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: COLORS.red,
          borderWidth: 0,
        };
      case 'danger-outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: COLORS.red,
        };
      default:
        return baseStyle;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 12, minWidth: 80 };
      case 'medium':
        return { paddingVertical: 12, paddingHorizontal: 24, minWidth: 120 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 32, minWidth: 160 };
      default:
        return {};
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseFontSize = size === 'small' ? 12 : size === 'medium' ? 14 : 16;
    let textColor: any = COLORS.darkBg;

    if (variant === 'secondary' || variant === 'danger-outline') {
      textColor = variant === 'secondary' ? COLORS.gold : COLORS.red;
    }

    return {
      fontSize: baseFontSize,
      fontWeight: '600' as const,
      color: textColor,
    };
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        getVariantStyle(),
        getSizeStyle(),
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.darkBg} size="small" />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.5,
  },
});
