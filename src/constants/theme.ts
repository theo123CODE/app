export const colors = {
  bg: {
    primary: '#0A0A0F',
    secondary: '#12121A',
    tertiary: '#1A1A25',
    card: '#16161F',
    input: '#1E1E2A',
  },
  accent: {
    primary: '#6C5CE7',
    secondary: '#A29BFE',
    success: '#00D26A',
    warning: '#FBBF24',
    danger: '#FF6B6B',
    fire: '#FF6B35',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A0A0B8',
    muted: '#5A5A72',
    accent: '#6C5CE7',
  },
  border: {
    subtle: '#2A2A3A',
    accent: '#6C5CE730',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 24,
  xxl: 32,
  hero: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;
