import { Icon, type IconName } from "@/components/public/Icons";
import type { HeroContent, ProfileContent } from "@/lib/validators";
import { FadeIn } from "@/components/transitions/FadeIn";

export function Hero({ hero, profile }: { hero: HeroContent; profile: ProfileContent }) {
  return (
    <section
      id="top"
      className="relative px-5 pt-16 pb-24 sm:px-10 sm:pt-24 sm:pb-32 lg:px-[52px] lg:pb-40"
    >
      <FadeIn className="mx-auto max-w-[1700px] text-center">
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3 text-xs font-medium uppercase tracking-[2px] text-ink/60">
          <span>Portfólio</span>
          <span className="h-1 w-1 rounded-full bg-ink/30" />
          <span>{profile.role}</span>
          <span className="h-1 w-1 rounded-full bg-ink/30" />
          <span>Disponível p/ projetos</span>
        </div>

        <h1 className="mb-8 font-display font-extrabold leading-[0.85] tracking-[-0.02em] text-ink">
          <span className="block text-[clamp(56px,12vw,200px)]">
            {hero.titleLine1}
          </span>
          <span className="block text-[clamp(56px,12vw,200px)] text-accent">
            {hero.titleLine2}
          </span>
          <span className="block text-[clamp(56px,12vw,200px)]">
            {hero.titleLine3}
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
          {hero.description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#work"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-sm font-medium text-bg transition-colors hover:bg-accent"
          >
            Ver trabalhos
            <svg width="14" viewBox="0 0 20 17" fill="currentColor">
              <path d="M17.8246 7.4299H0V9.29145H17.8246L12.2047 16L13.6589 16.8982L19.4269 10.0128C20.191 9.10064 20.191 7.61838 19.4269 6.70622L13.809 0L12.3548 0.89587L17.8246 7.4299Z" />
            </svg>
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-ink/20 px-7 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg"
          >
            <Icon name="email" className="h-3.5 w-3.5 fill-current" />
            Falar comigo
          </a>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-[2px] text-ink/50">
          <span className="font-display text-2xl font-extrabold text-ink">
            {profile.name}.
          </span>
          {profile.socials.slice(0, 4).map((s, i) => (
            <a
              key={i}
              href={s.url}
              target={s.url.startsWith("http") ? "_blank" : undefined}
              rel={s.url.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-1.5 transition-colors hover:text-ink"
            >
              <Icon
                name={s.icon as IconName}
                className="h-3 w-3 fill-current opacity-70 group-hover:opacity-100"
              />
              <span className="hidden sm:inline">{s.label}</span>
            </a>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
