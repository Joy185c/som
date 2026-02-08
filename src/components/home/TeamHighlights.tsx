'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
  { id: '1', name: 'Alex Chen', position: 'Creative Director', bio: '10+ years in video & motion. Passionate about storytelling.', photo_url: null, social_links: null },
  { id: '2', name: 'Jordan Lee', position: 'Lead Editor', bio: 'Premiere & DaVinci expert. Loves cutting for rhythm.', photo_url: null, social_links: null },
  { id: '3', name: 'Sam Rivera', position: 'Motion Designer', bio: 'After Effects wizard. Brings ideas to life.', photo_url: null, social_links: null },
];

function slug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function TeamHighlights() {
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('id, name, position, bio, photo_url, social_links')
        .eq('published', true)
        .order('order_index', { ascending: true })
        .limit(6);
      if (!error && data?.length) setMembers(data);
      else setMembers(DEMO_TEAM);
    };
    fetchTeam();
  }, []);

  const list = members.length > 0 ? members : DEMO_TEAM;

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Meet the Team</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">The people behind your next hit video.</p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((member, i) => {
            const socials = (member.social_links && typeof member.social_links === 'object') ? member.social_links as Record<string, string> : {};
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/team#${slug(member.name)}`}>
                  <div className="group rounded-2xl border border-white/10 bg-white/5 dark:bg-slate-800/50 backdrop-blur-xl p-6 transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-glow">
                    <div className="h-24 w-24 rounded-full bg-brand-500/30 flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4 group-hover:scale-105 transition-transform overflow-hidden">
                      {member.photo_url ? (
                        <img src={member.photo_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        member.name.charAt(0)
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white text-center">{member.name}</h3>
                    <p className="text-brand-400 text-sm font-medium text-center mt-1">{member.position}</p>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 text-center line-clamp-2">{member.bio ?? ''}</p>
                    <div className="mt-4 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {socials.linkedin ? (
                        <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-full p-2 bg-white/10 text-slate-400 hover:text-white" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
                      ) : (
                        <span className="rounded-full p-2 bg-white/10 text-slate-400"><Linkedin className="h-4 w-4" /></span>
                      )}
                      {socials.twitter ? (
                        <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="rounded-full p-2 bg-white/10 text-slate-400 hover:text-white" aria-label="Twitter"><Twitter className="h-4 w-4" /></a>
                      ) : (
                        <span className="rounded-full p-2 bg-white/10 text-slate-400"><Twitter className="h-4 w-4" /></span>
                      )}
                      {socials.email ? (
                        <a href={`mailto:${socials.email}`} className="rounded-full p-2 bg-white/10 text-slate-400 hover:text-white" aria-label="Email"><Mail className="h-4 w-4" /></a>
                      ) : (
                        <span className="rounded-full p-2 bg-white/10 text-slate-400"><Mail className="h-4 w-4" /></span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-10 text-center">
          <Link href="/team" className="text-brand-500 font-semibold hover:underline">View full team →</Link>
        </p>
      </div>
    </section>
  );
}
