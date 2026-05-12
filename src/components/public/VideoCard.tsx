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

  const aspect =
    video.variant === "short" ? "aspect-[9/16]" : "aspect-video";

  const thumb =
    video.provider === "youtube"
      ? `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
      : null;

  const tagText =
    video.tag ?? (video.aspectRatio === "9:16" ? "Short" : "Long");

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5, delay: video.index * 0.05, ease: "easeOut" }}
        className="group"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`relative block w-full overflow-hidden rounded-2xl bg-ink/5 ${aspect}`}
          aria-label={`Assistir ${video.title}`}
        >
          {thumb && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumb}
              alt={video.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          )}
          {!thumb && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink/80 to-ink/40 text-bg/50">
              <Icon name="play" className="h-12 w-12 fill-current" />
            </div>
          )}

          {/* hover overlay */}
          <div className="absolute inset-0 flex items-end justify-between p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent"
              aria-hidden
            />
            <div className="relative text-left text-bg">
              <span className="block text-[10px] uppercase tracking-[2px] opacity-70">
                Vídeo · {tagText}
              </span>
              <span className="mt-1 block max-w-[80%] text-base font-medium leading-tight">
                {video.title}
              </span>
            </div>
          </div>

          {/* tag (top-left) */}
          <span className="absolute left-3 top-3 rounded-full border border-bg/30 bg-ink/40 px-3 py-1 text-[10px] font-medium uppercase tracking-[1.5px] text-bg backdrop-blur">
            {tagText}
          </span>

          {/* play button (center) */}
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bg/90 transition-transform duration-300 group-hover:scale-110">
            <Icon
              name="play"
              className="ml-1 h-5 w-5 fill-ink"
            />
          </span>
        </button>

        <div className="mt-4 flex items-start justify-between gap-3">
          <h3 className="text-sm font-medium text-ink">{video.title}</h3>
          <span className="shrink-0 text-xs uppercase tracking-[1.5px] text-ink/40">
            {String(video.index + 1).padStart(2, "0")}
          </span>
        </div>
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
