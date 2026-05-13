import type { Video } from "@prisma/client";
import { VideoCard } from "@/components/public/VideoCard";
import { Reveal } from "@/components/transitions/Reveal";

export function VideosGrid({
  videos,
  isAdmin = false,
}: {
  videos: Video[];
  isAdmin?: boolean;
}) {
  const shorts = videos.filter((v) => v.aspectRatio === "9:16");
  const longs = videos.filter((v) => v.aspectRatio !== "9:16");

  return (
    <section id="work" className="work">
      {shorts.length > 0 && (
        <Reveal>
          <span className="section-label">TikTok / Shorts</span>
          <div className="short-section">
            {shorts.map((v) => (
              <VideoCard key={v.id} video={v} variant="short" isAdmin={isAdmin} />
            ))}
          </div>
        </Reveal>
      )}

      {longs.length > 0 && (
        <Reveal style={{ marginTop: "2rem" }}>
          <span className="section-label">Long Form</span>
          <div className="vsl-stack">
            {longs.map((v) => (
              <VideoCard key={v.id} video={v} variant="long" isAdmin={isAdmin} />
            ))}
          </div>
        </Reveal>
      )}

      {videos.length === 0 && (
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
