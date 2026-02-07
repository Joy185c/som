'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

const DEMO_EMAIL = 'admin@showoffsmedia.com';
const DEMO_PASSWORD = 'admin123';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const hasSupabase = typeof window !== 'undefined'
    ? !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    : !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (hasSupabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast.error(error.message || 'Invalid email or password.');
          return;
        }
        if (data.session) {
          localStorage.removeItem('admin_token');
          toast.success('Welcome back!');
          router.push('/admin');
          router.refresh();
          return;
        }
      }
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        localStorage.setItem('admin_token', 'demo-token');
        toast.success('Welcome back! (Demo mode — set up Supabase for full features)');
        router.push('/admin');
        router.refresh();
        return;
      }
      toast.error('Invalid email or password.');
    } catch {
      toast.error('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/50 p-8 shadow-glow"
      >
        <h1 className="text-2xl font-bold text-white text-center">Admin Login</h1>
        <p className="mt-2 text-center text-slate-400 text-sm">ShowOffs Media</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              placeholder="admin@showoffsmedia.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-500 py-3 font-semibold text-white hover:bg-brand-400 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        {!hasSupabase && (
          <p className="mt-6 text-center text-xs text-slate-500">
            Demo: {DEMO_EMAIL} / {DEMO_PASSWORD}
          </p>
        )}
      </motion.div>
    </div>
  );
}
