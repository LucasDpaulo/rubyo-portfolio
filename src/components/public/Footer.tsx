import type { ProfileContent } from "@/lib/validators";

export function Footer({ profile }: { profile: ProfileContent }) {
  const year = new Date().getFullYear();
  return (
    <footer className="flex flex-col items-center justify-between gap-3 border-t border-accent/10 px-5 py-6 sm:flex-row sm:px-10">
      <div className="font-display text-sm tracking-[3px] text-accent">
        {profile.name}
      </div>
      <div className="text-[11px] tracking-[1.5px] text-cream/40">
        © {year} · Todos os direitos reservados
      </div>
    </footer>
  );
}
