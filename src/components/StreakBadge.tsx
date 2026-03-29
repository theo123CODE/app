import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, borderRadius, spacing } from '../constants/theme';

interface StreakBadgeProps {
  streak: number;
  compact?: boolean;
}

export function StreakBadge({ streak, compact = false }: StreakBadgeProps) {
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.fireEmoji}>🔥</Text>
        <Text style={styles.compactCount}>{streak}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.fireEmoji}>🔥</Text>
      <View>
        <Text style={styles.count}>{streak} day streak</Text>
        <Text style={styles.subtitle}>
          {streak === 0
            ? 'Log today to start!'
            : streak < 7
            ? 'Keep it going!'
            : streak < 30
            ? 'You\'re on fire!'
            : 'Unstoppable!'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.tertiary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    gap: 4,
  },
  fireEmoji: {
    fontSize: 24,
  },
  count: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text.primary,
  },
  compactCount: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.accent.fire,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
});
