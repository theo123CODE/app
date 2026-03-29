import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/auth';
import { useMetricsStore } from '../../store/metrics';
import { MetricInput } from '../../components/MetricInput';
import { Button } from '../../components/Button';
import { colors, fontSize, spacing, borderRadius } from '../../constants/theme';

export default function InputScreen() {
  const { user } = useAuthStore();
  const { todayMetrics, saving, saveMetrics, loadAll } = useMetricsStore();

  const [cashIn, setCashIn] = useState(0);
  const [cashOut, setCashOut] = useState(0);
  const [deals, setDeals] = useState(0);
  const [leads, setLeads] = useState(0);
  const [calls, setCalls] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (todayMetrics) {
      setCashIn(todayMetrics.cash_in);
      setCashOut(todayMetrics.cash_out);
      setDeals(todayMetrics.deals_closed);
      setLeads(todayMetrics.new_leads);
      setCalls(todayMetrics.calls_booked);
    }
  }, [todayMetrics]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaved(false);
    await saveMetrics(user.id, {
      cash_in: cashIn,
      cash_out: cashOut,
      deals_closed: deals,
      new_leads: leads,
      calls_booked: calls,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const hasChanges =
    !todayMetrics ||
    cashIn !== todayMetrics.cash_in ||
    cashOut !== todayMetrics.cash_out ||
    deals !== todayMetrics.deals_closed ||
    leads !== todayMetrics.new_leads ||
    calls !== todayMetrics.calls_booked;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Daily Log</Text>
          <Text style={styles.subtitle}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </Text>
        </View>

        <View style={styles.inputs}>
          <MetricInput
            label="Cash In"
            icon="💰"
            value={cashIn}
            onChange={setCashIn}
            suffix="€"
            step={100}
          />
          <MetricInput
            label="Cash Out"
            icon="💸"
            value={cashOut}
            onChange={setCashOut}
            suffix="€"
            step={100}
          />
          <MetricInput
            label="Deals Closed"
            icon="🤝"
            value={deals}
            onChange={setDeals}
          />
          <MetricInput
            label="New Leads"
            icon="🎯"
            value={leads}
            onChange={setLeads}
          />
          <MetricInput
            label="Calls Booked"
            icon="📞"
            value={calls}
            onChange={setCalls}
          />
        </View>

        {saved && (
          <View style={styles.savedBanner}>
            <Text style={styles.savedText}>Saved! +25 XP ⚡</Text>
          </View>
        )}

        <Button
          title={todayMetrics ? 'Update' : 'Save & Earn XP ⚡'}
          onPress={handleSave}
          loading={saving}
          disabled={!hasChanges}
        />
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
    gap: 4,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
  },
  inputs: {
    gap: spacing.sm,
  },
  savedBanner: {
    backgroundColor: colors.accent.success + '20',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent.success + '40',
  },
  savedText: {
    color: colors.accent.success,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
