# BizPulse - The Whoop of Business

A gamified mobile app for tracking daily business metrics. Built with Expo + React Native + Supabase.

## Quick Start

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration file: `supabase/migrations/001_initial_schema.sql`
3. Copy your project URL and anon key from **Settings > API**

### 2. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install & Run

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) or press `w` for web.

## Architecture

```
src/
  app/                  # Expo Router screens
    (auth)/             # Auth flow (login, onboarding)
    (tabs)/             # Main app (dashboard, input, history, profile)
  components/           # Reusable UI components
  constants/            # Theme, levels config
  lib/                  # Supabase client
  store/                # Zustand state management
  types/                # TypeScript types
  utils/                # Business logic (pulse, xp, streak)
```

## Features

- **Pulse Score (0-100)**: Composite score based on activity, streak, and performance
- **Daily Metrics Input**: Cash in/out, deals, leads, calls - under 5 seconds
- **Streak System**: Consecutive daily logging with visual feedback
- **XP & Levels**: Side Hustler → Freelance Warrior → Growth Maker → Scale King → Market Leader
- **History**: 30-day chart + daily breakdown
- **Dark Premium UI**: Inspired by Whoop, Linear, Stripe

## Tech Stack

- **Frontend**: React Native (Expo SDK 54), TypeScript
- **Navigation**: Expo Router (file-based)
- **State**: Zustand
- **Backend**: Supabase (Auth + PostgreSQL + RLS)
- **Charts**: react-native-svg
