import { Icon, type IconName } from "@/components/public/Icons";
import type { ProfileContent } from "@/lib/validators";
import { FadeIn } from "@/components/transitions/FadeIn";

export function Contact({ profile }: { profile: ProfileContent }) {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-ink px-5 py-24 text-bg sm:px-10 sm:py-32 lg:px-[52px] lg:py-40"
    >
      <FadeIn className="mx-auto max-w-[1700px] text-center">
        <span className="mb-6 inline-block text-xs uppercase tracking-[3px] text-bg/60">
          Contato
        </span>
        <h2 className="mb-8 font-display font-extrabold leading-[0.85] tracking-[-0.02em]">
          <span className="block text-[clamp(48px,10vw,160px)]">
            VAMOS CRIAR
          </span>
          <span className="block text-[clamp(48px,10vw,160px)] text-accent">
            ALGO JUNTOS
          </span>
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-base leading-relaxed text-bg/70 sm:text-lg">
          Tem um projeto em mente? Me conta a ideia que respondo no mesmo dia.
        </p>

        <a
          href={`mailto:${profile.email}`}
          className="group mb-16 inline-flex h-14 items-center gap-3 rounded-full bg-bg px-8 text-sm font-medium text-ink transition-colors hover:bg-accent hover:text-bg sm:text-base"
        >
          <Icon name="email" className="h-4 w-4 fill-current" />
          {profile.email}
          <svg width="16" viewBox="0 0 20 17" fill="currentColor">
            <path d="M17.8246 7.4299H0V9.29145H17.8246L12.2047 16L13.6589 16.8982L19.4269 10.0128C20.191 9.10064 20.191 7.61838 19.4269 6.70622L13.809 0L12.3548 0.89587L17.8246 7.4299Z" />
          </svg>
        </a>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {profile.socials
            .filter((s) => s.icon !== "email")
            .map((s, i) => (
              <a
                key={i}
                href={s.url}
                target={s.url.startsWith("http") ? "_blank" : undefined}
                rel={s.url.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group inline-flex h-11 items-center gap-2 rounded-full border border-bg/30 px-5 text-sm text-bg transition-all hover:-translate-y-0.5 hover:border-bg hover:bg-bg hover:text-ink"
              >
                <Icon
                  name={s.icon as IconName}
                  className="h-3.5 w-3.5 shrink-0 fill-current"
                />
                {s.label}
              </a>
            ))}
        </div>
      </FadeIn>
    </section>
  );
}
