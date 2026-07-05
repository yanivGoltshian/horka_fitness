"use client";

import { useEffect, useRef } from "react";

export type Reel = {
  video: string;
  poster: string;
  position: string;
  alt: string;
};

/**
 * Grid of Instagram-style reels. Videos autoplay muted+looped, but only while
 * on-screen (IntersectionObserver) to keep mobile light. Poster paints instantly.
 */
export default function ReelGrid({ items }: { items: Reel[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const vids = Array.from(root.querySelectorAll<HTMLVideoElement>("video"));

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { threshold: 0.35 }
    );

    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, [items]);

  return (
    <div
      ref={rootRef}
      data-animate-group
      className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
    >
      {items.map((r) => (
        <div
          key={r.video}
          className="relative aspect-[3/4] rounded-2xl overflow-hidden ring-1 ring-border group bg-ink"
        >
          <video
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: r.position }}
            poster={r.poster}
            src={r.video}
            muted
            loop
            playsInline
            preload="none"
            aria-label={r.alt}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  );
}
