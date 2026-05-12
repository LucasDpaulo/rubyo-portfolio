import type { ProfileContent } from "@/lib/validators";

export function Footer({ profile }: { profile: ProfileContent }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 bg-bg px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-[1700px] flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="font-display text-2xl font-extrabold uppercase text-white">
            {profile.name}<span className="text-accent">.</span>
          </div>
          <span className="timecode text-[10px] text-white/30">
            EOF · v1.0
          </span>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/50">
          <a href="#work" className="hover:text-white">
            01 · Trabalhos
          </a>
          <a href="#about" className="hover:text-white">
            02 · Sobre
          </a>
          <a href="#contact" className="hover:text-white">
            03 · Contato
          </a>
          <a href="/admin" className="hover:text-white">
            Admin
          </a>
        </nav>

        <div className="text-[10px] uppercase tracking-[2px] text-white/30">
          © {year} · Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
}
