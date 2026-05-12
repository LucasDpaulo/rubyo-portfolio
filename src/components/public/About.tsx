import { FadeIn } from "@/components/transitions/FadeIn";
import type { ProfileContent } from "@/lib/validators";

const FACTS = [
  { label: "Foco", value: "YouTube · Reels · TikTok", color: "#FF4422" },
  { label: "Formato", value: "Short + Long form", color: "#3DDC84" },
  { label: "Software", value: "Premiere · DaVinci", color: "#FFD500" },
  { label: "Resposta", value: "Em até 24h", color: "#49B3FC" },
];

export function About({ profile }: { profile: ProfileContent }) {
  return (
    <section
      id="about"
      className="relative border-t border-white/5 px-6 py-20 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <span className="eyebrow mb-8 block">Bin 02 · Sobre</span>

        <FadeIn className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <p className="font-display text-3xl font-extrabold uppercase tracking-[-0.01em] text-white sm:text-4xl">
              {profile.name}<span className="text-accent">.</span>
            </p>
            <p className="mt-2 text-xs uppercase tracking-[2px] text-white/50">
              {profile.role}
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {FACTS.map((f) => (
                <span
                  key={f.label}
                  className="marker"
                  style={{ ["--marker-color" as string]: f.color }}
                >
                  {f.label}
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-8">
            <p className="font-display text-2xl font-medium leading-snug text-white sm:text-3xl md:text-4xl md:leading-[1.15]">
              Eu corto pra criadores que querem{" "}
              <span className="italic text-accent">ritmo e intenção</span> —
              não só limpeza.
            </p>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/65 sm:text-base">
              Cuido do projeto do começo ao fim. Recebo o material bruto, mapeio
              a narrativa, escolho o ritmo e devolvo o vídeo pronto pra publicar.
              Faço o que aparece no feed — não o que tava no template.
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/5 pt-8 sm:grid-cols-4">
              {FACTS.map((f) => (
                <div key={f.label} className="border-l-2 pl-3" style={{ borderColor: f.color }}>
                  <dt className="mb-1 text-[10px] uppercase tracking-[1.8px] text-white/40">
                    {f.label}
                  </dt>
                  <dd className="text-sm font-medium leading-tight text-white">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
