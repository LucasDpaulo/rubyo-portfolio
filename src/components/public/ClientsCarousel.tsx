"use client";

import { useEffect, useRef, useState } from "react";
import type { Video } from "@prisma/client";
import type { ClientReview, SocialLink } from "@/lib/validators";
import { ClientAvatar, VerifiedBadge } from "@/components/public/ClientAvatar";
import { ClientChannelModal } from "@/components/public/ClientChannelModal";

const STATIC_MAX = 720; // banner de 1 cliente (preenche a largura)
const SCROLL_CARD = 270; // tamanho fixo dos cards no carrossel (2+)
const GAP = 16;
const SECONDS_PER_CARD = 4;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Sizing = {
  avatar: number;
  nameRem: number;
  subsRem: number;
  padV: number;
  padH: number;
  gap: number;
};

function sizingFor(cardW: number): Sizing {
  const t = Math.max(0, Math.min(1, (cardW - SCROLL_CARD) / (STATIC_MAX - SCROLL_CARD)));
  return {
    avatar: Math.round(lerp(58, 128, t)),
    nameRem: +lerp(1.1, 2.3, t).toFixed(2),
    subsRem: +lerp(0.82, 1.05, t).toFixed(2),
    padV: Math.round(lerp(16, 30, t)),
    padH: Math.round(lerp(18, 42, t)),
    gap: Math.round(lerp(14, 28, t)),
  };
}

function Card({
  client,
  width,
  sizing,
  onOpen,
  focusable = true,
}: {
  client: ClientReview;
  width: number;
  sizing: Sizing;
  onOpen: () => void;
  focusable?: boolean;
}) {
  const name = client.name.trim() || "Canal";
  const subs = client.subscribers?.trim();
  return (
    <button
      type="button"
      className="client-chip"
      onClick={onOpen}
      tabIndex={focusable ? undefined : -1}
      aria-hidden={focusable ? undefined : true}
      title={`Ver o canal ${name}`}
      style={{ width, padding: `${sizing.padV}px ${sizing.padH}px`, gap: sizing.gap }}
    >
      <ClientAvatar name={name} logoUrl={client.logoUrl} adjustments={client.logoAdjustments} size={sizing.avatar} />
      <span className="client-chip-text">
        <span className="client-chip-name" style={{ fontSize: `${sizing.nameRem}rem` }}>
          {name}
          {client.verified && <VerifiedBadge />}
        </span>
        {subs && (
          <span className="client-chip-subs" style={{ fontSize: `${sizing.subsRem}rem` }}>
            {subs} inscritos
          </span>
        )}
      </span>
    </button>
  );
}

export function ClientsCarousel({
  clients,
  videos,
  socials,
  email,
}: {
  clients: ClientReview[];
  videos: Video[];
  socials: SocialLink[];
  email: string;
}) {
  const [active, setActive] = useState<ClientReview | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(960);
  const n = clients.length;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setContainerW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (n === 0) return null;

  // 1 cliente: banner estático que preenche a largura. 2+: carrossel rolando.
  const scrolling = n >= 2;
  const cardW = scrolling ? SCROLL_CARD : Math.min(containerW, STATIC_MAX);
  const sizing = sizingFor(cardW);
  // repete a lista até a faixa preencher a largura (sem buracos).
  const repeats = scrolling ? Math.max(1, Math.ceil(containerW / (n * (SCROLL_CARD + GAP)))) : 1;
  const duration = Math.max(18, n * repeats * SECONDS_PER_CARD);

  const buildSet = (focusable: boolean) => {
    const out = [];
    for (let r = 0; r < repeats; r++) {
      for (let i = 0; i < n; i++) {
        const c = clients[i];
        out.push(
          <Card
            key={`${focusable ? "a" : "b"}-${r}-${i}`}
            client={c}
            width={cardW}
            sizing={sizing}
            onOpen={() => setActive(c)}
            focusable={focusable}
          />,
        );
      }
    }
    return out;
  };

  return (
    <>
      <div
        className={`clients-marquee ${scrolling ? "is-scrolling" : "is-static"}`}
        ref={containerRef}
        aria-label="Clientes"
      >
        <div className="clients-track" style={scrolling ? { animationDuration: `${duration}s` } : undefined}>
          {buildSet(true)}
          {scrolling && buildSet(false)}
        </div>
      </div>

      {active && (
        <ClientChannelModal
          client={active}
          videos={videos}
          socials={socials}
          email={email}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}
