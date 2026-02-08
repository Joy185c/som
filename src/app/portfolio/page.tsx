'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type Work = {
  id: string;
  title: string;
  slug: string;
  project_type: string;
  thumbnail_url: string | null;
};

export default function PortfolioPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorks = async () => {
      const { data, error } = await supabase
        .from('works')
        .select('id,title,slug,project_type,thumbnail_url')
        .eq('published', true)
        .order('order_index', { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setWorks(data || []);
      }

      setLoading(false);
    };

    fetchWorks();
  }, []);

  if (loading) {
    return <p className="p-10 text-center">Loading works...</p>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Portfolio</h1>

      {works.length === 0 && (
        <p>No works published yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {works.map((work) => (
          <Link
            key={work.id}
            href={`/portfolio/${work.slug}`}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            {work.thumbnail_url && (
              <img
                src={work.thumbnail_url}
                alt={work.title}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-4">
              <h2 className="font-semibold text-lg">{work.title}</h2>
              <p className="text-sm text-gray-500">
                {work.project_type}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
