import type { ProfileContent } from "@/lib/validators";

export function Footer({ profile }: { profile: ProfileContent }) {
  const year = new Date().getFullYear();
  return (
    <footer className="px-5 py-10 sm:px-10 lg:px-[52px]">
      <div className="mx-auto flex max-w-[1700px] flex-col items-start justify-between gap-4 border-t border-ink/10 pt-8 sm:flex-row sm:items-center">
        <div className="font-display text-2xl font-extrabold text-ink">
          {profile.name}.
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink/60">
          <a href="#work" className="hover:text-ink">
            Trabalhos
          </a>
          <a href="#about" className="hover:text-ink">
            Sobre
          </a>
          <a href="#contact" className="hover:text-ink">
            Contato
          </a>
          <a href="/admin" className="hover:text-ink">
            Admin
          </a>
        </nav>

        <div className="text-[11px] uppercase tracking-[2px] text-ink/40">
          © {year} · Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
}
