export function Nav({ logo }: { logo: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 sm:px-8">
        <a
          href="#top"
          className="font-display text-lg font-bold uppercase tracking-tight text-ink"
        >
          {logo}<span className="text-accent">.</span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          <a
            href="#work"
            className="text-[13px] font-medium text-white/60 transition-colors hover:text-white"
          >
            Trabalhos
          </a>
          <a
            href="#about"
            className="text-[13px] font-medium text-white/60 transition-colors hover:text-white"
          >
            Sobre
          </a>
          <a
            href="#contact"
            className="text-[13px] font-medium text-white/60 transition-colors hover:text-white"
          >
            Contato
          </a>
        </nav>

        <a
          href="#contact"
          className="inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-[12px] font-medium text-black transition-colors hover:bg-accent"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          Disponível
        </a>
      </div>
    </header>
  );
}
