"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { ReactNode } from "react";

const TABS = [
  { href: "/admin/videos", label: "Vídeos" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/profile", label: "Perfil" },
  { href: "/admin/conta", label: "Conta" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-accent/10 px-10 py-4">
        <Link
          href="/admin"
          className="font-display text-xl tracking-[3px] text-accent"
        >
          ADMIN
        </Link>
        <nav className="flex gap-2">
          {TABS.map((tab) => {
            const active = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-sm border px-3 py-1.5 text-[11px] uppercase tracking-[1.5px] transition-colors ${
                  active
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-accent/15 text-dim hover:border-accent hover:text-accent"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="text-[11px] uppercase tracking-[1.5px] text-dim hover:text-accent"
          >
            Ver site ↗
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="text-[11px] uppercase tracking-[1.5px] text-dim hover:text-accent"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="px-10 py-8">{children}</main>
    </div>
  );
}
