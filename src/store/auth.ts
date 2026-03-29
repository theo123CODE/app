import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthState {
  user: User | null;
  session: any;
  loading: boolean;
  setSession: (session: any) => void;
  setUser: (user: User | null) => void;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  completeOnboarding: (name: string, monthlyGoal: number) => Promise<{ error: string | null }>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,

  setSession: (session) => set({ session, loading: false }),

  setUser: (user) => set({ user }),

  signUp: async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  },

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },

  completeOnboarding: async (name, monthlyGoal) => {
    const session = get().session;
    if (!session?.user?.id) return { error: 'No session' };

    const { error } = await supabase.from('users').upsert({
      id: session.user.id,
      email: session.user.email,
      name,
      monthly_goal: monthlyGoal,
    });

    if (error) return { error: error.message };

    // Create initial progress record
    await supabase.from('user_progress').upsert({
      user_id: session.user.id,
      xp: 0,
      level: 1,
      streak: 0,
      best_streak: 0,
      pulse_score: 0,
    });

    await get().loadUser();
    return { error: null };
  },

  loadUser: async () => {
    const session = get().session;
    if (!session?.user?.id) return;

    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (data) set({ user: data as User });
  },
}));
