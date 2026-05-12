import { FadeIn } from "@/components/transitions/FadeIn";
import type { ProfileContent } from "@/lib/validators";

export function About({ profile }: { profile: ProfileContent }) {
  return (
    <section
      id="about"
      className="border-t border-ink/10 px-5 py-20 sm:px-10 sm:py-28 lg:px-[52px]"
    >
      <FadeIn className="mx-auto grid max-w-[1700px] grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-4 lg:col-span-3">
          <span className="mb-3 block text-xs uppercase tracking-[3px] text-ink/60">
            Sobre
          </span>
          <p className="font-display text-4xl leading-none text-ink">
            {profile.name}.
          </p>
          <p className="mt-1 text-sm uppercase tracking-[2px] text-accent">
            {profile.role}
          </p>
        </div>

        <div className="md:col-span-8 lg:col-span-7 lg:col-start-5">
          <p className="text-2xl font-light leading-snug text-ink sm:text-3xl">
            Edito vídeo para criadores de conteúdo que querem{" "}
            <span className="font-medium text-accent">
              ritmo, intenção e identidade
            </span>{" "}
            — não só corte. Cuido do projeto do começo ao fim: do roteiro
            visual à colorização final.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            <Stat label="Foco" value="YouTube · Reels · TikTok" />
            <Stat label="Formato" value="Short + Long form" />
            <Stat label="Software" value="Premiere · DaVinci" />
            <Stat label="Resposta" value="Em até 24h" />
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="mb-1 block text-[11px] uppercase tracking-[2px] text-ink/50">
        {label}
      </span>
      <span className="text-sm font-medium leading-tight text-ink">
        {value}
      </span>
    </div>
  );
}
