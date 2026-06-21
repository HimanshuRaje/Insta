import { PointsData } from '../types';

/**
 * Add points when completing a focus block
 */
export const earnPoints = (
  current: PointsData,
  amount: number = 1
): PointsData => {
  return {
    current: current.current + amount,
    todayEarned: current.todayEarned + amount,
    totalXP: current.totalXP + amount,
  };
};

/**
 * Deduct points when spinning the reward wheel
 */
export const spendPoints = (
  current: PointsData,
  amount: number = 1
): PointsData => {
  const newCurrent = Math.max(0, current.current - amount);
  return {
    current: newCurrent,
    todayEarned: current.todayEarned,
    totalXP: current.totalXP,
  };
};

/**
 * Deduct points for cheating
 */
export const deductPointsForCheat = (
  current: PointsData,
  amount: number = 2
): PointsData => {
  const newCurrent = Math.max(0, current.current - amount);
  return {
    current: newCurrent,
    todayEarned: Math.max(0, current.todayEarned - amount),
    totalXP: current.totalXP, // Total XP doesn't decrease
  };
};

/**
 * Reset daily earned points at midnight
 */
export const resetDailyPoints = (current: PointsData): PointsData => {
  return {
    current: current.current,
    todayEarned: 0,
    totalXP: current.totalXP,
  };
};

/**
 * Check if user has enough points for reward spin
 */
export const hasEnoughPoints = (current: PointsData, required: number = 1): boolean => {
  return current.current >= required;
};

/**
 * Format points for display
 */
export const formatPoints = (points: number): string => {
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}K`;
  }
  return String(points);
};
