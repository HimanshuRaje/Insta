import { WheelItem, SpinResult } from '../types';

/**
 * Calculates the weighted random outcome of a spin
 * Higher weight = more likely to land on it
 * Builds a weighted array and picks a random item
 */
export const calculateSpinOutcome = (wheelItems: WheelItem[]): WheelItem => {
  // Calculate total weight
  const totalWeight = wheelItems.reduce((sum, item) => sum + item.weight, 0);

  if (totalWeight === 0) {
    return wheelItems[0]; // Fallback if no valid weights
  }

  // Generate random number between 0 and totalWeight
  const random = Math.random() * totalWeight;

  // Find the item that matches the random number
  let currentWeight = 0;
  for (const item of wheelItems) {
    currentWeight += item.weight;
    if (random <= currentWeight) {
      return item;
    }
  }

  // Fallback to last item
  return wheelItems[wheelItems.length - 1];
};

/**
 * Creates a spin result entry for history
 */
export const createSpinResult = (
  wheelType: 'reward' | 'punishment' | 'break',
  outcome: string
): SpinResult => {
  return {
    id: `spin_${Date.now()}_${Math.random()}`,
    wheelType,
    outcome,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Gets animation duration based on number of rotations
 * Longer spins feel more satisfying
 */
export const getSpinDuration = (): number => {
  // Base spin: 4-5 seconds with multiple rotations
  return 4000;
};

/**
 * Calculates the rotation angle to land on specific segment
 * Returns angle in degrees
 */
export const calculateFinalAngle = (
  itemIndex: number,
  totalItems: number
): number => {
  const segmentAngle = 360 / totalItems;
  const baseRotation = Math.random() * 360 * 3; // Multiple full rotations
  const targetRotation = itemIndex * segmentAngle + segmentAngle / 2;
  return baseRotation + targetRotation;
};
