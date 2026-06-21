import { useEffect, useState, useCallback, useRef } from 'react';
import * as timerLogic from '../logic/timerLogic';
import * as storage from '../storage/store';

type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export const useTimer = (durationMinutes: number = 45) => {
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [progress, setProgress] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  // Tracks total milliseconds spent paused so we can subtract from elapsed time
  const totalPausedMsRef = useRef<number>(0);
  const durationSecondsRef = useRef(timerLogic.minutesToSeconds(durationMinutes));
  const animationFrameRef = useRef<number | null>(null);
  // Guard flag to prevent double-completion
  const completedRef = useRef(false);

  // Update duration when prop changes (only when idle)
  useEffect(() => {
    durationSecondsRef.current = timerLogic.minutesToSeconds(durationMinutes);
    if (status === 'idle') {
      setRemainingSeconds(durationSecondsRef.current);
    }
  }, [durationMinutes, status]);

  // Tick — called every animation frame while running
  const tick = useCallback(() => {
    if (startTimeRef.current === null) return;

    const elapsedMs = Date.now() - startTimeRef.current - totalPausedMsRef.current;
    const elapsedSeconds = elapsedMs / 1000;
    const remaining = Math.max(0, durationSecondsRef.current - elapsedSeconds);
    const prog = Math.min(1, Math.max(0, elapsedSeconds / durationSecondsRef.current));

    setRemainingSeconds(remaining);
    setProgress(prog);

    if (remaining <= 0) {
      if (!completedRef.current) {
        completedRef.current = true;
        setStatus('completed');
        setRemainingSeconds(0);
        setProgress(1);
        // Persist the completed block
        storage.incrementTodayBlocks();
      }
    } else {
      animationFrameRef.current = requestAnimationFrame(tick);
    }
  }, []);

  // Start timer from scratch
  const start = useCallback(() => {
    completedRef.current = false;
    totalPausedMsRef.current = 0;
    pausedAtRef.current = null;
    startTimeRef.current = Date.now();
    setStatus('running');
    animationFrameRef.current = requestAnimationFrame(tick);
  }, [tick]);

  // Pause — record when we paused
  const pause = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    pausedAtRef.current = Date.now();
    setStatus('paused');
  }, []);

  // Resume — add the paused duration to the total paused time so elapsed is correct
  const resume = useCallback(() => {
    if (pausedAtRef.current !== null) {
      totalPausedMsRef.current += Date.now() - pausedAtRef.current;
      pausedAtRef.current = null;
    }
    setStatus('running');
    animationFrameRef.current = requestAnimationFrame(tick);
  }, [tick]);

  // Manually mark as complete (e.g. "Claim Points" button)
  const complete = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setStatus('completed');
    setRemainingSeconds(0);
    setProgress(1);
  }, []);

  // Reset to idle
  const reset = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    completedRef.current = false;
    startTimeRef.current = null;
    pausedAtRef.current = null;
    totalPausedMsRef.current = 0;
    setStatus('idle');
    setRemainingSeconds(durationSecondsRef.current);
    setProgress(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    status,
    remainingSeconds,
    progress,
    formattedTime: timerLogic.formatTime(remainingSeconds),
    message: timerLogic.getProgressMessage(progress),
    start,
    pause,
    resume,
    complete,
    reset,
    isRunning: status === 'running',
    isPaused: status === 'paused',
    isCompleted: status === 'completed',
  };
};
