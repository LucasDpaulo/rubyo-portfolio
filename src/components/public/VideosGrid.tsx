"use client";

import { useState } from "react";
import type { Video } from "@prisma/client";
import { VideoCard } from "@/components/public/VideoCard";
import { Reveal } from "@/components/transitions/Reveal";

type LayoutMode = "default" | "grid" | "list";

function AddVideoButton({ aspectRatio }: { aspectRatio: "16:9" | "9:16" }) {
  return (
    <button
      type="button"
      className="add-video-btn"
      title={aspectRatio === "9:16" ? "Adicionar Short" : "Adicionar Long Form"}
      aria-label="Adicionar vídeo"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.dispatchEvent(
          new CustomEvent("open-edit", {
            detail: { type: "new-video", aspectRatio },
          }),
        );
      }}
    >
      +
    </button>
  );
}

function LayoutToggle({ mode, onToggle }: { mode: LayoutMode; onToggle: () => void }) {
  const isList = mode === "list";
  return (
    <button
      type="button"
      className="toggle-layout-btn"
      onClick={onToggle}
      title={isList ? "Ver em grade" : "Ver em lista"}
      aria-label={isList ? "Ver em grade" : "Ver em lista"}
    >
      {isList ? (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
        </svg>
      )}
    </button>
  );
}

export function VideosGrid({
  videos,
  isAdmin = false,
}: {
  videos: Video[];
  isAdmin?: boolean;
}) {
  const shorts = videos.filter((v) => v.aspectRatio === "9:16");
  const longs = videos.filter((v) => v.aspectRatio !== "9:16");

  const [longsMode, setLongsMode] = useState<LayoutMode>("default");

  const longsClass =
    longsMode === "grid"
      ? "vsl-stack layout-grid"
      : longsMode === "list"
        ? "vsl-stack layout-list"
        : "vsl-stack";

  return (
    <section id="work" className="work">
      {(shorts.length > 0 || isAdmin) && (
        <Reveal>
          <div className="section-header">
            <span className="section-label">TikTok / Shorts</span>
            <div className="section-actions">
              {isAdmin && <AddVideoButton aspectRatio="9:16" />}
            </div>
          </div>
          <div className="short-section">
            {shorts.map((v) => (
              <VideoCard key={v.id} video={v} variant="short" isAdmin={isAdmin} />
            ))}
          </div>
        </Reveal>
      )}

      {(longs.length > 0 || isAdmin) && (
        <Reveal style={{ marginTop: "2rem" }}>
          <div className="section-header">
            <span className="section-label">Long Form</span>
            <div className="section-actions">
              {isAdmin && <AddVideoButton aspectRatio="16:9" />}
              <LayoutToggle
                mode={longsMode}
                onToggle={() =>
                  setLongsMode((m) => (m === "grid" ? "list" : "grid"))
                }
              />
            </div>
          </div>
          <div className={longsClass}>
            {longs.map((v) => (
              <VideoCard key={v.id} video={v} variant="long" isAdmin={isAdmin} />
            ))}
          </div>
        </Reveal>
      )}

      {videos.length === 0 && !isAdmin && (
        <div
          style={{
            border: "1px solid rgba(196,149,106,0.1)",
            background: "var(--color-brown-dark)",
            padding: "5rem 1.5rem",
            borderRadius: 6,
            textAlign: "center",
            color: "var(--color-dim)",
            fontSize: "0.9rem",
          }}
        >
          Nenhum vídeo ainda. Adicione um pelo painel de admin (/admin).
        </div>
      )}
    </section>
  );
}
