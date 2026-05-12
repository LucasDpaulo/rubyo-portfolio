"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/public/Icons";
import { useState, useRef, type MouseEvent } from "react";
import { VideoModal } from "@/components/public/VideoModal";

export type VideoCardData = {
  id: string;
  title: string;
  provider: string;
  videoId: string;
  aspectRatio: string;
  tag: string | null;
  index: number;
  variant: "short" | "long";
};

export function VideoCard({ video }: { video: VideoCardData }) {
  const [open, setOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0, pct: 0 });
  const ref = useRef<HTMLButtonElement>(null);

  const thumb =
    video.provider === "youtube"
      ? `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
      : null;

  const tagText =
    video.tag ?? (video.aspectRatio === "9:16" ? "9:16 · Short" : "16:9 · Long");

  // asymmetric grid: short cards take 4 cols, long cards take 8 cols on lg+
  // first long takes 8, alternates for visual rhythm
  const span =
    video.variant === "short"
      ? "lg:col-span-4 aspect-[9/16]"
      : video.index % 3 === 1
        ? "lg:col-span-4 aspect-video"
        : "lg:col-span-8 aspect-video";

  function onMove(e: MouseEvent<HTMLButtonElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPos({ x, y, pct });
  }

  // simulate a fake timecode based on position (00:MM:SS format)
  const totalSec = Math.floor((pos.pct / 100) * 180); // pretend 3min video
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  const timecode = `00:${mm}:${ss}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, delay: video.index * 0.05, ease: "easeOut" }}
        className={`col-span-1 sm:col-span-2 ${span}`}
      >
        <button
          ref={ref}
          type="button"
          onClick={() => setOpen(true)}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onMouseMove={onMove}
          className="group relative block h-full w-full overflow-hidden rounded-xl bg-surface focus:outline-none"
          aria-label={`Assistir ${video.title}`}
          style={{ cursor: hovering ? "none" : "pointer" }}
        >
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb}
              alt={video.title}
              className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface to-bg text-white/30">
              <Icon name="play" className="h-12 w-12 fill-current" />
            </div>
          )}

          {/* orange tint on hover */}
          <div className="absolute inset-0 bg-accent/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* top-left tag */}
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[1.5px] text-white backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {tagText}
          </span>

          {/* top-right index */}
          <span className="timecode absolute right-3 top-3 text-[10px] text-white/60">
            {String(video.index + 1).padStart(2, "0")} / {String(video.index + 1).padStart(2, "0")}
          </span>

          {/* title (slides up on hover) */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden bg-gradient-to-t from-black/90 to-transparent p-5">
            <h3 className="translate-y-2 font-display text-xl font-extrabold uppercase leading-tight text-white opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
              {video.title}
            </h3>
          </div>

          {/* custom timecode cursor */}
          {hovering && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: pos.x, top: pos.y }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-black shadow-xl">
                <svg width="16" viewBox="0 0 20 17" fill="currentColor">
                  <path d="M0 0v17l15-8.5L0 0z" />
                </svg>
              </div>
              <div className="timecode mt-1 rounded bg-black/80 px-2 py-1 text-center text-[10px] text-white">
                {timecode}
              </div>
            </div>
          )}
        </button>
      </motion.div>

      {open && (
        <VideoModal
          provider={video.provider}
          videoId={video.videoId}
          title={video.title}
          aspectRatio={video.aspectRatio}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
