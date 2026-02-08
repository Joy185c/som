'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Work = {
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  project_type: string;
  tools: string[];
};

export default function SingleWorkPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWork = async () => {
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error || !data) {
        notFound();
      } else {
        setWork(data);
      }

      setLoading(false);
    };

    fetchWork();
  }, [slug]);

  if (loading) {
    return <p className="p-10 text-center">Loading...</p>;
  }

  if (!work) return null;

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{work.title}</h1>

      {work.video_url ? (
        <video
          src={work.video_url}
          controls
          className="w-full rounded-lg mb-6"
        />
      ) : work.thumbnail_url ? (
        <img
          src={work.thumbnail_url}
          alt={work.title}
          className="w-full rounded-lg mb-6"
        />
      ) : null}

      {work.description && (
        <p className="mb-4 text-gray-700">
          {work.description}
        </p>
      )}

      <div className="text-sm text-gray-600">
        <p><b>Project type:</b> {work.project_type}</p>

        {work.tools?.length > 0 && (
          <p>
            <b>Tools:</b> {work.tools.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
}
