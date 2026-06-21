import { useEffect, useState, useCallback } from 'react';
import { PointsData } from '../types';
import * as pointsLogic from '../logic/pointsLogic';
import * as storage from '../storage/store';

export const usePoints = () => {
  const [points, setPoints] = useState<PointsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load points on mount
  useEffect(() => {
    const loadPoints = async () => {
      const data = await storage.loadAppData();
      setPoints(data.points);
      setLoading(false);
    };
    loadPoints();
  }, []);

  // Earn points
  const earn = useCallback(
    async (amount: number = 1) => {
      if (!points) return;
      const newPoints = pointsLogic.earnPoints(points, amount);
      setPoints(newPoints);
      await storage.updatePoints(() => newPoints);
    },
    [points]
  );

  // Spend points
  const spend = useCallback(
    async (amount: number = 1) => {
      if (!points) return;
      const newPoints = pointsLogic.spendPoints(points, amount);
      setPoints(newPoints);
      await storage.updatePoints(() => newPoints);
    },
    [points]
  );

  // Deduct for cheat
  const deductForCheat = useCallback(
    async (amount: number = 2) => {
      if (!points) return;
      const newPoints = pointsLogic.deductPointsForCheat(points, amount);
      setPoints(newPoints);
      await storage.updatePoints(() => newPoints);
    },
    [points]
  );

  const hasEnough = useCallback(
    (required: number = 1) => {
      if (!points) return false;
      return pointsLogic.hasEnoughPoints(points, required);
    },
    [points]
  );

  return {
    points,
    loading,
    earn,
    spend,
    deductForCheat,
    hasEnough,
  };
};
