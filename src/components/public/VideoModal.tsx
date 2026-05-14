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
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{
          background: "rgba(13, 10, 8, 0.18)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.97, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full ${isShort ? "max-w-[400px]" : "max-w-[1100px]"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar (Esc)"
            title="Fechar (Esc)"
            className="video-modal-close"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
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
