import { Icon, type IconName } from "@/components/public/Icons";
import type { ProfileContent } from "@/lib/validators";
import { FadeIn } from "@/components/transitions/FadeIn";

export function Contact({ profile }: { profile: ProfileContent }) {
  return (
    <section
      id="contact"
      className="border-t border-accent/15 bg-gradient-to-b from-bg to-brown/30 px-5 py-16 sm:px-10 sm:py-20"
    >
      <FadeIn className="mx-auto max-w-3xl text-center">
        <span className="mb-3 block text-[11px] uppercase tracking-[3px] text-accent">
          Contato
        </span>
        <h2 className="mb-4 font-display text-[clamp(36px,6vw,56px)] leading-[0.95] tracking-[2px] text-white">
          VAMOS CRIAR
          <br />
          <span className="text-accent">ALGO JUNTOS</span>
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-sm leading-[1.75] text-cream/70 sm:text-base">
          Tem um projeto em mente? Me chama por qualquer um dos canais abaixo.
          Respondo rápido.
        </p>

        <a
          href={`mailto:${profile.email}`}
          className="group mb-10 inline-flex items-center gap-3 rounded-sm border border-accent bg-accent px-7 py-3.5 text-xs font-medium uppercase tracking-[2.5px] text-bg transition-all hover:bg-transparent hover:text-accent"
        >
          <Icon name="email" className="h-4 w-4 fill-current" />
          {profile.email}
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
                aria-label={s.label}
                className="group flex items-center gap-2.5 rounded-sm border border-accent/30 bg-brown/40 px-5 py-3 text-sm tracking-[1px] text-cream transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-brown/70"
              >
                <Icon
                  name={s.icon as IconName}
                  className="h-4 w-4 shrink-0 fill-accent transition-colors group-hover:fill-accent"
                />
                <span className="truncate">{s.label}</span>
              </a>
            ))}
        </div>
      </FadeIn>
    </section>
  );
}
