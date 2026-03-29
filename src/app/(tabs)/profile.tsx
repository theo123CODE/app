import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/auth';
import { useMetricsStore } from '../../store/metrics';
import { XpBar } from '../../components/XpBar';
import { Button } from '../../components/Button';
import { getLevelForXp } from '../../utils/xp';
import { colors, fontSize, spacing, borderRadius } from '../../constants/theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const { progress } = useMetricsStore();

  const xp = progress?.xp ?? 0;
  const level = getLevelForXp(xp);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Profile</Text>

        {/* User card */}
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.goal}>Goal: €{user?.monthly_goal?.toLocaleString()}/mo</Text>
        </View>

        {/* Stats */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Stats</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Level</Text>
            <Text style={styles.statValue}>{level.name}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total XP</Text>
            <Text style={styles.statValue}>{xp.toLocaleString()}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Current Streak</Text>
            <Text style={styles.statValue}>🔥 {progress?.streak ?? 0}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Best Streak</Text>
            <Text style={styles.statValue}>{progress?.best_streak ?? 0} days</Text>
          </View>
        </View>

        {/* XP */}
        <XpBar xp={xp} />

        <Button title="Sign Out" onPress={signOut} variant="secondary" />
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
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.text.primary,
  },
  card: {
    backgroundColor: colors.bg.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  avatarText: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: '#fff',
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text.primary,
  },
  email: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
  },
  goal: {
    fontSize: fontSize.md,
    color: colors.accent.secondary,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  statLabel: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  statValue: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text.primary,
  },
});
