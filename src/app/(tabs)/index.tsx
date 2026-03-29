import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/auth';
import { useMetricsStore } from '../../store/metrics';
import { ScoreCircle } from '../../components/ScoreCircle';
import { StreakBadge } from '../../components/StreakBadge';
import { XpBar } from '../../components/XpBar';
import { MetricCard } from '../../components/MetricCard';
import { Button } from '../../components/Button';
import { colors, fontSize, spacing } from '../../constants/theme';

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const { todayMetrics, progress, loading, loadAll } = useMetricsStore();

  useEffect(() => {
    if (user?.id) loadAll(user.id);
  }, [user?.id]);

  const handleRefresh = () => {
    if (user?.id) loadAll(user.id);
  };

  const pulseScore = progress?.pulse_score ?? 0;
  const streak = progress?.streak ?? 0;
  const xp = progress?.xp ?? 0;
  const hasLoggedToday = !!todayMetrics;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} tintColor={colors.accent.primary} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hey {user?.name || 'there'} 👋
            </Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </Text>
          </View>
          <StreakBadge streak={streak} compact />
        </View>

        {/* Pulse Score */}
        <View style={styles.scoreSection}>
          <ScoreCircle score={pulseScore} />
          <Text style={styles.scoreLabel}>PULSE SCORE</Text>
        </View>

        {/* Quick Log CTA */}
        {!hasLoggedToday && (
          <View style={styles.ctaCard}>
            <Text style={styles.ctaText}>You haven't logged today yet!</Text>
            <Button
              title="Log Now ⚡"
              onPress={() => router.push('/(tabs)/input')}
            />
          </View>
        )}

        {/* Today's Summary */}
        {hasLoggedToday && (
          <View>
            <Text style={styles.sectionTitle}>Today's Numbers</Text>
            <View style={styles.metricsRow}>
              <MetricCard
                label="Cash In"
                value={`€${todayMetrics.cash_in}`}
                icon="💰"
                color={colors.accent.success}
              />
              <MetricCard
                label="Cash Out"
                value={`€${todayMetrics.cash_out}`}
                icon="💸"
                color={colors.accent.danger}
              />
            </View>
            <View style={styles.metricsRow}>
              <MetricCard
                label="Deals"
                value={todayMetrics.deals_closed}
                icon="🤝"
                color={colors.accent.primary}
              />
              <MetricCard
                label="Leads"
                value={todayMetrics.new_leads}
                icon="🎯"
                color={colors.accent.warning}
              />
              <MetricCard
                label="Calls"
                value={todayMetrics.calls_booked}
                icon="📞"
                color={colors.accent.secondary}
              />
            </View>
          </View>
        )}

        {/* Streak */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Streak</Text>
          <StreakBadge streak={streak} />
        </View>

        {/* XP Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Level Progress</Text>
          <XpBar xp={xp} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text.primary,
  },
  date: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    marginTop: 2,
  },
  scoreSection: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  scoreLabel: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
    marginTop: spacing.md,
    letterSpacing: 2,
  },
  ctaCard: {
    backgroundColor: colors.bg.card,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.accent.primary + '40',
  },
  ctaText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
