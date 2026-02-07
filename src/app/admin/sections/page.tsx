'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GripVertical, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiGet, apiMutate } from '@/lib/admin-api';

type Section = { id: string; name: string; slug: string; order_index: number; visible: boolean };

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await apiGet<Section[]>('/api/admin/sections');
      setSections(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load sections');
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleVisible = async (id: string, visible: boolean) => {
    const next = sections.map((s) => (s.id === id ? { ...s, visible } : s));
    setSections(next);
    setSaving(true);
    try {
      await apiMutate('/api/admin/sections', 'PUT', {
        sections: next.map((s, i) => ({ id: s.id, order_index: i, visible: s.visible })),
      });
      toast.success('Saved');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save');
      setSections(sections);
    } finally {
      setSaving(false);
    }
  };

  const saveOrder = async (reordered: Section[]) => {
    setSections(reordered);
    setSaving(true);
    try {
      await apiMutate('/api/admin/sections', 'PUT', {
        sections: reordered.map((s, i) => ({ id: s.id, order_index: i, visible: s.visible })),
      });
      toast.success('Order saved');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save');
      load();
    } finally {
      setSaving(false);
    }
  };

  const move = (index: number, dir: number) => {
    const i2 = index + dir;
    if (i2 < 0 || i2 >= sections.length) return;
    const next = [...sections];
    [next[index], next[i2]] = [next[i2], next[index]];
    saveOrder(next);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading sections...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Section Manager</h1>
          <p className="mt-1 text-slate-400">Reorder and toggle visibility. Changes save automatically.</p>
        </div>
        {saving && <span className="text-sm text-slate-500 flex items-center gap-1"><Loader2 className="h-4 w-4 animate-spin" /> Saving...</span>}
      </div>
      {sections.length === 0 ? (
        <p className="mt-8 text-slate-500">No sections yet. Run the seed in <code className="bg-slate-800 px-1 rounded">supabase/schema.sql</code> or add sections via SQL.</p>
      ) : (
        <div className="mt-8 space-y-2">
          {sections.map((s, index) => (
            <motion.div
              key={s.id}
              layout
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-slate-800/50 p-4"
            >
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => move(index, -1)} className="p-1 text-slate-500 hover:text-white disabled:opacity-30" disabled={index === 0} aria-label="Move up">
                  <GripVertical className="h-5 w-5 rotate-90" />
                </button>
                <button type="button" onClick={() => move(index, 1)} className="p-1 text-slate-500 hover:text-white disabled:opacity-30" disabled={index === sections.length - 1} aria-label="Move down">
                  <GripVertical className="h-5 w-5 -rotate-90" />
                </button>
              </div>
              <span className="flex-1 font-medium text-white">{s.name}</span>
              <span className="text-sm text-slate-500">/{s.slug}</span>
              <button
                type="button"
                onClick={() => toggleVisible(s.id, !s.visible)}
                className="rounded-lg p-2 text-slate-400 hover:text-white"
                title={s.visible ? 'Hide' : 'Show'}
              >
                {s.visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
