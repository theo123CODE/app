export interface User {
  id: string;
  email: string;
  name: string;
  monthly_goal: number;
  created_at: string;
}

export interface DailyMetrics {
  id: string;
  user_id: string;
  date: string;
  cash_in: number;
  cash_out: number;
  deals_closed: number;
  new_leads: number;
  calls_booked: number;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  xp: number;
  level: number;
  streak: number;
  best_streak: number;
  last_log_date: string | null;
  pulse_score: number;
  updated_at: string;
}

export type LevelName =
  | 'Side Hustler'
  | 'Freelance Warrior'
  | 'Growth Maker'
  | 'Scale King'
  | 'Market Leader';

export interface Level {
  name: LevelName;
  minXp: number;
  maxXp: number;
  level: number;
}
