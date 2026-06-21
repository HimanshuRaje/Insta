import { useEffect, useState, useCallback, useRef } from 'react';
import { WheelItem, SpinResult } from '../types';
import * as spinLogic from '../logic/spinLogic';
import * as storage from '../storage/store';

type WheelType = 'reward' | 'punishment' | 'break';

export const useWheel = () => {
  const [wheels, setWheels] = useState<{
    reward: WheelItem[];
    punishment: WheelItem[];
    break: WheelItem[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<WheelItem | null>(null);
  const spinningRef = useRef(false);

  // Load wheels on mount
  useEffect(() => {
    const loadWheels = async () => {
      const data = await storage.loadAppData();
      setWheels(data.wheels);
      setLoading(false);
    };
    loadWheels();
  }, []);

  // Spin the wheel
  const spin = useCallback(
    async (wheelType: WheelType): Promise<WheelItem | null> => {
      if (spinningRef.current || !wheels) return null;

      spinningRef.current = true;
      setIsSpinning(true);

      try {
        const wheelItems = wheels[wheelType];
        const outcome = spinLogic.calculateSpinOutcome(wheelItems);

        // Simulate spin duration
        await new Promise((resolve) => setTimeout(resolve, 4000));

        setSpinResult(outcome);

        // Add to history
        const result: SpinResult = spinLogic.createSpinResult(wheelType, outcome.label);
        await storage.addSpinToHistory(result);

        return outcome;
      } catch (error) {
        console.error('Error during spin:', error);
        return null;
      } finally {
        spinningRef.current = false;
        setIsSpinning(false);
      }
    },
    [wheels]
  );

  // Clear result
  const clearResult = useCallback(() => {
    setSpinResult(null);
  }, []);

  return {
    wheels,
    loading,
    isSpinning,
    spinResult,
    spin,
    clearResult,
  };
};
