import type { Video } from "@prisma/client";
import { VideoCard, type VideoCardData } from "@/components/public/VideoCard";

export function VideosGrid({ videos }: { videos: Video[] }) {
  return (
    <section
      id="work"
      className="relative border-t border-white/5 px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-[1700px]">
        <SectionHead count={videos.length} />

        {!videos.length ? (
          <div className="rounded-2xl border border-line bg-surface px-6 py-20 text-center text-sm text-muted">
            Nenhum vídeo ainda. Adicione um pelo painel de admin (/admin).
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
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

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-8">
          <div className="flex items-center gap-3">
            <span className="marker" style={{ ["--marker-color" as string]: "#FF3D00" }}>
              + entregues
            </span>
            <span className="timecode text-xs uppercase text-white/40">
              {String(videos.length).padStart(2, "0")} REGISTROS
            </span>
          </div>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 text-sm font-medium text-white"
          >
            <svg width="16" viewBox="0 0 20 17" fill="currentColor">
              <path d="M17.8246 7.4299H0V9.29145H17.8246L12.2047 16L13.6589 16.8982L19.4269 10.0128C20.191 9.10064 20.191 7.61838 19.4269 6.70622L13.809 0L12.3548 0.89587L17.8246 7.4299Z" />
            </svg>
            <span className="border-b border-white/40 pb-0.5 group-hover:border-accent group-hover:text-accent">
              Quero um trabalho assim
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ count }: { count: number }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div>
        <span className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[3px] text-white/50">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Bin 01 · Trabalhos
        </span>
        <h2 className="font-display font-extrabold uppercase leading-[0.88] tracking-[-0.03em] text-white">
          <span className="block text-[clamp(44px,9vw,140px)]">SHORT</span>
          <span className="block text-[clamp(44px,9vw,140px)] italic text-accent">
            + LONG FORM
          </span>
        </h2>
      </div>
      <p className="max-w-sm text-sm leading-relaxed text-white/60">
        Cortei {count} {count === 1 ? "projeto" : "projetos"} entre YouTube,
        Reels e TikTok. Clica em qualquer um pra assistir aqui mesmo —{" "}
        <span className="text-white">sem sair da página</span>.
      </p>
    </div>
  );
}
