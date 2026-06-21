/**
 * Calculate remaining time in seconds
 */
export const calculateRemainingTime = (
  startTime: number,
  durationSeconds: number
): number => {
  const elapsed = (Date.now() - startTime) / 1000;
  const remaining = Math.max(0, durationSeconds - elapsed);
  return remaining;
};

/**
 * Format seconds to MM:SS display
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Convert minutes to seconds
 */
export const minutesToSeconds = (minutes: number): number => {
  return minutes * 60;
};

/**
 * Convert seconds to minutes
 */
export const secondsToMinutes = (seconds: number): number => {
  return seconds / 60;
};

/**
 * Check if timer should have completed
 */
export const isTimerComplete = (
  startTime: number,
  durationSeconds: number
): boolean => {
  const remaining = calculateRemainingTime(startTime, durationSeconds);
  return remaining <= 0;
};

/**
 * Calculate progress as percentage (0-1)
 */
export const calculateProgress = (
  startTime: number,
  durationSeconds: number
): number => {
  const elapsed = (Date.now() - startTime) / 1000;
  return Math.min(1, Math.max(0, elapsed / durationSeconds));
};

/**
 * Get encouraging message based on progress
 */
export const getProgressMessage = (progress: number): string => {
  if (progress < 0.25) return 'Good start! Keep going!';
  if (progress < 0.5) return 'Quarter way there! 💪';
  if (progress < 0.75) return 'More than halfway! You got this!';
  if (progress < 0.95) return 'Almost done! Push through!';
  return 'Final seconds! Finish strong! 🔥';
};
