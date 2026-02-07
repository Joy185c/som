'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSupabaseAuth, setIsSupabaseAuth] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsSupabaseAuth(!!session?.access_token);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Password updated. Please sign in again.');
      await supabase.auth.signOut();
      router.push('/admin/login');
      router.refresh();
    } catch {
      toast.error('Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  if (isSupabaseAuth === null) {
    return <div className="text-slate-400">Loading...</div>;
  }

  if (!isSupabaseAuth) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white">Change password</h1>
        <p className="mt-2 text-slate-400">You are using demo login. Configure Supabase and sign in with a real account to change your password.</p>
        <Link href="/admin/settings" className="mt-4 inline-block text-brand-400 hover:underline">Back to Settings</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Change password</h1>
      <p className="mt-1 text-slate-400">Set a new password for your admin account.</p>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="mt-8 max-w-md space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Confirm new password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-2.5 text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-brand-500 px-5 py-2.5 font-semibold text-white hover:bg-brand-400 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update password'}
        </button>
      </motion.form>
    </div>
  );
}
