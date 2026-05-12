export function Nav({ logo }: { logo: string }) {
  return (
    <header className="sticky top-0 z-30 bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/80">
      <div className="mx-auto flex items-center justify-between px-5 py-4 sm:px-10 lg:px-[52px]">
        <a
          href="#top"
          className="font-display text-2xl font-extrabold tracking-tight text-ink"
        >
          {logo}.
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#work"
            className="text-sm font-medium text-ink/70 transition-colors hover:text-ink"
          >
            Trabalhos
          </a>
          <a
            href="#about"
            className="text-sm font-medium text-ink/70 transition-colors hover:text-ink"
          >
            Sobre
          </a>
          <a
            href="#contact"
            className="text-sm font-medium text-ink/70 transition-colors hover:text-ink"
          >
            Contato
          </a>
        </nav>

        <a
          href="#contact"
          className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-xs font-medium text-bg transition-colors hover:bg-accent"
        >
          Contratar
        </a>
      </div>
    </header>
  );
}
