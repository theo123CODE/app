import { LEVELS, XP_REWARDS } from '../constants/levels';
import { DailyMetrics, Level } from '../types';

export function calculateXpForLog(metrics: DailyMetrics, streak: number): number {
  let xp = XP_REWARDS.dailyLog;

  // Bonus XP for metrics
  xp += metrics.deals_closed * XP_REWARDS.dealClosed;
  xp += metrics.new_leads * XP_REWARDS.leadGenerated;
  xp += metrics.calls_booked * XP_REWARDS.callBooked;

  // Streak bonuses
  if (streak === 3) xp += XP_REWARDS.streakBonus3;
  if (streak === 7) xp += XP_REWARDS.streakBonus7;
  if (streak === 30) xp += XP_REWARDS.streakBonus30;

  return xp;
}

export function getLevelForXp(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXp) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getXpProgressInLevel(xp: number): { current: number; max: number; percent: number } {
  const level = getLevelForXp(xp);
  const nextLevel = LEVELS.find((l) => l.level === level.level + 1);

  if (!nextLevel) {
    return { current: xp - level.minXp, max: 1, percent: 1 };
  }

  const current = xp - level.minXp;
  const max = nextLevel.minXp - level.minXp;
  return { current, max, percent: Math.min(1, current / max) };
}
