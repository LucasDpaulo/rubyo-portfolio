import { Icon, type IconName } from "@/components/public/Icons";
import type { ProfileContent } from "@/lib/validators";
import { FadeIn } from "@/components/transitions/FadeIn";

export function Contact({ profile }: { profile: ProfileContent }) {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-accent px-5 py-24 text-black sm:px-8 sm:py-32"
    >
      {/* subtle vertical lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid grid-cols-2 opacity-[0.08] sm:grid-cols-4"
      >
        <div className="border-r border-black" />
        <div className="border-r border-black" />
        <div className="border-r border-black hidden sm:block" />
        <div className="border-r border-black hidden sm:block" />
      </div>

      <FadeIn className="relative mx-auto max-w-[1700px]">
        <div className="mb-8 flex items-center gap-2 text-[11px] uppercase tracking-[3px] text-black/70">
          <span className="h-1.5 w-1.5 rounded-full bg-black" />
          Bin 03 · Contato
        </div>

        <h2 className="mb-10 font-display font-extrabold uppercase leading-[0.82] tracking-[-0.03em] text-black">
          <span className="block text-[clamp(56px,13vw,220px)]">PRÓXIMO</span>
          <span className="block text-[clamp(56px,13vw,220px)] italic">
            NÍVEL?
          </span>
        </h2>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-base leading-relaxed text-black/80 sm:text-lg">
            Conta a ideia que respondo no mesmo dia. Sem briefing template, sem
            forms intermináveis. Email funciona melhor.
          </p>

          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex h-14 items-center gap-3 self-start rounded-full bg-black px-7 text-base font-medium text-accent transition-transform hover:scale-[1.03] sm:self-end"
          >
            <Icon name="email" className="h-4 w-4 fill-current" />
            <span className="border-b border-accent/50 pb-0.5">
              {profile.email}
            </span>
            <svg width="16" viewBox="0 0 20 17" fill="currentColor">
              <path d="M17.8246 7.4299H0V9.29145H17.8246L12.2047 16L13.6589 16.8982L19.4269 10.0128C20.191 9.10064 20.191 7.61838 19.4269 6.70622L13.809 0L12.3548 0.89587L17.8246 7.4299Z" />
            </svg>
          </a>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-3 border-t border-black/20 pt-6">
          <span className="text-xs uppercase tracking-[2px] text-black/60">
            Ou nas redes:
          </span>
          {profile.socials
            .filter((s) => s.icon !== "email")
            .map((s, i) => (
              <a
                key={i}
                href={s.url}
                target={s.url.startsWith("http") ? "_blank" : undefined}
                rel={s.url.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group inline-flex h-10 items-center gap-2 rounded-full border border-black/30 px-4 text-sm text-black transition-all hover:-translate-y-0.5 hover:border-black hover:bg-black hover:text-accent"
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
