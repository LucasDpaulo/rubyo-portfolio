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

  const classes =
    video.variant === "short"
      ? "aspect-[9/16] sm:row-span-2 lg:col-start-1 lg:row-start-1 lg:row-end-3"
      : "aspect-video";

  const tagText =
    video.tag ?? (video.aspectRatio === "9:16" ? "9:16 · Short" : "16:9 · Long");

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45, delay: video.index * 0.06, ease: "easeOut" }}
        whileHover={{ y: -2 }}
        className={`group relative flex flex-col items-center justify-center gap-2.5 overflow-hidden rounded-[3px] border border-accent/10 bg-brown text-cream transition-colors hover:border-accent ${classes}`}
      >
        <span className="absolute left-2.5 top-2.5 rounded-sm border border-accent/20 bg-bg/70 px-2 py-[3px] text-[9px] uppercase tracking-[1.5px] text-accent">
          {tagText}
        </span>

        <span className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-accent transition-colors group-hover:bg-accent">
          <Icon
            name="play"
            className="ml-[3px] h-3.5 w-3.5 fill-accent transition-colors group-hover:fill-bg"
          />
        </span>

        <span className="font-display text-[11px] tracking-[3px] text-brown2">
          {video.variant === "short" ? "SHORT FORM" : String(video.index).padStart(2, "0")}
        </span>
      </motion.button>

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
