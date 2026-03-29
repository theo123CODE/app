import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/auth';
import { Button } from '../../components/Button';
import { colors, fontSize, borderRadius, spacing } from '../../constants/theme';

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { completeOnboarding } = useAuthStore();

  const handleComplete = async () => {
    if (!name.trim()) {
      setError('What should we call you?');
      return;
    }
    const goalNum = parseInt(goal, 10);
    if (!goalNum || goalNum < 0) {
      setError('Enter a monthly revenue goal');
      return;
    }

    setError('');
    setLoading(true);
    const result = await completeOnboarding(name.trim(), goalNum);
    if (result.error) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.emoji}>🚀</Text>
          <Text style={styles.title}>Welcome to BizPulse</Text>
          <Text style={styles.subtitle}>Let's set up your profile in 30 seconds</Text>
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Your name</Text>
            <TextInput
              style={styles.input}
              placeholder="John"
              placeholderTextColor={colors.text.muted}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <Text style={styles.label}>Monthly revenue goal (€)</Text>
            <TextInput
              style={styles.input}
              placeholder="10000"
              placeholderTextColor={colors.text.muted}
              value={goal}
              onChangeText={setGoal}
              keyboardType="numeric"
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            title="Let's Go 🔥"
            onPress={handleComplete}
            loading={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg.primary,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  form: {
    gap: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    height: 52,
    backgroundColor: colors.bg.input,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.lg,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  error: {
    color: colors.accent.danger,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
});
