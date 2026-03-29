import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Polyline, Circle as SvgCircle, Line, Text as SvgText } from 'react-native-svg';
import { useAuthStore } from '../../store/auth';
import { supabase } from '../../lib/supabase';
import { DailyMetrics } from '../../types';
import { colors, fontSize, spacing, borderRadius } from '../../constants/theme';
import { format, parseISO, subDays } from 'date-fns';

const CHART_WIDTH = Dimensions.get('window').width - 64;
const CHART_HEIGHT = 160;
const CHART_PADDING = 30;

export default function HistoryScreen() {
  const { user } = useAuthStore();
  const [metrics, setMetrics] = useState<DailyMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [user?.id]);

  const loadHistory = async () => {
    if (!user?.id) return;
    setLoading(true);
    const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
    const { data } = await supabase
      .from('daily_metrics')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', thirtyDaysAgo)
      .order('date', { ascending: true });

    setMetrics((data as DailyMetrics[]) || []);
    setLoading(false);
  };

  const chartData = metrics.map((m) => m.cash_in);
  const maxValue = Math.max(...chartData, 1);

  const getX = (i: number) =>
    CHART_PADDING + (i / Math.max(chartData.length - 1, 1)) * (CHART_WIDTH - CHART_PADDING * 2);
  const getY = (v: number) =>
    CHART_HEIGHT - CHART_PADDING - (v / maxValue) * (CHART_HEIGHT - CHART_PADDING * 2);

  const points = chartData.map((v, i) => `${getX(i)},${getY(v)}`).join(' ');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>Last 30 days</Text>

        {/* Revenue Chart */}
        {chartData.length > 1 && (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Revenue (€)</Text>
            <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
                <Line
                  key={pct}
                  x1={CHART_PADDING}
                  y1={getY(maxValue * pct)}
                  x2={CHART_WIDTH - CHART_PADDING}
                  y2={getY(maxValue * pct)}
                  stroke={colors.border.subtle}
                  strokeWidth={1}
                />
              ))}
              {/* Line */}
              <Polyline
                points={points}
                fill="none"
                stroke={colors.accent.primary}
                strokeWidth={2.5}
                strokeLinejoin="round"
              />
              {/* Dots */}
              {chartData.map((v, i) => (
                <SvgCircle
                  key={i}
                  cx={getX(i)}
                  cy={getY(v)}
                  r={3}
                  fill={colors.accent.primary}
                />
              ))}
              {/* Y-axis labels */}
              <SvgText
                x={4}
                y={getY(maxValue) + 4}
                fill={colors.text.muted}
                fontSize={10}
              >
                {maxValue}
              </SvgText>
              <SvgText
                x={4}
                y={getY(0) + 4}
                fill={colors.text.muted}
                fontSize={10}
              >
                0
              </SvgText>
            </Svg>
          </View>
        )}

        {/* Day list */}
        <View style={styles.dayList}>
          {[...metrics].reverse().map((m) => (
            <View key={m.id} style={styles.dayRow}>
              <View style={styles.dayDate}>
                <Text style={styles.dayDateText}>
                  {format(parseISO(m.date), 'MMM d')}
                </Text>
                <Text style={styles.dayWeekday}>
                  {format(parseISO(m.date), 'EEE')}
                </Text>
              </View>
              <View style={styles.dayMetrics}>
                <View style={styles.dayMetric}>
                  <Text style={styles.dayMetricValue}>€{m.cash_in}</Text>
                  <Text style={styles.dayMetricLabel}>in</Text>
                </View>
                <View style={styles.dayMetric}>
                  <Text style={[styles.dayMetricValue, { color: colors.accent.danger }]}>€{m.cash_out}</Text>
                  <Text style={styles.dayMetricLabel}>out</Text>
                </View>
                <View style={styles.dayMetric}>
                  <Text style={styles.dayMetricValue}>{m.deals_closed}</Text>
                  <Text style={styles.dayMetricLabel}>deals</Text>
                </View>
                <View style={styles.dayMetric}>
                  <Text style={styles.dayMetricValue}>{m.new_leads}</Text>
                  <Text style={styles.dayMetricLabel}>leads</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {metrics.length === 0 && !loading && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyText}>No data yet. Start logging!</Text>
          </View>
        )}
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
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    marginTop: -spacing.sm,
  },
  chartCard: {
    backgroundColor: colors.bg.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  chartTitle: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dayList: {
    gap: spacing.xs,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  dayDate: {
    width: 60,
  },
  dayDateText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text.primary,
  },
  dayWeekday: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
  },
  dayMetrics: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayMetric: {
    alignItems: 'center',
  },
  dayMetricValue: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text.primary,
  },
  dayMetricLabel: {
    fontSize: fontSize.xs,
    color: colors.text.muted,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.text.muted,
  },
});
