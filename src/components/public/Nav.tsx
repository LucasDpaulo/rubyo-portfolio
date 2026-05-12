export function Nav({ logo }: { logo: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-[1700px] items-center justify-between px-5 py-4 sm:px-8">
        <a
          href="#top"
          className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink"
        >
          {logo}<span className="text-accent">.</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#work"
            className="text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            01 · Trabalhos
          </a>
          <a
            href="#about"
            className="text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            02 · Sobre
          </a>
          <a
            href="#contact"
            className="text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            03 · Contato
          </a>
        </nav>

        <a
          href="#contact"
          className="group inline-flex h-10 items-center gap-2 rounded-full bg-accent px-5 text-xs font-medium uppercase tracking-[1.5px] text-black transition-transform hover:scale-[1.03]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-black" />
          Disponível
        </a>
      </div>
    </header>
  );
}
