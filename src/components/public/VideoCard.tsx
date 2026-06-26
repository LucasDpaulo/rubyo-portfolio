"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Video } from "@prisma/client";
import { EditButton } from "@/components/public/EditButton";
import { ReorderArrows } from "@/components/public/ReorderArrows";
import { VideoModal } from "@/components/public/VideoModal";
import { HoverPreview } from "@/components/public/HoverPreview";
import { trackClick } from "@/lib/track";
import type { SocialLink } from "@/lib/validators";

type Variant = "short" | "long";

export function VideoCard({
  video,
  variant,
  isAdmin = false,
  prevId = null,
  nextId = null,
  socials,
  email,
}: {
  video: Video;
  variant: Variant;
  isAdmin?: boolean;
  prevId?: string | null;
  nextId?: string | null;
  socials: SocialLink[];
  email: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [preview, setPreview] = useState(false);
  const [muted, setMuted] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  // preview ao manter o mouse parado no card por ~1s (sem abrir o modal)
  function startPreview() {
    if (previewTimer.current) clearTimeout(previewTimer.current);
    previewTimer.current = setTimeout(() => {
      setMuted(true); // sempre começa mudo (política de autoplay)
      setPreview(true);
    }, 1100);
  }
  function stopPreview() {
    if (previewTimer.current) {
      clearTimeout(previewTimer.current);
      previewTimer.current = null;
    }
    setPreview(false);
  }
  useEffect(() => {
    return () => {
      if (previewTimer.current) clearTimeout(previewTimer.current);
    };
  }, []);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (deleting) return;
    const ok = window.confirm(`Excluir "${video.title}"? Essa ação não pode ser desfeita.`);
    if (!ok) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/videos/${video.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      router.refresh();
    } catch (err) {
      setDeleting(false);
      alert(err instanceof Error ? err.message : "Erro ao excluir");
    }
  }

  function openVideo() {
    stopPreview();
    if (!isAdmin) trackClick("video", video.title);
    setPlaying(true);
  }

  const orient = variant === "short" ? "vertical" : "horizontal";
  const tag = variant === "short" ? "Vertical" : "Horizontal";

  const thumb =
    video.provider === "youtube"
      ? `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`
      : null;
  const fallback =
    video.provider === "youtube"
      ? `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
      : null;

  const previewSrc =
    video.provider === "vimeo"
      ? `https://player.vimeo.com/video/${video.videoId}?autoplay=1&muted=1&loop=1&background=1`
      : "";

  return (
    <>
      <div
        className={`work-card ${orient}`}
        role="button"
        tabIndex={0}
        onClick={openVideo}
        onMouseEnter={startPreview}
        onMouseLeave={stopPreview}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openVideo();
          }
        }}
        aria-label={`Assistir ${video.title}`}
      >
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={video.title}
            onError={(e) => {
              if (fallback) (e.currentTarget as HTMLImageElement).src = fallback;
            }}
            style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
          />
        ) : (
          <div
            style={{
              background: "var(--color-brown-med)",
              width: "100%",
              height: "100%",
              position: "absolute",
              inset: 0,
            }}
          />
        )}
        {preview &&
          (video.provider === "vimeo" ? (
            <iframe
              className="card-preview"
              src={previewSrc}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              tabIndex={-1}
            />
          ) : (
            <HoverPreview
              videoId={video.videoId}
              muted={muted}
              aspectRatio={video.aspectRatio}
              onEnd={() => setPreview(false)}
            />
          ))}
        <div className="card-overlay">
          <h3>{video.title}</h3>
          <p>{video.tag || tag}</p>
        </div>
        {!preview && (
          <div className="play-circle">
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
        {preview && video.provider !== "vimeo" && (
          <button
            type="button"
            className="card-mute-btn"
            onClick={(e) => {
              e.stopPropagation();
              setMuted((m) => !m);
            }}
            aria-label={muted ? "Ativar som" : "Desativar som"}
            title={muted ? "Ativar som" : "Desativar som"}
          >
            {muted ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H2v6h4l5 4V5z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>
        )}
        {isAdmin && (
          <div className="card-edit">
            <EditButton payload={{ type: "project", video }} label="Editar vídeo" />
            <button
              type="button"
              className="card-delete-btn"
              onClick={handleDelete}
              disabled={deleting}
              aria-label="Excluir vídeo"
              title="Excluir vídeo"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
                <path d="M10 11v6M14 11v6" />
              </svg>
            </button>
          </div>
        )}
        {isAdmin && (
          <ReorderArrows
            id={video.id}
            prevId={prevId}
            nextId={nextId}
            direction={variant === "short" ? "horizontal" : "vertical"}
          />
        )}
      </div>

      {playing && (
        <VideoModal
          provider={video.provider}
          videoId={video.videoId}
          title={video.title}
          aspectRatio={video.aspectRatio}
          tag={video.tag}
          socials={socials}
          email={email}
          onClose={() => setPlaying(false)}
        />
      )}
    </>
  );
}
