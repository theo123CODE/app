import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { colors, fontSize, borderRadius, spacing } from '../constants/theme';

interface MetricInputProps {
  label: string;
  icon: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  step?: number;
}

export function MetricInput({ label, icon, value, onChange, suffix = '', step = 1 }: MetricInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      <View style={styles.left}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.right}>
        <Pressable
          style={styles.stepBtn}
          onPress={() => onChange(Math.max(0, value - step))}
        >
          <Text style={styles.stepText}>−</Text>
        </Pressable>
        <TextInput
          style={styles.input}
          value={value === 0 ? '' : String(value)}
          placeholder="0"
          placeholderTextColor={colors.text.muted}
          keyboardType="numeric"
          onChangeText={(text) => {
            const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
            onChange(isNaN(num) ? 0 : num);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
        <Pressable
          style={styles.stepBtn}
          onPress={() => onChange(value + step)}
        >
          <Text style={styles.stepText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bg.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  containerFocused: {
    borderColor: colors.accent.primary,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.bg.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: fontSize.lg,
    color: colors.text.primary,
    fontWeight: '600',
  },
  input: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    minWidth: 50,
    padding: 0,
  },
  suffix: {
    fontSize: fontSize.md,
    color: colors.text.muted,
  },
});
