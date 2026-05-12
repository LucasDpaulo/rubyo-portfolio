import { Icon, type IconName } from "@/components/public/Icons";
import type { ProfileContent } from "@/lib/validators";
import { FadeIn } from "@/components/transitions/FadeIn";

export function Contact({ profile }: { profile: ProfileContent }) {
  return (
    <section
      id="contact"
      className="relative border-t border-white/5 px-6 py-20 sm:px-8 sm:py-24"
    >
      <FadeIn className="mx-auto max-w-[1280px]">
        <span className="eyebrow mb-8 block">Bin 03 · Contato</span>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <h2 className="font-display font-extrabold uppercase leading-[0.92] tracking-[-0.02em] text-white">
              <span className="block text-[clamp(40px,7vw,96px)]">PRÓXIMO</span>
              <span className="block text-[clamp(40px,7vw,96px)] italic text-accent">
                NÍVEL?
              </span>
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/65 sm:text-base">
              Conta a ideia que respondo no mesmo dia. Sem briefing template,
              sem form com 20 campos.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:col-span-5 md:items-end md:justify-end">
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex h-14 items-center gap-3 rounded-full bg-accent px-6 text-[14px] font-medium text-black transition-transform hover:scale-[1.02] sm:text-[15px]"
            >
              <Icon name="email" className="h-4 w-4 fill-current" />
              <span>{profile.email}</span>
              <svg width="14" viewBox="0 0 20 17" fill="currentColor" className="transition-transform group-hover:translate-x-0.5">
                <path d="M17.8246 7.4299H0V9.29145H17.8246L12.2047 16L13.6589 16.8982L19.4269 10.0128C20.191 9.10064 20.191 7.61838 19.4269 6.70622L13.809 0L12.3548 0.89587L17.8246 7.4299Z" />
              </svg>
            </a>

            <div className="flex flex-wrap gap-1.5 md:justify-end">
              {profile.socials
                .filter((s) => s.icon !== "email")
                .map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target={s.url.startsWith("http") ? "_blank" : undefined}
                    rel={s.url.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 px-3.5 text-[12px] text-white/70 transition-colors hover:border-white hover:bg-white hover:text-black"
                  >
                    <Icon
                      name={s.icon as IconName}
                      className="h-3 w-3 shrink-0 fill-current"
                    />
                    {s.label}
                  </a>
                ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
