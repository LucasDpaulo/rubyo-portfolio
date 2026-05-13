"use client";

import { useState } from "react";
import type { Video } from "@prisma/client";
import { EditButton } from "@/components/public/EditButton";

type Variant = "short" | "long";

export function VideoCard({
  video,
  variant,
  isAdmin = false,
}: {
  video: Video;
  variant: Variant;
  isAdmin?: boolean;
}) {
  const [playing, setPlaying] = useState(false);

  const orient = variant === "short" ? "vertical" : "horizontal";
  const tag = variant === "short" ? "Vertical" : "Horizontal";

  if (playing && video.provider === "youtube") {
    return (
      <div className={`work-card ${orient}`} style={{ cursor: "default" }}>
        <iframe
          src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={video.title}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  const thumb =
    video.provider === "youtube"
      ? `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`
      : null;
  const fallback =
    video.provider === "youtube"
      ? `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
      : null;

  return (
    <div
      className={`work-card ${orient}`}
      role="button"
      tabIndex={0}
      onClick={() => setPlaying(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setPlaying(true);
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
      <div className="card-overlay">
        <h3>{video.title}</h3>
        <p>{video.tag || tag}</p>
      </div>
      <div className="play-circle">
        <svg viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      {isAdmin && (
        <div className="card-edit">
          <EditButton payload={{ type: "project", video }} label="Editar vídeo" />
        </div>
      )}
    </div>
  );
}
