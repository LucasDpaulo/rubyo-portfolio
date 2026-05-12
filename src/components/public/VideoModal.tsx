"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

type Props = {
  provider: string;
  videoId: string;
  title: string;
  aspectRatio: string;
  onClose: () => void;
};

export function VideoModal({ provider, videoId, title, aspectRatio, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const src =
    provider === "vimeo"
      ? `https://player.vimeo.com/video/${videoId}?autoplay=1`
      : `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  const isShort = aspectRatio === "9:16";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-6 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`relative w-full ${isShort ? "max-w-[360px]" : "max-w-[1100px]"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute -top-12 right-0 inline-flex h-10 items-center gap-2 rounded-full bg-bg/10 px-4 text-xs uppercase tracking-[2px] text-bg backdrop-blur transition-colors hover:bg-bg hover:text-ink"
          >
            Fechar ✕
          </button>
          <div
            className={`overflow-hidden rounded-2xl bg-black shadow-2xl ${
              isShort ? "aspect-[9/16]" : "aspect-video"
            }`}
          >
            <iframe
              src={src}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
