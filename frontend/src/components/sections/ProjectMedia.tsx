import { useState } from 'react';
import type { Project } from '@/types';

type ProjectMediaProps = {
  title: string;
  media?: Project['media'];
  loading?: 'lazy' | 'eager';
  className?: string;
};

export function ProjectMedia({ title, media, loading = 'lazy', className = '' }: ProjectMediaProps) {
  const [failed, setFailed] = useState(false);
  const hasVideo = Boolean(media?.video) && !failed;
  const hasImage = Boolean(media?.image) && !failed;

  return (
    <div className={`aspect-video w-full overflow-hidden bg-terminal-bg ${className}`}>
      {hasVideo ? (
        <video
          className="h-full w-full object-contain"
          src={media?.video}
          controls
          preload="metadata"
          playsInline
          aria-label={`${title} project preview`}
          onError={() => setFailed(true)}
        />
      ) : hasImage ? (
        <img
          src={media?.image}
          alt={`${title} application preview`}
          loading={loading}
          className="h-full w-full object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-1 border-b border-terminal-border px-4 text-center">
          <span className="mono text-[10px] tracking-[0.18em] text-terminal-accent">PROJECT PREVIEW</span>
          <span className="text-xs text-terminal-dim">Media not added yet</span>
        </div>
      )}
    </div>
  );
}
