import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../constants';
import { PointsBar } from '../../components';
import { SpinResult } from '../../types';
import { usePoints } from '../../hooks';
import * as storage from '../../storage/store';

export default function HistoryScreen() {
  const { points, loading: pointsLoading } = usePoints();
  const [history, setHistory] = useState<SpinResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSpins: 0,
    rewardSpins: 0,
    breakSpins: 0,
    punishmentSpins: 0,
  });

  useFocusEffect(
    React.useCallback(() => {
      const loadHistory = async () => {
        setLoading(true);
        const allHistory = await storage.getSpinHistory();
        setHistory(allHistory);

        // Calculate stats
        const statsData = {
          totalSpins: allHistory.length,
          rewardSpins: allHistory.filter((s) => s.wheelType === 'reward').length,
          breakSpins: allHistory.filter((s) => s.wheelType === 'break').length,
          punishmentSpins: allHistory.filter(
            (s) => s.wheelType === 'punishment'
          ).length,
        };
        setStats(statsData);
        setLoading(false);
      };
      loadHistory();
    }, [])
  );

  if (pointsLoading || !points) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  const getWheelIcon = (wheelType: string): string => {
    switch (wheelType) {
      case 'reward':
        return '🎁';
      case 'break':
        return '☕';
      case 'punishment':
        return '😤';
      default:
        return '❓';
    }
  };

  const getWheelColor = (
    wheelType: string
  ): string => {
    switch (wheelType) {
      case 'reward':
        return COLORS.gold;
      case 'break':
        return COLORS.info;
      case 'punishment':
        return COLORS.red;
      default:
        return COLORS.textGray;
    }
  };

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;

    return date.toLocaleDateString();
  };

  const StatCard = ({ icon, label, value }: { icon: string; label: string; value: number }) => (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Spin History</Text>
          <Text style={styles.subtitle}>Your spin journey</Text>
        </View>

        {/* Points Bar */}
        <PointsBar
          current={points.current}
          todayEarned={points.todayEarned}
          totalXP={points.totalXP}
        />

        {/* Statistics Grid */}
        <View style={styles.statsGrid}>
          <StatCard icon="📊" label="Total Spins" value={stats.totalSpins} />
          <StatCard icon="🎁" label="Rewards" value={stats.rewardSpins} />
          <StatCard icon="☕" label="Breaks" value={stats.breakSpins} />
          <StatCard icon="😤" label="Punishments" value={stats.punishmentSpins} />
        </View>

        {/* History List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.gold} />
          </View>
        ) : history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎡</Text>
            <Text style={styles.emptyText}>No spins yet!</Text>
            <Text style={styles.emptySubtext}>
              Go to the Spin tab and start your first spin
            </Text>
          </View>
        ) : (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>Recent Spins</Text>
            <FlatList
              data={history}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    styles.historyItem,
                    { borderLeftColor: getWheelColor(item.wheelType) },
                  ]}
                >
                  <View style={styles.historyLeft}>
                    <Text style={styles.historyIcon}>
                      {getWheelIcon(item.wheelType)}
                    </Text>
                    <View>
                      <Text
                        style={[
                          styles.historyOutcome,
                          { color: getWheelColor(item.wheelType) },
                        ]}
                      >
                        {item.outcome}
                      </Text>
                      <Text style={styles.historyTime}>
                        {formatDate(item.timestamp)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.historyRight}>
                    <Text style={styles.historyIndex}>#{index + 1}</Text>
                  </View>
                </View>
              )}
            />
          </View>
        )}

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Tips</Text>
          <Text style={styles.tipText}>
            • Each spin costs 1 point (reward wheel only)
          </Text>
          <Text style={styles.tipText}>
            • Your history is saved on your device
          </Text>
          <Text style={styles.tipText}>
            • Break wheel is always free
          </Text>
          <Text style={styles.tipText}>
            • Punishment wheel costs 2 points
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 8,
    marginBottom: 20,
  },
  statCard: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textGray,
    marginBottom: 4,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gold,
    backgroundColor: COLORS.purpleDark,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    textAlign: 'center',
  },
  historyContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textWhite,
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.purpleDark,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  historyOutcome: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 11,
    color: COLORS.textGray,
  },
  historyRight: {
    alignItems: 'center',
  },
  historyIndex: {
    fontSize: 12,
    color: COLORS.textGray,
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    marginVertical: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textWhite,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: COLORS.textGray,
    textAlign: 'center',
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
