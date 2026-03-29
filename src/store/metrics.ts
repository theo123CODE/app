import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { DailyMetrics, UserProgress } from '../types';
import { getToday } from '../utils/streak';
import { calculatePulseScore } from '../utils/pulse';
import { calculateXpForLog, getLevelForXp } from '../utils/xp';
import { format, subDays } from 'date-fns';

interface MetricsState {
  todayMetrics: DailyMetrics | null;
  recentMetrics: DailyMetrics[];
  progress: UserProgress | null;
  loading: boolean;
  saving: boolean;

  loadTodayMetrics: (userId: string) => Promise<void>;
  loadRecentMetrics: (userId: string) => Promise<void>;
  loadProgress: (userId: string) => Promise<void>;
  saveMetrics: (userId: string, metrics: Partial<DailyMetrics>) => Promise<void>;
  loadAll: (userId: string) => Promise<void>;
}

export const useMetricsStore = create<MetricsState>((set, get) => ({
  todayMetrics: null,
  recentMetrics: [],
  progress: null,
  loading: true,
  saving: false,

  loadTodayMetrics: async (userId) => {
    const { data } = await supabase
      .from('daily_metrics')
      .select('*')
      .eq('user_id', userId)
      .eq('date', getToday())
      .single();

    set({ todayMetrics: data as DailyMetrics | null });
  },

  loadRecentMetrics: async (userId) => {
    const sevenDaysAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');
    const { data } = await supabase
      .from('daily_metrics')
      .select('*')
      .eq('user_id', userId)
      .gte('date', sevenDaysAgo)
      .order('date', { ascending: false });

    set({ recentMetrics: (data as DailyMetrics[]) || [] });
  },

  loadProgress: async (userId) => {
    const { data } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    set({ progress: data as UserProgress | null });
  },

  saveMetrics: async (userId, metrics) => {
    set({ saving: true });
    const today = getToday();
    const existing = get().todayMetrics;

    const metricsData = {
      user_id: userId,
      date: today,
      cash_in: metrics.cash_in ?? existing?.cash_in ?? 0,
      cash_out: metrics.cash_out ?? existing?.cash_out ?? 0,
      deals_closed: metrics.deals_closed ?? existing?.deals_closed ?? 0,
      new_leads: metrics.new_leads ?? existing?.new_leads ?? 0,
      calls_booked: metrics.calls_booked ?? existing?.calls_booked ?? 0,
      updated_at: new Date().toISOString(),
    };

    if (existing) {
      await supabase
        .from('daily_metrics')
        .update(metricsData)
        .eq('id', existing.id);
    } else {
      await supabase.from('daily_metrics').insert(metricsData);
    }

    // Update progress (streak, XP, pulse)
    const progress = get().progress;
    const isNewLog = !existing;

    if (progress && isNewLog) {
      const lastLogDate = progress.last_log_date;
      const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

      let newStreak = 1;
      if (lastLogDate === yesterday) {
        newStreak = progress.streak + 1;
      } else if (lastLogDate === today) {
        newStreak = progress.streak;
      }

      const savedMetrics = { ...metricsData, id: '', created_at: '', updated_at: '' } as DailyMetrics;
      const xpEarned = calculateXpForLog(savedMetrics, newStreak);
      const newXp = progress.xp + xpEarned;
      const newLevel = getLevelForXp(newXp);

      const recentMetrics = get().recentMetrics;
      const newPulse = calculatePulseScore(savedMetrics, recentMetrics, newStreak);

      await supabase
        .from('user_progress')
        .update({
          streak: newStreak,
          best_streak: Math.max(progress.best_streak, newStreak),
          xp: newXp,
          level: newLevel.level,
          last_log_date: today,
          pulse_score: newPulse,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    }

    // Reload everything
    await get().loadAll(userId);
    set({ saving: false });
  },

  loadAll: async (userId) => {
    set({ loading: true });
    await Promise.all([
      get().loadTodayMetrics(userId),
      get().loadRecentMetrics(userId),
      get().loadProgress(userId),
    ]);
    set({ loading: false });
  },
}));
