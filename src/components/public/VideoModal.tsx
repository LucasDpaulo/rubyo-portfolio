"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  provider: string;
  videoId: string;
  title: string;
  aspectRatio: string;
  tag?: string | null;
  onClose: () => void;
};

export function VideoModal({ provider, videoId, title, aspectRatio, tag, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
      : `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  const isShort = aspectRatio === "9:16";
  const formatLabel = tag || (isShort ? "Vertical" : "Horizontal");

  const handleContact = () => {
    onClose();
    setTimeout(() => window.dispatchEvent(new Event("open-contact")), 300);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="video-modal-backdrop"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className={`video-modal-shell ${isShort ? "is-short" : "is-long"}`}
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

          <div className={`video-modal-frame ${isShort ? "aspect-short" : "aspect-long"}`}>
            <iframe
              src={src}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="video-modal-info">
            <div className="video-modal-info-text">
              <h3>{title}</h3>
              <p>{formatLabel}</p>
            </div>
            <button type="button" className="video-modal-cta" onClick={handleContact}>
              Contato
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
