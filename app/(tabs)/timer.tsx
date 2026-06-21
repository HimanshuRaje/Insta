import React, { useEffect, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants';
import { TimerRing, PointsBar, Button, ProgressBar } from '../../components';
import { useTimer, usePoints } from '../../hooks';
import * as storage from '../../storage/store';

export default function TimerScreen() {
  const router = useRouter();
  const [timerDuration, setTimerDuration] = React.useState(45);
  const [dailyBlocks, setDailyBlocks] = React.useState(0);

  const {
    status,
    formattedTime,
    progress,
    message,
    start,
    pause,
    resume,
    complete,
    reset,
    isRunning,
    isPaused,
    isCompleted,
  } = useTimer(timerDuration);

  const { points, loading: pointsLoading, earn } = usePoints();

  // Track whether we already handled the completion alert so it never fires twice
  const completionHandledRef = useRef(false);

  // Load settings and daily blocks on mount
  useEffect(() => {
    const loadSettings = async () => {
      const data = await storage.loadAppData();
      setTimerDuration(data.settings.timerDuration);
      setDailyBlocks(data.timer.todayBlocks);
    };
    loadSettings();
  }, []);

  // Handle completion — earn a point and show the alert exactly once
  useEffect(() => {
    if (isCompleted && !completionHandledRef.current) {
      completionHandledRef.current = true;

      // Award points
      earn(1);

      // Refresh daily blocks from storage (the timer hook already incremented it)
      storage.loadAppData().then((data) => {
        setDailyBlocks(data.timer.todayBlocks);
      });

      Alert.alert(
        '🎉 Block Completed!',
        'You earned 1 point! Great work! Ready to spin?',
        [
          {
            text: 'Spin Wheel! 🎡',
            onPress: () => {
              reset();
              router.push('/(tabs)/spin');
            },
          },
          {
            text: 'Start Another',
            onPress: () => {
              completionHandledRef.current = false;
              reset();
            },
          },
        ]
      );
    }

    // Reset the guard whenever the timer is no longer completed
    if (!isCompleted) {
      completionHandledRef.current = false;
    }
  }, [isCompleted]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStart = () => {
    start();
  };

  const handlePause = () => {
    if (isRunning) {
      pause();
    } else if (isPaused) {
      resume();
    }
  };

  const handleReset = () => {
    Alert.alert('Exit Timer?', 'Your progress will not be saved.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Exit', onPress: () => reset(), style: 'destructive' },
    ]);
  };

  if (pointsLoading || !points) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Focus Timer</Text>
          <Text style={styles.subtitle}>Let's build your focus muscle</Text>
        </View>

        {/* Points Bar */}
        <PointsBar
          current={points.current}
          todayEarned={points.todayEarned}
          totalXP={points.totalXP}
        />

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Today's Blocks</Text>
            <Text style={styles.statValue}>{dailyBlocks}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{timerDuration}m</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Status</Text>
            <Text
              style={[
                styles.statValue,
                {
                  color:
                    isRunning
                      ? COLORS.neonGreen
                      : isPaused
                        ? COLORS.warning
                        : isCompleted
                          ? COLORS.gold
                          : COLORS.textGray,
                },
              ]}
            >
              {isRunning ? 'FOCUS' : isPaused ? 'PAUSED' : isCompleted ? 'DONE ✓' : 'IDLE'}
            </Text>
          </View>
        </View>

        {/* Timer Ring */}
        <TimerRing progress={progress} formattedTime={formattedTime} message={message} />

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} color={COLORS.neonGreen} />
        </View>

        {/* Control Buttons */}
        <View style={styles.buttonContainer}>
          {/* Idle: show Start */}
          {status === 'idle' && (
            <Button
              label="Start Focus Session"
              onPress={handleStart}
              variant="primary"
              size="large"
              style={styles.button}
            />
          )}

          {/* Running: show Pause */}
          {isRunning && (
            <Button
              label="Pause"
              onPress={handlePause}
              variant="secondary"
              size="large"
              style={styles.button}
            />
          )}

          {/* Paused: show Resume + Reset */}
          {isPaused && (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button
                label="Resume"
                onPress={handlePause}
                variant="primary"
                size="large"
                style={{ flex: 1 }}
              />
              <Button
                label="Reset"
                onPress={handleReset}
                variant="danger-outline"
                size="large"
                style={{ flex: 1 }}
              />
            </View>
          )}

          {/* Completed: show New Session + Claim Points */}
          {isCompleted && (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button
                label="New Session"
                onPress={() => {
                  completionHandledRef.current = false;
                  reset();
                }}
                variant="primary"
                size="large"
                style={{ flex: 1 }}
              />
              <Button
                label="Go Spin 🎡"
                onPress={() => {
                  completionHandledRef.current = false;
                  reset();
                  router.push('/(tabs)/spin');
                }}
                variant="secondary"
                size="large"
                style={{ flex: 1 }}
              />
            </View>
          )}
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Focus Tips</Text>
          <Text style={styles.tipText}>• Pausing the timer means no point earned</Text>
          <Text style={styles.tipText}>• Find a quiet space before you start</Text>
          <Text style={styles.tipText}>• Silence your phone and close other apps</Text>
          <Text style={styles.tipText}>• Start with a smaller block if 45 min feels too long</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBg,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.darkBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gold,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textGray,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 8,
  },
  statItem: {
    flex: 1,
    backgroundColor: COLORS.purpleDark,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.textGray,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textGray,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gold,
    textAlign: 'center',
  },
  progressContainer: {
    marginHorizontal: 16,
    marginBottom: 30,
  },
  buttonContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  button: {
    width: '100%',
  },
  tipsContainer: {
    marginHorizontal: 16,
    marginBottom: 30,
    padding: 16,
    backgroundColor: COLORS.purpleDark,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.info,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: COLORS.textGray,
    marginBottom: 6,
  },
});
