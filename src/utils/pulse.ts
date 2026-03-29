import { DailyMetrics } from '../types';

/**
 * Calculate Pulse Score (0-100) based on:
 * - Activity: did the user log today? (30 pts)
 * - Streak: consecutive days (30 pts)
 * - Performance: growth vs previous days (40 pts)
 */
export function calculatePulseScore(
  todayMetrics: DailyMetrics | null,
  recentMetrics: DailyMetrics[],
  streak: number
): number {
  let score = 0;

  // Activity score (30 pts) - did user log today?
  if (todayMetrics) {
    const hasData =
      todayMetrics.cash_in > 0 ||
      todayMetrics.deals_closed > 0 ||
      todayMetrics.new_leads > 0 ||
      todayMetrics.calls_booked > 0;
    score += hasData ? 30 : 15; // partial credit for opening + logging zeros
  }

  // Streak score (30 pts)
  if (streak >= 30) score += 30;
  else if (streak >= 14) score += 25;
  else if (streak >= 7) score += 20;
  else if (streak >= 3) score += 15;
  else if (streak >= 1) score += 10;

  // Performance score (40 pts) - compare today vs avg of last 7 days
  if (todayMetrics && recentMetrics.length > 0) {
    const avgCashIn =
      recentMetrics.reduce((sum, m) => sum + m.cash_in, 0) / recentMetrics.length;
    const avgDeals =
      recentMetrics.reduce((sum, m) => sum + m.deals_closed, 0) / recentMetrics.length;
    const avgLeads =
      recentMetrics.reduce((sum, m) => sum + m.new_leads, 0) / recentMetrics.length;

    let perfScore = 0;

    // Revenue growth (20 pts)
    if (avgCashIn > 0) {
      const revenueRatio = todayMetrics.cash_in / avgCashIn;
      perfScore += Math.min(20, Math.round(revenueRatio * 15));
    } else if (todayMetrics.cash_in > 0) {
      perfScore += 20;
    }

    // Activity growth (20 pts)
    const todayActivity = todayMetrics.deals_closed + todayMetrics.new_leads + todayMetrics.calls_booked;
    const avgActivity = avgDeals + avgLeads;
    if (avgActivity > 0) {
      const activityRatio = todayActivity / avgActivity;
      perfScore += Math.min(20, Math.round(activityRatio * 12));
    } else if (todayActivity > 0) {
      perfScore += 20;
    }

    score += perfScore;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

export function getPulseLabel(score: number): string {
  if (score >= 80) return 'On Fire';
  if (score >= 60) return 'Strong';
  if (score >= 40) return 'Building';
  if (score >= 20) return 'Warming Up';
  return 'Cold Start';
}

export function getPulseColor(score: number): string {
  if (score >= 80) return '#00D26A';
  if (score >= 60) return '#6C5CE7';
  if (score >= 40) return '#FBBF24';
  if (score >= 20) return '#FF6B35';
  return '#FF6B6B';
}
