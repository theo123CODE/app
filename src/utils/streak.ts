import { format, subDays, parseISO, differenceInCalendarDays } from 'date-fns';

export function calculateStreak(lastLogDate: string | null, currentStreak: number): {
  streak: number;
  isActive: boolean;
} {
  if (!lastLogDate) return { streak: 0, isActive: false };

  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  if (lastLogDate === today) {
    return { streak: currentStreak, isActive: true };
  }

  if (lastLogDate === yesterday) {
    return { streak: currentStreak, isActive: true };
  }

  // Streak is broken
  return { streak: 0, isActive: false };
}

export function getToday(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function isToday(dateStr: string): boolean {
  return dateStr === getToday();
}

export function daysSince(dateStr: string): number {
  return differenceInCalendarDays(new Date(), parseISO(dateStr));
}
