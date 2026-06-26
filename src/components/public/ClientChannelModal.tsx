"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Video } from "@prisma/client";
import type { ClientReview, SocialLink } from "@/lib/validators";
import { ClientAvatar, VerifiedBadge } from "@/components/public/ClientAvatar";
import { VideoCard } from "@/components/public/VideoCard";
import { parseVideoUrl } from "@/lib/youtube";

export function ClientChannelModal({
  client,
  videos,
  socials,
  email,
  onClose,
}: {
  client: ClientReview;
  videos: Video[];
  socials: SocialLink[];
  email: string;
  onClose: () => void;
}) {
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

  if (!mounted) return null;

  const ids = new Set(client.videoIds ?? []);
  const mine = videos.filter((v) => ids.has(v.id));

  // vídeos adicionados por URL (YouTube/Vimeo) viram objetos Video-like pro VideoCard
  const urlVideos: Video[] = (client.videoUrls ?? [])
    .map((vu, i) => {
      const parsed = parseVideoUrl(vu.url);
      if (!parsed) return null;
      const short = /\/shorts\//.test(vu.url);
      return {
        id: `u-${i}`,
        title: vu.title?.trim() || "Vídeo",
        url: vu.url,
        provider: parsed.provider,
        videoId: parsed.videoId,
        aspectRatio: short ? "9:16" : "16:9",
        tag: null,
        sortOrder: 0,
        createdAt: new Date(0),
        updatedAt: new Date(0),
      } as Video;
    })
    .filter((v): v is Video => v !== null);

  const all = [...mine, ...urlVideos];
  const longs = all.filter((v) => v.aspectRatio !== "9:16");
  const shorts = all.filter((v) => v.aspectRatio === "9:16");

  const name = client.name.trim() || "Canal";
  const handle = client.handle?.trim();
  const subs = client.subscribers?.trim();
  const vids = client.videos?.trim();
  const description = client.description?.trim();
  const channelUrl = client.channelUrl?.trim();

  const statLine = [handle ? `@${handle}` : null, subs ? `${subs} inscritos` : null, vids ? `${vids} vídeos` : null]
    .filter(Boolean)
    .join("  ·  ");

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="channel-modal-backdrop"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="channel-modal-shell"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar (Esc)"
            title="Fechar (Esc)"
            className="channel-modal-close"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <header className="channel-header">
            <ClientAvatar name={name} logoUrl={client.logoUrl} adjustments={client.logoAdjustments} size={120} />
            <div className="channel-meta">
              <h2 className="channel-name">
                {name}
                {client.verified && <VerifiedBadge />}
              </h2>
              {statLine && <p className="channel-stats">{statLine}</p>}
              {description && <p className="channel-desc">{description}</p>}
              {channelUrl && (
                <a className="channel-link" href={channelUrl} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
                    <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
                  </svg>
                  Visitar canal
                </a>
              )}
            </div>
          </header>

          <div className="channel-body">
            {longs.length === 0 && shorts.length === 0 ? (
              <p className="channel-empty">Nenhum vídeo marcado para este cliente ainda.</p>
            ) : (
              <>
                {longs.length > 0 && (
                  <section className="channel-section">
                    <span className="section-label">Vídeos</span>
                    <div className="channel-grid-long">
                      {longs.map((v) => (
                        <VideoCard key={v.id} video={v} variant="long" socials={socials} email={email} />
                      ))}
                    </div>
                  </section>
                )}
                {shorts.length > 0 && (
                  <section className="channel-section">
                    <span className="section-label">Shorts</span>
                    <div className="channel-grid-short">
                      {shorts.map((v) => (
                        <VideoCard key={v.id} video={v} variant="short" socials={socials} email={email} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
