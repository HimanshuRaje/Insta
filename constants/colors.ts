export const COLORS = {
  // Primary colors
  darkBg: '#0D0D0D',
  purple: '#1a0533',
  gold: '#FFD700',
  neonGreen: '#39FF14',
  red: '#FF3B30',

  // Text colors
  textWhite: '#F5F5F5',
  textGray: '#B0B0B0',

  // Semantic colors
  success: '#39FF14',
  danger: '#FF3B30',
  warning: '#FFD700',
  info: '#00BFFF',

  // Transparency variants
  purpleLight: 'rgba(26, 5, 51, 0.7)',
  purpleDark: 'rgba(26, 5, 51, 0.9)',
} as const;

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
} as const;
