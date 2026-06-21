import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Switch,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants';
import { PointsBar, Button } from '../../components';
import { usePoints } from '../../hooks';
import * as storage from '../../storage/store';
import { SettingsData } from '../../types';

export default function SettingsScreen() {
  const { points, loading: pointsLoading } = usePoints();
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await storage.loadAppData();
      setSettings(data.settings);
      setLoading(false);
    };
    loadSettings();
  }, []);

  const handleSettingChange = async <K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) => {
    if (!settings) return;

    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // Save to storage
    const data = await storage.loadAppData();
    data.settings = newSettings;
    await storage.saveAppData(data);
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data?',
      'This will clear all your points, progress, and history. This cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Reset',
          onPress: async () => {
            await storage.clearAllData();
            // Reload app
            Alert.alert('Data Cleared', 'Please restart the app.', [
              { text: 'OK', onPress: () => {} },
            ]);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleResetStreak = () => {
    Alert.alert(
      'Reset Streak?',
      'Your current streak will be reset to 0, but your longest streak will be preserved.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Reset',
          onPress: async () => {
            const data = await storage.loadAppData();
            data.streak.current = 0;
            await storage.saveAppData(data);
            Alert.alert('Streak Reset', 'Your streak has been reset.');
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (pointsLoading || !points || loading || !settings) {
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
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your experience</Text>
        </View>

        {/* Points Bar */}
        <PointsBar
          current={points.current}
          todayEarned={points.todayEarned}
          totalXP={points.totalXP}
        />

        {/* Timer Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏱️ Timer Settings</Text>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Focus Duration</Text>
              <Text style={styles.settingDescription}>
                Duration of each focus block
              </Text>
            </View>
            <TextInput
              style={styles.durationInput}
              value={String(settings.timerDuration)}
              onChangeText={(text) => {
                const num = parseInt(text) || 45;
                handleSettingChange('timerDuration', Math.max(5, Math.min(120, num)));
              }}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          <Text style={styles.settingHint}>5 - 120 minutes</Text>
        </View>

        {/* Spin Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎡 Spin Settings</Text>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Daily Spin Limit</Text>
              <Text style={styles.settingDescription}>
                Max reward spins per day (0 = unlimited)
              </Text>
            </View>
            <TextInput
              style={styles.durationInput}
              value={String(settings.dailySpinLimit)}
              onChangeText={(text) => {
                const num = parseInt(text) || 5;
                handleSettingChange('dailySpinLimit', Math.max(0, num));
              }}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
        </View>

        {/* Audio & Haptics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔊 Audio & Haptics</Text>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Sound Effects</Text>
              <Text style={styles.settingDescription}>
                Spin and reward sounds
              </Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(value) =>
                handleSettingChange('soundEnabled', value)
              }
              trackColor={{ false: COLORS.textGray, true: COLORS.gold }}
              thumbColor={COLORS.gold}
            />
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>Vibration</Text>
              <Text style={styles.settingDescription}>
                Haptic feedback on spin
              </Text>
            </View>
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={(value) =>
                handleSettingChange('vibrationEnabled', value)
              }
              trackColor={{ false: COLORS.textGray, true: COLORS.gold }}
              thumbColor={COLORS.gold}
            />
          </View>
        </View>

        {/* Dangerous Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>
            ⚠️ Danger Zone
          </Text>

          <Button
            label="Reset Current Streak"
            onPress={handleResetStreak}
            variant="danger-outline"
            size="medium"
            style={styles.dangerButton}
          />

          <Button
            label="Clear All Data"
            onPress={handleResetData}
            variant="danger"
            size="medium"
            style={styles.dangerButton}
          />
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ About INSTA</Text>

          <View style={styles.aboutBox}>
            <Text style={styles.aboutText}>
              <Text style={styles.aboutBold}>Version:</Text> 1.0.0
            </Text>
            <Text style={styles.aboutText}>
              <Text style={styles.aboutBold}>Philosophy:</Text> Earn before you
              enjoy. Guilt as a tool. Randomness = dopamine. Growth feels fun.
            </Text>
            <Text style={styles.aboutText}>
              <Text style={styles.aboutBold}>Built with:</Text> React Native,
              Expo, TypeScript
            </Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
          <Text style={styles.tipText}>
            • Start with 25-minute blocks if 45 feels too long
          </Text>
          <Text style={styles.tipText}>
            • Use the break wheel to decide what to do during breaks
          </Text>
          <Text style={styles.tipText}>
            • Be honest with yourself - cheating hurts only you
          </Text>
          <Text style={styles.tipText}>
            • Track your longest streak - consistency compounds
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
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 12,
  },
  dangerTitle: {
    color: COLORS.red,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.purpleDark,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.textGray,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textWhite,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 11,
    color: COLORS.textGray,
  },
  durationInput: {
    backgroundColor: COLORS.purple,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    color: COLORS.gold,
    fontWeight: 'bold',
    minWidth: 60,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  settingHint: {
    fontSize: 10,
    color: COLORS.textGray,
    marginTop: -8,
    marginBottom: 12,
  },
  dangerButton: {
    width: '100%',
    marginBottom: 12,
  },
  aboutBox: {
    backgroundColor: COLORS.purpleDark,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.info,
  },
  aboutText: {
    fontSize: 12,
    color: COLORS.textGray,
    marginBottom: 8,
    lineHeight: 18,
  },
  aboutBold: {
    color: COLORS.info,
    fontWeight: 'bold',
  },
  tipsContainer: {
    marginHorizontal: 16,
    marginBottom: 30,
    padding: 16,
    backgroundColor: COLORS.purpleDark,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.neonGreen,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.neonGreen,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: COLORS.textGray,
    marginBottom: 6,
  },
});
