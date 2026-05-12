import type { Video } from "@prisma/client";
import { VideoCard, type VideoCardData } from "@/components/public/VideoCard";

export function VideosGrid({ videos }: { videos: Video[] }) {
  return (
    <section
      id="work"
      className="relative border-t border-white/5 px-6 py-20 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <SectionHead count={videos.length} />

        {!videos.length ? (
          <div className="rounded-xl border border-line bg-surface px-6 py-16 text-center text-sm text-muted">
            Nenhum vídeo ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v, i) => {
              const card: VideoCardData = {
                id: v.id,
                title: v.title,
                provider: v.provider,
                videoId: v.videoId,
                aspectRatio: v.aspectRatio,
                tag: v.tag,
                index: i,
                variant: v.aspectRatio === "9:16" ? "short" : "long",
              };
              return <VideoCard key={card.id} video={card} />;
            })}
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6">
          <span className="timecode text-[11px] uppercase tracking-[2px] text-white/40">
            {String(videos.length).padStart(2, "0")} {videos.length === 1 ? "registro" : "registros"}
          </span>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 text-[13px] font-medium text-white/80 transition-colors hover:text-white"
          >
            Quero um trabalho assim
            <svg width="14" viewBox="0 0 20 17" fill="currentColor" className="transition-transform group-hover:translate-x-0.5">
              <path d="M17.8246 7.4299H0V9.29145H17.8246L12.2047 16L13.6589 16.8982L19.4269 10.0128C20.191 9.10064 20.191 7.61838 19.4269 6.70622L13.809 0L12.3548 0.89587L17.8246 7.4299Z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ count }: { count: number }) {
  return (
    <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-12">
      <div className="md:col-span-7">
        <span className="eyebrow mb-3">Bin 01 · Trabalhos</span>
        <h2 className="font-display font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-white">
          <span className="block text-[clamp(34px,5.5vw,72px)]">SHORT</span>
          <span className="block text-[clamp(34px,5.5vw,72px)] italic text-accent">
            + LONG FORM
          </span>
        </h2>
      </div>
      <p className="text-sm leading-relaxed text-white/60 md:col-span-5 md:self-end md:text-base">
        {count} {count === 1 ? "projeto" : "projetos"} entre YouTube, Reels e TikTok.
        Clica em qualquer um para assistir aqui mesmo.
      </p>
    </div>
  );
}
