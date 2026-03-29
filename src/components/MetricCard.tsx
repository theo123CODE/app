import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, borderRadius, spacing } from '../constants/theme';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}

export function MetricCard({ label, value, icon, color = colors.text.primary }: MetricCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.subtle,
    gap: 4,
  },
  icon: {
    fontSize: 20,
  },
  value: {
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
