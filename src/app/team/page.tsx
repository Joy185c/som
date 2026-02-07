'use client';

import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail } from 'lucide-react';

const TEAM = [
  { id: '1', name: 'Alex Chen', position: 'Creative Director', bio: '10+ years in video & motion. Passionate about storytelling that moves people.', slug: 'alex-chen' },
  { id: '2', name: 'Jordan Lee', position: 'Lead Editor', bio: 'Premiere & DaVinci expert. Loves cutting for rhythm and emotion.', slug: 'jordan-lee' },
  { id: '3', name: 'Sam Rivera', position: 'Motion Designer', bio: 'After Effects wizard. Brings ideas to life frame by frame.', slug: 'sam-rivera' },
];

export default function TeamPage() {
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
          {TEAM.map((member, i) => (
            <motion.article
              key={member.id}
              id={member.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl border border-white/10 bg-white dark:bg-slate-800/50 backdrop-blur-xl p-8 transition-all hover:shadow-glow hover:border-white/20"
            >
              <div className="h-28 w-28 rounded-full bg-brand-500/30 flex items-center justify-center text-4xl font-bold text-white mx-auto mb-6 group-hover:scale-105 transition-transform">
                {member.name.charAt(0)}
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white text-center">{member.name}</h2>
              <p className="text-brand-500 font-medium text-center mt-1">{member.position}</p>
              <p className="mt-4 text-slate-600 dark:text-slate-400 text-center">{member.bio}</p>
              <div className="mt-6 flex justify-center gap-3">
                <a href="#" className="rounded-full p-2 bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-brand-500" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>
                <a href="#" className="rounded-full p-2 bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-brand-500" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
                <a href="#" className="rounded-full p-2 bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-brand-500" aria-label="Email"><Mail className="h-5 w-5" /></a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
