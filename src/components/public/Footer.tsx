import type { ProfileContent } from "@/lib/validators";

export function Footer({ profile }: { profile: ProfileContent }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 px-6 py-8 sm:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="font-display text-base font-bold uppercase text-white">
            {profile.name}<span className="text-accent">.</span>
          </span>
          <span className="timecode text-[10px] text-white/30">EOF · v1.0</span>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-white/50">
          <a href="#work" className="hover:text-white">Trabalhos</a>
          <a href="#about" className="hover:text-white">Sobre</a>
          <a href="#contact" className="hover:text-white">Contato</a>
          <a href="/admin" className="hover:text-white">Admin</a>
        </nav>

        <div className="text-[10px] uppercase tracking-[2px] text-white/30">
          © {year} · Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
}
