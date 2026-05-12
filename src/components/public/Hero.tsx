import { Icon, type IconName } from "@/components/public/Icons";
import type { HeroContent, ProfileContent } from "@/lib/validators";
import { FadeIn } from "@/components/transitions/FadeIn";

export function Hero({ hero, profile }: { hero: HeroContent; profile: ProfileContent }) {
  return (
    <section className="grid grid-cols-1 gap-8 border-b border-accent/10 px-5 py-10 sm:px-10 md:grid-cols-[200px_1fr] md:items-center md:gap-10 md:py-12">
      <FadeIn className="flex flex-col items-center text-center">
        <div className="mb-3 flex h-[90px] w-[90px] items-center justify-center rounded-full border-2 border-accent bg-brown2 text-[32px] text-accent">
          ✦
        </div>
        <div className="mb-1 font-display text-xl tracking-[2px] text-white">
          {profile.name}
        </div>
        <div className="mb-4 text-[11px] uppercase tracking-[2px] text-accent">
          {profile.role}
        </div>

        <div className="flex w-full max-w-[220px] flex-col gap-1.5">
          {profile.socials.map((s, i) => (
            <a
              key={i}
              href={s.url}
              target={s.url.startsWith("http") ? "_blank" : undefined}
              rel={s.url.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex items-center justify-center gap-2 rounded-sm border border-accent/20 px-3 py-1.5 text-[11px] tracking-[1px] text-dim transition-colors hover:border-accent hover:text-accent md:justify-start"
            >
              <Icon
                name={s.icon as IconName}
                className="h-[13px] w-[13px] shrink-0 fill-current"
              />
              <span className="truncate">{s.label}</span>
            </a>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <h1 className="mb-4 font-display text-[clamp(40px,8vw,80px)] leading-[0.92] tracking-[2px] text-white">
          {hero.titleLine1}
          <br />
          <span className="text-accent">{hero.titleLine2}</span>
          <br />
          {hero.titleLine3}
        </h1>
        <p className="max-w-[480px] text-sm leading-[1.75] text-dim">
          {hero.description}
        </p>
      </FadeIn>
    </section>
  );
}
