import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants';
import {
  SpinWheel,
  WheelSelector,
  PointsBar,
  Button,
} from '../../components';
import { useWheel, usePoints } from '../../hooks';
import * as cheatLogic from '../../logic/cheatLogic';
import * as storage from '../../storage/store';

type WheelType = 'reward' | 'punishment' | 'break';

export default function SpinScreen() {
  const [selectedWheel, setSelectedWheel] = useState<WheelType>('reward');
  const { wheels, loading, isSpinning, spinResult, spin, clearResult } =
    useWheel();
  const { points, spend, deductForCheat, hasEnough, earn } = usePoints();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (spinResult) {
      // Show result alert
      const title =
        selectedWheel === 'reward'
          ? '🎁 You Won!'
          : selectedWheel === 'break'
            ? '☕ Your Break Activity'
            : '😤 Face The Punishment';

      const message = `${spinResult.label}`;

      Alert.alert(title, message, [
        {
          text: 'OK',
          onPress: () => clearResult(),
        },
      ]);
    }
  }, [spinResult]);

  const handleSpin = async () => {
    if (!wheels) return;

    // Validate permissions
    if (selectedWheel === 'reward' && !hasEnough(1)) {
      Alert.alert('Not Enough Points', 'You need 1 point to spin the reward wheel!');
      return;
    }

    // Deduct points if reward wheel
    if (selectedWheel === 'reward') {
      await spend(1);
    }

    // Find random index
    const wheelItems = wheels[selectedWheel];
    const randomIndex = Math.floor(Math.random() * wheelItems.length);
    setSelectedIndex(randomIndex);

    // Spin
    const result = await spin(selectedWheel);

    if (result && selectedWheel === 'punishment') {
      // Log the cheat
      // (In a real app, we'd increment a cheat counter)
    }
  };

  const handleCheat = async () => {
    Alert.alert(
      'Confess a Cheat?',
      'Landing on the punishment wheel. Be honest with yourself.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'I Cheated',
          onPress: async () => {
            await deductForCheat(2);
            Alert.alert(
              'Punishment Wheel',
              cheatLogic.getCheatMessage(),
              [
                {
                  text: 'Accept',
                  onPress: async () => {
                    if (wheels) {
                      const randomIndex = Math.floor(
                        Math.random() * wheels.punishment.length
                      );
                      setSelectedIndex(randomIndex);
                      await spin('punishment');
                    }
                  },
                },
              ]
            );
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading || !wheels || points === null) {
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
          <Text style={styles.title}>Spin Wheels</Text>
          <Text style={styles.subtitle}>
            {selectedWheel === 'reward'
              ? 'Spend points for rewards'
              : selectedWheel === 'break'
                ? 'Plan your break'
                : 'Face consequences'}
          </Text>
        </View>

        {/* Points Bar */}
        <PointsBar
          current={points.current}
          todayEarned={points.todayEarned}
          totalXP={points.totalXP}
        />

        {/* Wheel Selector */}
        <WheelSelector
          selectedWheel={selectedWheel}
          onSelectWheel={setSelectedWheel}
          canSpinReward={hasEnough(1)}
        />

        {/* The Wheel */}
        <SpinWheel
          items={wheels[selectedWheel]}
          isSpinning={isSpinning}
          selectedIndex={selectedIndex}
        />

        {/* Control Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            label={`${isSpinning ? 'Spinning...' : 'SPIN'}`}
            onPress={handleSpin}
            disabled={isSpinning}
            variant="primary"
            size="large"
            style={styles.spinButton}
            loading={isSpinning}
          />

          {selectedWheel !== 'punishment' && (
            <Button
              label="I Cheated (Punishment)"
              onPress={handleCheat}
              variant="danger"
              size="medium"
              style={styles.cheatButton}
            />
          )}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>⚙️ Spin Rules</Text>
          {selectedWheel === 'reward' && (
            <>
              <Text style={styles.infoBullet}>
                • Costs 1 point per spin
              </Text>
              <Text style={styles.infoBullet}>
                • Weighted probability system
              </Text>
              <Text style={styles.infoBullet}>
                • Rare rewards are harder to land on
              </Text>
            </>
          )}
          {selectedWheel === 'break' && (
            <>
              <Text style={styles.infoBullet}>
                • FREE - no points needed
              </Text>
              <Text style={styles.infoBullet}>
                • Spin during your break
              </Text>
              <Text style={styles.infoBullet}>
                • 15-20 minutes recommended
              </Text>
            </>
          )}
          {selectedWheel === 'punishment' && (
            <>
              <Text style={styles.infoBullet}>
                • Only from the "I Cheated" button
              </Text>
              <Text style={styles.infoBullet}>
                • Costs 2 points + punishment
              </Text>
              <Text style={styles.infoBullet}>
                • Cannot be skipped
              </Text>
            </>
          )}
        </View>

        {/* History Note */}
        <View style={styles.historyNote}>
          <Text style={styles.historyNoteText}>
            📊 View your spin history in the History tab
          </Text>
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
  buttonContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  spinButton: {
    width: '100%',
  },
  cheatButton: {
    width: '100%',
  },
  infoBox: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    backgroundColor: COLORS.purpleDark,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gold,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 8,
  },
  infoBullet: {
    fontSize: 12,
    color: COLORS.textGray,
    marginBottom: 6,
  },
  historyNote: {
    marginHorizontal: 16,
    marginBottom: 30,
    padding: 12,
    backgroundColor: COLORS.purple,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.info,
  },
  historyNoteText: {
    fontSize: 12,
    color: COLORS.info,
    textAlign: 'center',
    fontWeight: '500',
  },
});
