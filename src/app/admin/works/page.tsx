'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2, Upload, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiGet, apiMutate, apiUpload } from '@/lib/admin-api';

type Work = {
  id: string;
  title: string;
  slug: string;
  project_type: string;
  published: boolean;
  thumbnail_url: string | null;
  video_url: string | null;
  is_vertical: boolean;
};

const PROJECT_TYPES = ['Reels', 'Shorts', 'Promo', 'Motion Graphics', 'Ads'];

export default function AdminWorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'add' | null>(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    project_type: 'Reels',
    video_url: '',
    thumbnail_url: '',
    is_vertical: false,
    published: true,
  });
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      const data = await apiGet<Work[]>('/api/admin/works');
      setWorks(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load works');
      setWorks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const slugFromTitle = (t: string) => t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleFile = async (file: File, field: 'thumbnail_url' | 'video_url') => {
    setUploading(true);
    try {
      const folder = field === 'thumbnail_url' ? 'thumbnails' : 'videos';
      const { url } = await apiUpload(file, folder);
      setForm((f) => ({ ...f, [field]: url }));
      toast.success('Uploaded');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiMutate('/api/admin/works', 'POST', {
        ...form,
        slug: form.slug || slugFromTitle(form.title),
        video_url: form.video_url || null,
        thumbnail_url: form.thumbnail_url || null,
      });
      toast.success('Work added');
      setModal(null);
      setForm({ title: '', slug: '', description: '', project_type: 'Reels', video_url: '', thumbnail_url: '', is_vertical: false, published: true });
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to add');
    }
  };

  const setPublished = async (id: string, published: boolean) => {
    try {
      await apiMutate('/api/admin/works', 'PATCH', { id, published });
      setWorks((prev) => prev.map((w) => (w.id === id ? { ...w, published } : w)));
      toast.success(published ? 'Published' : 'Unpublished');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to update');
    }
  };

  const deleteWork = async (id: string) => {
    if (!confirm('Delete this work?')) return;
    try {
      await apiMutate('/api/admin/works', 'DELETE', undefined, { id });
      toast.success('Deleted');
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading works...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Media / Works</h1>
          <p className="mt-1 text-slate-400">Upload videos and thumbnails, manage portfolio.</p>
        </div>
        <button
          type="button"
          onClick={() => setModal('add')}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-white hover:bg-brand-400"
        >
          <Plus className="h-5 w-5" />
          Add work
        </button>
      </div>

      <div className="mt-8 rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Preview</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Title</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Type</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
              <th className="w-32" />
            </tr>
          </thead>
          <tbody>
            {works.map((w) => (
              <tr key={w.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="py-3 px-4">
                  <div className="h-12 w-20 rounded bg-slate-700 overflow-hidden flex items-center justify-center">
                    {w.thumbnail_url ? (
                      <img src={w.thumbnail_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Play className="h-5 w-5 text-slate-500" />
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-white font-medium">{w.title}</td>
                <td className="py-3 px-4 text-slate-400">{w.project_type}</td>
                <td className="py-3 px-4">
                  <button
                    type="button"
                    onClick={() => setPublished(w.id, !w.published)}
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${w.published ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}
                  >
                    {w.published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <button type="button" onClick={() => deleteWork(w.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {works.length === 0 && (
          <p className="py-12 text-center text-slate-500">No works yet. Add one to get started.</p>
        )}
      </div>

      {modal === 'add' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setModal(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold text-white mb-4">Add work</h2>
            <form onSubmit={submitAdd} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugFromTitle(e.target.value) })}
                  required
                  className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-white"
                  placeholder="auto from title"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Project type</label>
                <select
                  value={form.project_type}
                  onChange={(e) => setForm({ ...form, project_type: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-white"
                >
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Thumbnail (upload or URL)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={form.thumbnail_url}
                    onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-white"
                  />
                  <label className="rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-sm text-slate-300 cursor-pointer hover:bg-slate-700">
                    {uploading ? '…' : 'Upload'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], 'thumbnail_url')}
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Video URL (or upload)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={form.video_url}
                    onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-white"
                  />
                  <label className="rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-sm text-slate-300 cursor-pointer hover:bg-slate-700">
                    {uploading ? '…' : 'Upload'}
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], 'video_url')}
                    />
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="vertical"
                  checked={form.is_vertical}
                  onChange={(e) => setForm({ ...form, is_vertical: e.target.checked })}
                  className="rounded border-white/20 text-brand-500"
                />
                <label htmlFor="vertical" className="text-sm text-slate-400">Vertical (Reels/Shorts)</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="rounded border-white/20 text-brand-500"
                />
                <label htmlFor="published" className="text-sm text-slate-400">Published</label>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="submit" className="rounded-xl bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-400">
                  Add
                </button>
                <button type="button" onClick={() => setModal(null)} className="rounded-xl border border-white/20 px-4 py-2 text-slate-400 hover:bg-white/10">
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
