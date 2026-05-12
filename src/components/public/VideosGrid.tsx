import type { Video } from "@prisma/client";
import { VideoCard, type VideoCardData } from "@/components/public/VideoCard";

export function VideosGrid({ videos }: { videos: Video[] }) {
  if (!videos.length) {
    return (
      <section className="px-5 py-10 sm:px-10" id="work">
        <SectionHead />
        <div className="rounded border border-accent/15 bg-brown/40 px-6 py-12 text-center text-sm text-dim">
          Nenhum vídeo ainda. Adicione um pelo painel de admin (/admin).
        </div>
      </section>
    );
  }

  const cards: VideoCardData[] = videos.map((v, i) => ({
    id: v.id,
    title: v.title,
    provider: v.provider,
    videoId: v.videoId,
    aspectRatio: v.aspectRatio,
    tag: v.tag,
    index: i,
    variant: v.aspectRatio === "9:16" ? "short" : "long",
  }));

  return (
    <section className="px-5 py-10 sm:px-10" id="work">
      <SectionHead />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_auto]">
        {cards.map((card) => (
          <VideoCard key={card.id} video={card} />
        ))}
      </div>
    </section>
  );
}

function SectionHead() {
  return (
    <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <h2 className="font-display text-3xl tracking-[2px] text-white sm:text-[32px]">
        TRABALHOS
      </h2>
      <span className="text-[11px] uppercase tracking-[2px] text-accent">
        Short Form + Long Form
      </span>
    </div>
  );
}
