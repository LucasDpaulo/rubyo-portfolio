"use client";

import { useEffect, useMemo, useState } from "react";
import type { AvatarAdjustments } from "@/lib/validators";
import { DEFAULT_AVATAR_ADJUSTMENTS } from "@/lib/validators";

export function avatarFilter(adj: AvatarAdjustments): string {
  return [
    `brightness(${adj.brightness})`,
    `contrast(${adj.contrast})`,
    `saturate(${adj.saturation})`,
    `hue-rotate(${adj.hue}deg)`,
    `sepia(${adj.sepia})`,
    `grayscale(${adj.grayscale})`,
    `blur(${adj.blur}px)`,
  ].join(" ");
}

export function avatarImgStyle(adj: AvatarAdjustments): React.CSSProperties {
  return {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `scale(${adj.zoom}) translate(${adj.offsetX}%, ${adj.offsetY}%)`,
    filter: avatarFilter(adj),
  };
}

const AUTOPLAY_MS = 5000;

export function Avatar({
  name,
  imageUrl,
  imageUrl2,
  adjustments,
}: {
  name: string;
  imageUrl?: string;
  imageUrl2?: string;
  adjustments?: AvatarAdjustments;
}) {
  const initial = (name || "R").trim().charAt(0).toUpperCase();
  const adj = adjustments ?? DEFAULT_AVATAR_ADJUSTMENTS;

  const photos = useMemo(
    () => [imageUrl, imageUrl2].filter((u): u is string => !!u && u.trim().length > 0),
    [imageUrl, imageUrl2],
  );
  const [idx, setIdx] = useState(0);
  const hasMultiple = photos.length > 1;

  useEffect(() => {
    if (!hasMultiple) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % photos.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [hasMultiple, photos.length]);

  useEffect(() => {
    if (idx >= photos.length) setIdx(0);
  }, [idx, photos.length]);

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIdx((i) => (i + 1) % photos.length);
  };

  const imgStyle = avatarImgStyle(adj);

  return (
    <div className="avatar-stage">
      <div className="avatar-container">
        {photos.length === 0 ? (
          <span className="avatar-text">{initial}</span>
        ) : (
          photos.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt={name}
              className={`avatar-photo${i === idx ? " is-active" : ""}`}
              style={imgStyle}
              aria-hidden={i === idx ? undefined : true}
            />
          ))
        )}
      </div>
      {hasMultiple && (
        <button
          type="button"
          className="avatar-next-btn"
          onClick={next}
          aria-label="Próxima foto"
          title="Próxima foto"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      )}
    </div>
  );
}
