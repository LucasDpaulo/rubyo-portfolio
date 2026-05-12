export function Nav({ logo }: { logo: string }) {
  return (
    <nav className="flex items-center justify-between border-b border-accent/10 px-5 py-4 sm:px-10">
      <div className="font-display text-lg tracking-[3px] text-accent sm:text-xl">
        {logo}
      </div>
      <ul className="flex list-none gap-5 sm:gap-7">
        <li>
          <a
            href="#work"
            className="text-[11px] uppercase tracking-[1.5px] text-dim transition-colors hover:text-accent sm:text-xs"
          >
            Trabalhos
          </a>
        </li>
        <li>
          <a
            href="#contact"
            className="text-[11px] uppercase tracking-[1.5px] text-dim transition-colors hover:text-accent sm:text-xs"
          >
            Contato
          </a>
        </li>
      </ul>
    </nav>
  );
}
