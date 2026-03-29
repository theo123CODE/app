import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, borderRadius, spacing } from '../constants/theme';
import { getLevelForXp, getXpProgressInLevel } from '../utils/xp';

interface XpBarProps {
  xp: number;
}

export function XpBar({ xp }: XpBarProps) {
  const level = getLevelForXp(xp);
  const { current, max, percent } = getXpProgressInLevel(xp);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelIcon}>⚡</Text>
          <Text style={styles.levelName}>{level.name}</Text>
        </View>
        <Text style={styles.xpText}>
          {current}/{max === 1 ? '∞' : max} XP
        </Text>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${Math.round(percent * 100)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  levelIcon: {
    fontSize: 16,
  },
  levelName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.accent.secondary,
  },
  xpText: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
  },
  barBg: {
    height: 8,
    backgroundColor: colors.bg.tertiary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.accent.primary,
    borderRadius: borderRadius.full,
  },
});
