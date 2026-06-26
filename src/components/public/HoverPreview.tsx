"use client";

import { useEffect, useRef, useState } from "react";

const PREVIEW_SECONDS = 10;
const END_FADE_MS = 900;

type YTPlayer = {
  mute: () => void;
  unMute: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getVolume: () => number;
  setVolume: (v: number) => void;
  setPlaybackQuality: (q: string) => void;
  getIframe: () => HTMLIFrameElement;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (el: Element, opts: Record<string, unknown>) => YTPlayer;
};

function getYT(): YTNamespace | undefined {
  return (window as unknown as { YT?: YTNamespace }).YT;
}

let apiPromise: Promise<void> | null = null;
function loadApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (getYT()?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<void>((resolve) => {
    const w = window as unknown as { onYouTubeIframeAPIReady?: () => void };
    const prev = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiPromise;
}

// Preview de hover: toca os primeiros 10s em HD (sem UI do YouTube). Ao chegar nos
// 10s, some o som e escurece de volta pra thumbnail (não fica em loop).
export function HoverPreview({
  videoId,
  muted,
  aspectRatio,
  onEnd,
}: {
  videoId: string;
  muted: boolean;
  aspectRatio?: string;
  onEnd?: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endingRef = useRef(false);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;
    endingRef.current = false;

    function beginEnd(p: YTPlayer) {
      if (endingRef.current || cancelled) return;
      endingRef.current = true;
      setEnding(true); // CSS escurece (opacity → 0, volta pra thumb)
      let vol = 100;
      try {
        vol = p.getVolume();
      } catch {
        /* noop */
      }
      let step = 0;
      const steps = 9;
      const fade = setInterval(() => {
        step++;
        try {
          p.setVolume(Math.max(0, Math.round(vol * (1 - step / steps))));
        } catch {
          /* noop */
        }
        if (step >= steps) clearInterval(fade);
      }, END_FADE_MS / 9);
      setTimeout(() => {
        if (!cancelled) onEndRef.current?.();
      }, END_FADE_MS);
    }

    loadApi().then(() => {
      const YT = getYT();
      if (cancelled || !YT || !host) return;
      // tamanho intrínseco "HD" → faz o YouTube servir alta qualidade mesmo num card pequeno
      const isShort = aspectRatio === "9:16";
      const iw = isShort ? 720 : 1280;
      const ih = isShort ? 1280 : 720;

      // cria o iframe manualmente com allow="autoplay" ANTES de carregar → o autoplay
      // mudo funciona já no load (sem o botão de pausa "||"). Tamanho HD + escala
      // pra cobrir o card (sem listra preta) e cortar a UI do YouTube.
      const iframe = document.createElement("iframe");
      const params = new URLSearchParams({
        enablejsapi: "1",
        autoplay: "1",
        mute: "1",
        controls: "0",
        rel: "0",
        modestbranding: "1",
        playsinline: "1",
        fs: "0",
        disablekb: "1",
        iv_load_policy: "3",
        start: "0",
        origin: window.location.origin,
      });
      iframe.src = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
      iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
      iframe.setAttribute("frameborder", "0");
      iframe.title = "preview";
      iframe.style.position = "absolute";
      iframe.style.top = "50%";
      iframe.style.left = "50%";
      iframe.style.width = iw + "px";
      iframe.style.height = ih + "px";
      iframe.style.border = "0";
      const rect = host.getBoundingClientRect();
      const hw = rect.width || iw;
      const hh = rect.height || ih;
      const CROP = 1.42;
      const scale = Math.max(hw / iw, hh / ih) * CROP;
      iframe.style.transform = `translate(-50%, -50%) scale(${scale})`;
      host.appendChild(iframe);

      playerRef.current = new YT.Player(iframe, {
        events: {
          onReady: (e: { target: YTPlayer }) => {
            const p = e.target;
            try {
              p.setPlaybackQuality("hd1080");
            } catch {
              /* noop */
            }
            if (mutedRef.current) p.mute();
            else p.unMute();
            p.playVideo();
            loopRef.current = setInterval(() => {
              try {
                if (p.getCurrentTime() >= PREVIEW_SECONDS) beginEnd(p);
              } catch {
                /* noop */
              }
            }, 250);
          },
          onStateChange: (e: { data: number; target: YTPlayer }) => {
            // -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
            if (e.data === 0) {
              beginEnd(e.target); // vídeo acabou (menor que 10s)
              return;
            }
            if (!endingRef.current && (e.data === -1 || e.data === 2 || e.data === 5)) {
              try {
                e.target.playVideo(); // força tocar caso autoplay seja barrado
              } catch {
                /* noop */
              }
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (loopRef.current) clearInterval(loopRef.current);
      try {
        playerRef.current?.destroy();
      } catch {
        /* noop */
      }
      playerRef.current = null;
      if (host) host.innerHTML = "";
    };
  }, [videoId, aspectRatio]);

  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    try {
      if (muted) p.mute();
      else p.unMute();
    } catch {
      /* noop */
    }
  }, [muted]);

  return <div ref={hostRef} className={`card-preview${ending ? " is-ending" : ""}`} />;
}
