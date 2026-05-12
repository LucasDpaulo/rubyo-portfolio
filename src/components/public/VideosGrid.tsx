import type { Video } from "@prisma/client";
import { VideoCard, type VideoCardData } from "@/components/public/VideoCard";

export function VideosGrid({ videos }: { videos: Video[] }) {
  return (
    <section
      id="work"
      className="px-5 py-16 sm:px-10 sm:py-24 lg:px-[52px] lg:py-32"
    >
      <div className="mx-auto max-w-[1700px]">
        <SectionHead />

        {!videos.length ? (
          <div className="rounded-2xl border border-line bg-surface px-6 py-20 text-center text-sm text-muted">
            Nenhum vídeo ainda. Adicione um pelo painel de admin (/admin).
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-8">
          <span className="text-sm text-ink/60">
            {videos.length} {videos.length === 1 ? "projeto" : "projetos"} no portfólio
          </span>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 text-sm font-medium text-ink"
          >
            <svg width="16" viewBox="0 0 20 17" fill="currentColor">
              <path d="M17.8246 7.4299H0V9.29145H17.8246L12.2047 16L13.6589 16.8982L19.4269 10.0128C20.191 9.10064 20.191 7.61838 19.4269 6.70622L13.809 0L12.3548 0.89587L17.8246 7.4299Z" />
            </svg>
            <span className="link-underlined">Quero um trabalho assim</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function SectionHead() {
  return (
    <div className="mb-12 text-center">
      <span className="mb-4 inline-block text-xs uppercase tracking-[3px] text-ink/60">
        Trabalhos
      </span>
      <h2 className="font-display font-extrabold leading-[0.9] tracking-[-0.02em] text-ink">
        <span className="block text-[clamp(40px,8vw,120px)]">SHORT FORM</span>
        <span className="block text-[clamp(40px,8vw,120px)] text-accent">
          + LONG FORM
        </span>
      </h2>
    </div>
  );
}
