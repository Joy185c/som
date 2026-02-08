'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiGet, apiMutate, apiUpload } from '@/lib/admin-api';

type SocialLinks = { linkedin?: string; twitter?: string; email?: string };

type TeamMember = {
  id: string;
  name: string;
  position: string;
  bio: string | null;
  photo_url: string | null;
  social_links?: SocialLinks | null;
  published: boolean;
};

const emptySocial: SocialLinks = { linkedin: '', twitter: '', email: '' };

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'add' | string | null>(null);
  const [form, setForm] = useState({ name: '', position: '', bio: '', photo_url: '', published: true, social_links: emptySocial });
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      const data = await apiGet<TeamMember[]>('/api/admin/team');
      setMembers(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to load team');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (m: TeamMember) => {
    const sl = (m.social_links && typeof m.social_links === 'object') ? m.social_links as SocialLinks : {};
    setForm({
      name: m.name,
      position: m.position,
      bio: m.bio ?? '',
      photo_url: m.photo_url ?? '',
      published: m.published,
      social_links: { linkedin: sl.linkedin ?? '', twitter: sl.twitter ?? '', email: sl.email ?? '' },
    });
    setModal(m.id);
  };

  const handlePhoto = async (file: File) => {
    setUploading(true);
    try {
      const { url } = await apiUpload(file, 'team');
      setForm((f) => ({ ...f, photo_url: url }));
      toast.success('Photo uploaded');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const social_links = {
        linkedin: form.social_links.linkedin || undefined,
        twitter: form.social_links.twitter || undefined,
        email: form.social_links.email || undefined,
      };
      if (modal === 'add') {
        await apiMutate('/api/admin/team', 'POST', {
          name: form.name,
          position: form.position,
          bio: form.bio || null,
          photo_url: form.photo_url || null,
          social_links: Object.keys(social_links).some((k) => (social_links as Record<string, string | undefined>)[k]) ? social_links : {},
          published: form.published,
        });
        toast.success('Member added');
      } else {
        await apiMutate('/api/admin/team', 'PATCH', {
          id: modal,
          name: form.name,
          position: form.position,
          bio: form.bio || null,
          photo_url: form.photo_url || null,
          social_links: Object.keys(social_links).some((k) => (social_links as Record<string, string | undefined>)[k]) ? social_links : {},
          published: form.published,
        });
        toast.success('Updated');
      }
      setModal(null);
      setForm({ name: '', position: '', bio: '', photo_url: '', published: true, social_links: emptySocial });
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this team member?')) return;
    try {
      await apiMutate('/api/admin/team', 'DELETE', undefined, { id });
      toast.success('Removed');
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading team...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Manager</h1>
          <p className="mt-1 text-slate-400">Add members, photo, bio. Publish/unpublish.</p>
        </div>
        <button
          type="button"
          onClick={() => { setModal('add'); setForm({ name: '', position: '', bio: '', photo_url: '', published: true, social_links: emptySocial }); }}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-white hover:bg-brand-400"
        >
          <Plus className="h-5 w-5" /> Add member
        </button>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {members.map((m) => (
          <motion.div
            key={m.id}
            layout
            className="rounded-xl border border-white/10 bg-slate-800/50 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="h-14 w-14 rounded-full bg-brand-500/30 flex items-center justify-center text-xl font-bold text-white overflow-hidden">
                  {m.photo_url ? <img src={m.photo_url} alt="" className="h-full w-full object-cover" /> : m.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white">{m.name}</p>
                  <p className="text-sm text-brand-400">{m.position}</p>
                  <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs ${m.published ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                    {m.published ? 'Published' : 'Hidden'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => openEdit(m)} className="rounded-lg p-2 text-slate-500 hover:text-white">
                  <Pencil className="h-5 w-5" />
                </button>
                <button type="button" onClick={() => remove(m.id)} className="rounded-lg p-2 text-red-400 hover:bg-red-500/20">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {members.length === 0 && !modal && <p className="text-slate-500">No team members yet.</p>}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setModal(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">{modal === 'add' ? 'Add member' : 'Edit member'}</h2>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Position *</label>
                <input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={2} className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Photo (URL or upload)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={form.photo_url}
                    onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-white"
                  />
                  <label className="rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-sm text-slate-300 cursor-pointer hover:bg-slate-700">
                    {uploading ? '…' : 'Upload'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handlePhoto(e.target.files[0])} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">LinkedIn URL</label>
                <input type="url" value={form.social_links.linkedin} onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, linkedin: e.target.value } })} placeholder="https://linkedin.com/in/..." className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Twitter / X URL</label>
                <input type="url" value={form.social_links.twitter} onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, twitter: e.target.value } })} placeholder="https://twitter.com/..." className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email (Gmail / contact)</label>
                <input type="email" value={form.social_links.email} onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, email: e.target.value } })} placeholder="member@company.com" className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="pub" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded border-white/20 text-brand-500" />
                <label htmlFor="pub" className="text-sm text-slate-400">Published</label>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="rounded-xl bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-400">Save</button>
                <button type="button" onClick={() => setModal(null)} className="rounded-xl border border-white/20 px-4 py-2 text-slate-400">Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
