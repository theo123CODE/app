import { Level } from '../types';

export const LEVELS: Level[] = [
  { name: 'Side Hustler', minXp: 0, maxXp: 500, level: 1 },
  { name: 'Freelance Warrior', minXp: 500, maxXp: 1500, level: 2 },
  { name: 'Growth Maker', minXp: 1500, maxXp: 4000, level: 3 },
  { name: 'Scale King', minXp: 4000, maxXp: 10000, level: 4 },
  { name: 'Market Leader', minXp: 10000, maxXp: Infinity, level: 5 },
];

export const XP_REWARDS = {
  dailyLog: 25,
  streakBonus3: 50,
  streakBonus7: 100,
  streakBonus30: 500,
  dealClosed: 10,
  leadGenerated: 5,
  callBooked: 5,
  revenueGoalHit: 200,
} as const;
