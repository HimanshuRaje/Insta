import React, { useCallback, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../constants';
import { PointsBar, StreakBadge } from '../../components';
import * as storage from '../../storage/store';
import { AppData } from '../../types';

const MOTIVATIONAL_MESSAGES = [
  '🔥 Earn it before you enjoy it.',
  '💪 One block at a time. You got this.',
  '⚡ No shortcuts. Real growth only.',
  '🎯 Focus now. Spin later.',
  '🧠 Discipline > Motivation. Always.',
  '🏆 Your future self will thank you.',
  '✨ Small blocks build big results.',
];

function getDailyMessage(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return MOTIVATIONAL_MESSAGES[dayOfYear % MOTIVATIONAL_MESSAGES.length];
}

export default function HomeScreen() {
  const router = useRouter();
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        setLoading(true);
        const appData = await storage.loadAppData();
        setData(appData);
        setLoading(false);
      };
      load();
    }, [])
  );

  if (loading || !data) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  const { points, streak, timer } = data;
  const hasPoints = points.current > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back 👋</Text>
            <Text style={styles.appName}>INSTA</Text>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>DAY {streak.current > 0 ? streak.current : 1}</Text>
          </View>
        </View>

        {/* Motivational Quote */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>{getDailyMessage()}</Text>
        </View>

        {/* Points Bar */}
        <PointsBar
          current={points.current}
          todayEarned={points.todayEarned}
          totalXP={points.totalXP}
        />

        {/* Streak Badge */}
        <StreakBadge current={streak.current} longest={streak.longest} />

        {/* Today's Stats */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>📅 Today's Progress</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, SHADOWS.small]}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statValue}>{timer.todayBlocks}</Text>
            <Text style={styles.statLabel}>Focus Blocks</Text>
          </View>
          <View style={[styles.statCard, SHADOWS.small]}>
            <Text style={styles.statIcon}>🪙</Text>
            <Text style={styles.statValue}>+{points.todayEarned}</Text>
            <Text style={styles.statLabel}>Points Earned</Text>
          </View>
          <View style={[styles.statCard, SHADOWS.small]}>
            <Text style={styles.statIcon}>📦</Text>
            <Text style={styles.statValue}>{timer.totalBlocks}</Text>
            <Text style={styles.statLabel}>All-Time Blocks</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>⚡ Quick Actions</Text>
        </View>

        <TouchableOpacity
          style={[styles.actionCard, styles.actionCardPrimary, SHADOWS.medium]}
          onPress={() => router.push('/(tabs)/timer')}
          activeOpacity={0.85}
        >
          <View style={styles.actionCardInner}>
            <Ionicons name="timer" size={36} color={COLORS.darkBg} />
            <View style={styles.actionTextBlock}>
              <Text style={styles.actionCardTitle}>Start Focus Timer</Text>
              <Text style={styles.actionCardSub}>
                {data.settings.timerDuration} min block → earn 1 point
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={COLORS.darkBg} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionCard,
            hasPoints ? styles.actionCardSecondary : styles.actionCardDisabled,
            SHADOWS.medium,
          ]}
          onPress={() => router.push('/(tabs)/spin')}
          activeOpacity={0.85}
        >
          <View style={styles.actionCardInner}>
            <Ionicons
              name="sparkles"
              size={36}
              color={hasPoints ? COLORS.gold : COLORS.textGray}
            />
            <View style={styles.actionTextBlock}>
              <Text
                style={[
                  styles.actionCardTitle,
                  { color: hasPoints ? COLORS.gold : COLORS.textGray },
                ]}
              >
                Spin the Wheel
              </Text>
              <Text style={styles.actionCardSub}>
                {hasPoints
                  ? `You have ${points.current} point${points.current !== 1 ? 's' : ''} to spend`
                  : 'Complete a focus block to earn points'}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color={hasPoints ? COLORS.gold : COLORS.textGray}
            />
          </View>
        </TouchableOpacity>

        {/* Rules Reminder */}
        <View style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>📜 The Rules</Text>
          <RuleRow icon="✅" text="Complete a 45-min block → earn 1 point" />
          <RuleRow icon="🎁" text="Spend 1 point → spin Reward Wheel" />
          <RuleRow icon="☕" text="Break Wheel is always FREE" />
          <RuleRow icon="😤" text="Cheated? Hit the button. Face punishment." />
          <RuleRow icon="🚫" text="Pause = no point earned" />
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function RuleRow({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.ruleRow}>
      <Text style={styles.ruleIcon}>{icon}</Text>
      <Text style={styles.ruleText}>{text}</Text>
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 13,
    color: COLORS.textGray,
    fontWeight: '500',
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: 4,
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.purpleDark,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.neonGreen,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.neonGreen,
  },
  liveText: {
    color: COLORS.neonGreen,
    fontSize: 12,
    fontWeight: '800',
  },
  quoteCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 20,
    backgroundColor: COLORS.purpleDark,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.gold,
  },
  quoteText: {
    fontSize: 14,
    color: COLORS.textWhite,
    fontWeight: '600',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitleText: {
    fontSize: 13,
    color: COLORS.textGray,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 24,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.purpleDark,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.textGray,
  },
  statIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.gold,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textGray,
    textAlign: 'center',
    fontWeight: '600',
  },
  actionCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionCardPrimary: {
    backgroundColor: COLORS.gold,
  },
  actionCardSecondary: {
    backgroundColor: COLORS.purpleDark,
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  actionCardDisabled: {
    backgroundColor: COLORS.purpleDark,
    borderWidth: 1,
    borderColor: COLORS.textGray,
    opacity: 0.7,
  },
  actionCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 16,
  },
  actionTextBlock: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.darkBg,
    marginBottom: 3,
  },
  actionCardSub: {
    fontSize: 12,
    color: COLORS.darkBg,
    opacity: 0.7,
    fontWeight: '500',
  },
  rulesCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: COLORS.purpleDark,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  rulesTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textWhite,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  ruleIcon: {
    fontSize: 16,
    width: 24,
  },
  ruleText: {
    fontSize: 12,
    color: COLORS.textGray,
    flex: 1,
    lineHeight: 18,
  },
});
