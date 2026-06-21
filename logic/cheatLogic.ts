import { PointsData } from '../types';

/**
 * Detect if a user might be cheating based on suspicious patterns
 * Returns true if suspicious activity detected
 */
export const detectCheat = (
  currentPoints: number,
  todayBlocks: number,
  timestamp: string
): boolean => {
  // Flag: 10+ spins in under an hour
  // This is checked against historical data
  // Current implementation is basic - can be expanded
  return false; // Will be enhanced with actual detection logic
};

/**
 * Apply punishment for cheating
 * Returns new points state after deduction
 */
export const applyCheatPunishment = (
  currentPoints: PointsData,
  punishmentAmount: number = 2
): PointsData => {
  const newCurrent = Math.max(0, currentPoints.current - punishmentAmount);
  const newTodayEarned = Math.max(0, currentPoints.todayEarned - punishmentAmount);

  return {
    current: newCurrent,
    todayEarned: newTodayEarned,
    totalXP: currentPoints.totalXP, // Never decreases
  };
};

/**
 * Get cheat message for user
 */
export const getCheatMessage = (): string => {
  const messages = [
    'Honesty wins. Face the music.',
    'Did you REALLY deserve that break?',
    'The penalty wheel awaits...',
    'Integrity > Shortcuts',
    'Play fair. Build real discipline.',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

/**
 * Format cheat as a logical rule enforcement
 */
export const enforceCheatRules = (userConfessed: boolean): boolean => {
  return userConfessed;
};
