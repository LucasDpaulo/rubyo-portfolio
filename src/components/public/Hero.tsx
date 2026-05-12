"use client";

import { motion } from "framer-motion";
import { Icon, type IconName } from "@/components/public/Icons";
import type { HeroContent, ProfileContent } from "@/lib/validators";
import { useEffect, useState } from "react";

export function Hero({ hero, profile }: { hero: HeroContent; profile: ProfileContent }) {
  return (
    <section
      id="top"
      className="relative min-h-[88vh] overflow-hidden px-5 pt-10 pb-16 sm:px-8 sm:pt-16 sm:pb-24"
    >
      {/* grid lines on background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid grid-cols-2 opacity-[0.04] sm:grid-cols-4"
      >
        <div className="border-r border-white" />
        <div className="border-r border-white" />
        <div className="border-r border-white hidden sm:block" />
        <div className="border-r border-white hidden sm:block" />
      </div>

      <div className="relative mx-auto flex min-h-[78vh] max-w-[1700px] flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-[2px] text-white/50">
          <span className="timecode">
            [ {profile.name.toUpperCase()} · EDITOR · 2026 ]
          </span>
          <LiveClock />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="my-12"
        >
          <h1 className="font-display font-extrabold uppercase leading-[0.82] tracking-[-0.03em] text-white">
            <span className="block text-[clamp(60px,14vw,240px)]">
              {hero.titleLine1}
            </span>
            <span className="block text-[clamp(60px,14vw,240px)] italic text-accent">
              {hero.titleLine2}
            </span>
            <span className="block text-[clamp(60px,14vw,240px)]">
              {hero.titleLine3}
            </span>
          </h1>
        </motion.div>

        <div className="flex flex-col-reverse items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-md">
            <p className="text-base leading-relaxed text-white/70 sm:text-lg">
              {hero.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-accent px-6 text-sm font-medium text-black transition-transform hover:scale-[1.03]"
              >
                Ver trabalhos
                <svg width="14" viewBox="0 0 20 17" fill="currentColor">
                  <path d="M17.8246 7.4299H0V9.29145H17.8246L12.2047 16L13.6589 16.8982L19.4269 10.0128C20.191 9.10064 20.191 7.61838 19.4269 6.70622L13.809 0L12.3548 0.89587L17.8246 7.4299Z" />
                </svg>
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white hover:text-black"
              >
                <Icon name="email" className="h-3.5 w-3.5 fill-current" />
                Direto no email
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="timecode hidden text-right text-3xl font-medium text-white sm:block md:text-5xl">
              <FrameCounter />
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              {profile.socials.slice(0, 4).map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target={s.url.startsWith("http") ? "_blank" : undefined}
                  rel={s.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={s.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-accent hover:bg-accent hover:text-black"
                >
                  <Icon
                    name={s.icon as IconName}
                    className="h-3.5 w-3.5 fill-current"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
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
      const ss = String(d.getSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return <span className="timecode">--:--:--</span>;
  return <span className="timecode">SP · {time}</span>;
}

function FrameCounter() {
  const [t, setT] = useState("00:00:00:00");

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const ms = Date.now() - start;
      const totalFrames = Math.floor((ms / 1000) * 30);
      const ff = String(totalFrames % 30).padStart(2, "0");
      const ss = String(Math.floor(ms / 1000) % 60).padStart(2, "0");
      const mm = String(Math.floor(ms / 60000) % 60).padStart(2, "0");
      const hh = String(Math.floor(ms / 3600000)).padStart(2, "0");
      setT(`${hh}:${mm}:${ss}:${ff}`);
    }, 33);
    return () => clearInterval(id);
  }, []);

  return <>{t}</>;
}
