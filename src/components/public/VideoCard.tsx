"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/public/Icons";
import { useState } from "react";
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

  const thumb =
    video.provider === "youtube"
      ? `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
      : null;

  const tagText =
    video.tag ?? (video.aspectRatio === "9:16" ? "Short · 9:16" : "Long · 16:9");

  const aspect =
    video.variant === "short" ? "aspect-[9/16]" : "aspect-video";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45, delay: video.index * 0.05, ease: "easeOut" }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`group relative block w-full overflow-hidden rounded-xl bg-surface ${aspect}`}
          aria-label={`Assistir ${video.title}`}
        >
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb}
              alt={video.title}
              className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface to-bg text-white/30">
              <Icon name="play" className="h-10 w-10 fill-current" />
            </div>
          )}

          {/* dark gradient floor — always visible for legibility */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

          {/* tag top-left */}
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[1.2px] text-white backdrop-blur">
            <span className="h-1 w-1 rounded-full bg-accent" />
            {tagText}
          </span>

          {/* index top-right */}
          <span className="timecode absolute right-3 top-3 text-[10px] text-white/50">
            #{String(video.index + 1).padStart(2, "0")}
          </span>

          {/* play (visible, larger on hover) */}
          <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-black shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-black">
            <Icon name="play" className="ml-0.5 h-4 w-4 fill-current" />
          </span>

          {/* title */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="text-sm font-semibold leading-tight text-white">
              {video.title}
            </h3>
            <p className="mt-1 text-[11px] uppercase tracking-[1.5px] text-white/50">
              {video.provider === "youtube" ? "YouTube" : "Vimeo"} · Assistir
            </p>
          </div>
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
