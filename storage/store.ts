import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, PointsData, SpinResult } from '../types';
import {
  DEFAULT_REWARD_WHEEL,
  DEFAULT_PUNISHMENT_WHEEL,
  DEFAULT_BREAK_WHEEL,
  DEFAULT_TIMER_DURATION,
  DEFAULT_DAILY_SPIN_LIMIT,
} from '../constants';

const STORAGE_KEY = 'INSTA_APP_DATA';

/**
 * Initialize default app data
 */
const createDefaultAppData = (): AppData => {
  const today = new Date().toISOString().split('T')[0];

  return {
    points: {
      current: 0,
      todayEarned: 0,
      totalXP: 0,
    },
    streak: {
      current: 0,
      longest: 0,
      lastActiveDate: today,
    },
    timer: {
      defaultDuration: DEFAULT_TIMER_DURATION,
      todayBlocks: 0,
      totalBlocks: 0,
    },
    history: [],
    settings: {
      timerDuration: DEFAULT_TIMER_DURATION,
      dailySpinLimit: DEFAULT_DAILY_SPIN_LIMIT,
      soundEnabled: true,
      vibrationEnabled: true,
    },
    wheels: {
      reward: DEFAULT_REWARD_WHEEL,
      punishment: DEFAULT_PUNISHMENT_WHEEL,
      break: DEFAULT_BREAK_WHEEL,
    },
  };
};

/**
 * Get all app data
 */
export const loadAppData = async (): Promise<AppData> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return createDefaultAppData();
  } catch (error) {
    console.error('Error loading app data:', error);
    return createDefaultAppData();
  }
};

/**
 * Save all app data
 */
export const saveAppData = async (data: AppData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving app data:', error);
  }
};

/**
 * Update points only
 */
export const updatePoints = async (
  updater: (current: PointsData) => PointsData
): Promise<PointsData> => {
  const data = await loadAppData();
  const newPoints = updater(data.points);
  data.points = newPoints;
  await saveAppData(data);
  return newPoints;
};

/**
 * Add spin result to history
 */
export const addSpinToHistory = async (spin: SpinResult): Promise<void> => {
  const data = await loadAppData();
  data.history.unshift(spin); // Add to beginning
  // Keep last 100 spins
  if (data.history.length > 100) {
    data.history = data.history.slice(0, 100);
  }
  await saveAppData(data);
};

/**
 * Increment today's blocks
 */
export const incrementTodayBlocks = async (): Promise<number> => {
  const data = await loadAppData();
  data.timer.todayBlocks += 1;
  data.timer.totalBlocks += 1;
  await saveAppData(data);
  return data.timer.todayBlocks;
};

/**
 * Update streak — safe to call multiple times per day.
 * Only increments once per day by tracking lastActiveDate.
 */
export const updateStreak = async (blocksCompletedToday: number): Promise<void> => {
  const data = await loadAppData();
  const today = new Date().toISOString().split('T')[0];
  const lastActive = data.streak.lastActiveDate;

  if (blocksCompletedToday > 0) {
    if (lastActive === today) {
      // Streak already updated today — do nothing to prevent double increments
    } else if (isYesterday(lastActive, today)) {
      // Consecutive day — extend the streak
      data.streak.current += 1;
      data.streak.lastActiveDate = today;
    } else {
      // Gap in days — reset to 1
      data.streak.current = 1;
      data.streak.lastActiveDate = today;
    }

    // Update longest streak
    if (data.streak.current > data.streak.longest) {
      data.streak.longest = data.streak.current;
    }
  } else {
    // No blocks today — if too many days have passed, reset streak
    if (lastActive !== today && !isYesterday(lastActive, today)) {
      data.streak.current = 0;
    }
  }

  await saveAppData(data);
};

/**
 * Reset daily data at midnight
 */
export const resetDailyData = async (): Promise<void> => {
  const data = await loadAppData();
  const today = new Date().toISOString().split('T')[0];
  const lastReset = data.streak.lastActiveDate;

  // Only reset if different day
  if (lastReset !== today) {
    data.timer.todayBlocks = 0;
    data.points.todayEarned = 0;
  }

  await saveAppData(data);
};

/**
 * Clear all data (for reset)
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

/**
 * Get spin history
 */
export const getSpinHistory = async (): Promise<SpinResult[]> => {
  const data = await loadAppData();
  return data.history;
};

/**
 * Helper: Check if date is yesterday
 */
const isYesterday = (dateStr: string, today: string): boolean => {
  const date = new Date(dateStr);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  return dateStr === yesterdayStr;
};
