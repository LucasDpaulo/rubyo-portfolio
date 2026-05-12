import { FadeIn } from "@/components/transitions/FadeIn";
import type { ProfileContent } from "@/lib/validators";

const MARKERS = [
  { label: "Foco", value: "YouTube · Reels · TikTok", color: "#FF3D00" },
  { label: "Formato", value: "Short + Long form", color: "#00FF66" },
  { label: "Software", value: "Premiere · DaVinci", color: "#FFD500" },
  { label: "Resposta", value: "Em até 24h", color: "#49B3FC" },
];

export function About({ profile }: { profile: ProfileContent }) {
  return (
    <section
      id="about"
      className="relative border-t border-white/5 px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-[1700px]">
        <div className="mb-10 flex items-center gap-2 text-[11px] uppercase tracking-[3px] text-white/50">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Bin 02 · Sobre
        </div>

        <FadeIn className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-display text-5xl font-extrabold uppercase text-white">
              {profile.name}<span className="text-accent">.</span>
            </p>
            <p className="mt-2 text-xs uppercase tracking-[2px] text-white/60">
              {profile.role}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {MARKERS.map((m) => (
                <span
                  key={m.label}
                  className="marker"
                  style={{ ["--marker-color" as string]: m.color }}
                >
                  {m.label}
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-8">
            <p className="text-2xl font-light leading-snug text-white sm:text-3xl md:text-4xl">
              Eu corto pra criadores que querem{" "}
              <span className="font-medium text-accent italic">
                ritmo, intenção
              </span>{" "}
              e identidade — não só limpeza.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Cuido do projeto do começo ao fim. Recebo o material bruto, mapeio
              a narrativa, escolho o ritmo e devolvo o vídeo pronto pra publicar.
              Faço o que aparece no feed, não o que tava no template do free.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
              {MARKERS.map((m) => (
                <div key={m.label} className="border-l-2 pl-4" style={{ borderColor: m.color }}>
                  <span className="mb-1 block text-[10px] uppercase tracking-[2px] text-white/50">
                    {m.label}
                  </span>
                  <span className="text-sm font-medium leading-tight text-white">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
