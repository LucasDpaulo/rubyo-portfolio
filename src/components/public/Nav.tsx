"use client";

import { useCallback } from "react";
import { signOut } from "next-auth/react";

export function Nav({ logo, isAdmin = false }: { logo: string; isAdmin?: boolean }) {
  const onLogoClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (isAdmin) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      window.dispatchEvent(new CustomEvent("open-login"));
    },
    [isAdmin],
  );

  const openContact = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-contact"));
  }, []);

  const onLogout = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!confirm("Deseja sair?")) return;
    signOut({ redirect: false }).then(() => {
      window.location.reload();
    });
  }, []);

  return (
    <nav className="nav">
      <a
        href="#"
        onClick={onLogoClick}
        className="logo"
        title={isAdmin ? "Admin (logado)" : "Admin Login"}
      >
        {logo}
      </a>
      <ul className="nav-links">
        <li>
          <a href="#work">Portfolio</a>
        </li>
        <li>
          <a href="#" onClick={openContact}>
            Contact
          </a>
        </li>
        {isAdmin && (
          <li>
            <a href="#" onClick={onLogout} className="nav-logout">
              Sair
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}
