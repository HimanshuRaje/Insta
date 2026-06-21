/**
 * Audio utility stubs.
 *
 * NOTE: expo-av is version-locked to older Expo SDKs. Real audio will be
 * implemented once the correct expo-av version is installed via:
 *   npx expo install expo-av
 *
 * Until then, these stubs allow the app to function without crashing.
 */

/**
 * Initialize audio mode (stub).
 */
export const initializeAudio = async (): Promise<void> => {
  // Stub — no-op until expo-av is updated
};

/**
 * Play a sound effect (stub).
 * Sound types: 'spin-start', 'spin-result', 'reward', 'punishment', 'timer-complete'
 */
export const playSoundEffect = async (soundType: string): Promise<void> => {
  // Stub — real implementation needs actual sound files in assets/sounds/
  console.log(`[Audio] Playing sound: ${soundType}`);
};

/**
 * Stop all sounds (stub).
 */
export const stopAllSounds = async (): Promise<void> => {
  // Stub
};

/**
 * Preload sounds for faster playback (stub).
 */
export const preloadSounds = async (): Promise<void> => {
  // Stub
};
