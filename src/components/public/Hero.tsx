"use client";

import { motion } from "framer-motion";
import { Icon, type IconName } from "@/components/public/Icons";
import type { HeroContent, ProfileContent } from "@/lib/validators";
import { useEffect, useState } from "react";

export function Hero({ hero, profile }: { hero: HeroContent; profile: ProfileContent }) {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pt-16 pb-20 sm:px-8 sm:pt-20 sm:pb-24"
    >
      <div className="relative mx-auto flex max-w-[1280px] flex-col gap-14">
        {/* metadata strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4 text-[11px] uppercase tracking-[2px] text-white/40">
          <span className="timecode">
            [ {profile.name} · Editor de vídeo · 2026 ]
          </span>
          <LiveClock />
        </div>

        {/* eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="eyebrow"
        >
          Portfolio · v1
        </motion.span>

        {/* headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-display font-extrabold uppercase leading-[0.88] tracking-[-0.02em] text-white"
        >
          <span className="block text-[clamp(48px,9vw,140px)]">
            {hero.titleLine1}
          </span>
          <span className="block text-[clamp(48px,9vw,140px)] italic text-accent">
            {hero.titleLine2}
          </span>
          <span className="block text-[clamp(48px,9vw,140px)]">
            {hero.titleLine3}
          </span>
        </motion.h1>

        {/* bottom row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 gap-8 border-t border-white/5 pt-8 md:grid-cols-2 md:items-end md:gap-12"
        >
          <p className="max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
            {hero.description}
          </p>

          <div className="flex flex-col items-start gap-5 md:items-end">
            <div className="flex flex-wrap gap-2.5">
              <a
                href="#work"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-[13px] font-medium text-black transition-transform hover:scale-[1.02]"
              >
                Ver trabalhos
                <svg width="12" viewBox="0 0 20 17" fill="currentColor">
                  <path d="M17.8246 7.4299H0V9.29145H17.8246L12.2047 16L13.6589 16.8982L19.4269 10.0128C20.191 9.10064 20.191 7.61838 19.4269 6.70622L13.809 0L12.3548 0.89587L17.8246 7.4299Z" />
                </svg>
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-[13px] font-medium text-white transition-colors hover:border-white hover:bg-white hover:text-black"
              >
                <Icon name="email" className="h-3.5 w-3.5 fill-current" />
                Email
              </a>
            </div>

            <div className="flex items-center gap-1.5">
              {profile.socials.slice(0, 4).map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target={s.url.startsWith("http") ? "_blank" : undefined}
                  rel={s.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={s.label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon
                    name={s.icon as IconName}
                    className="h-3 w-3 fill-current"
                  />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      setTime(`São Paulo · ${hh}:${mm}`);
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  if (!time) return <span className="timecode">São Paulo · --:--</span>;
  return <span className="timecode">{time}</span>;
}
