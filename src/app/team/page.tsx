'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type TeamMember = {
  id: string;
  name: string;
  position: string;
  bio: string | null;
  photo_url: string | null;
  social_links: Record<string, string> | null;
};

const DEMO_TEAM: TeamMember[] = [
  { id: '1', name: 'Alex Chen', position: 'Creative Director', bio: '10+ years in video & motion. Passionate about storytelling that moves people.', photo_url: null, social_links: null },
  { id: '2', name: 'Jordan Lee', position: 'Lead Editor', bio: 'Premiere & DaVinci expert. Loves cutting for rhythm and emotion.', photo_url: null, social_links: null },
  { id: '3', name: 'Sam Rivera', position: 'Motion Designer', bio: 'After Effects wizard. Brings ideas to life frame by frame.', photo_url: null, social_links: null },
];

function slug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('id, name, position, bio, photo_url, social_links')
        .eq('published', true)
        .order('order_index', { ascending: true });
      if (!error && data?.length) setMembers(data);
      else setMembers(DEMO_TEAM);
      setLoading(false);
    };
    fetchTeam();
  }, []);

  const list = members.length > 0 ? members : DEMO_TEAM;

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-slate-900/30 flex items-center justify-center">
        <p className="text-slate-500">Loading team...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-slate-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Our Team</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">The creatives behind every project.</p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((member, i) => {
            const socials = (member.social_links && typeof member.social_links === 'object') ? member.social_links as Record<string, string> : {};
            return (
              <motion.article
                key={member.id}
                id={slug(member.name)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-white/10 bg-white dark:bg-slate-800/50 backdrop-blur-xl p-8 transition-all hover:shadow-glow hover:border-white/20"
              >
                <div className="h-28 w-28 rounded-full bg-brand-500/30 flex items-center justify-center text-4xl font-bold text-white mx-auto mb-6 group-hover:scale-105 transition-transform overflow-hidden">
                  {member.photo_url ? (
                    <img src={member.photo_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    member.name.charAt(0)
                  )}
                </div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white text-center">{member.name}</h2>
                <p className="text-brand-500 font-medium text-center mt-1">{member.position}</p>
                <p className="mt-4 text-slate-600 dark:text-slate-400 text-center">{member.bio ?? ''}</p>
                <div className="mt-6 flex justify-center gap-3">
                  {socials.linkedin ? (
                    <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-full p-2 bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-brand-500" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>
                  ) : (
                    <span className="rounded-full p-2 bg-slate-100 dark:bg-white/10 text-slate-500"><Linkedin className="h-5 w-5" /></span>
                  )}
                  {socials.twitter ? (
                    <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="rounded-full p-2 bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-brand-500" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
                  ) : (
                    <span className="rounded-full p-2 bg-slate-100 dark:bg-white/10 text-slate-500"><Twitter className="h-5 w-5" /></span>
                  )}
                  {socials.email ? (
                    <a href={`mailto:${socials.email}`} className="rounded-full p-2 bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-brand-500" aria-label="Email"><Mail className="h-5 w-5" /></a>
                  ) : (
                    <span className="rounded-full p-2 bg-slate-100 dark:bg-white/10 text-slate-500"><Mail className="h-5 w-5" /></span>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
