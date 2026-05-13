"use client";

import { useEffect, useState, useCallback } from "react";
import type { ProfileContent } from "@/lib/validators";

const DISCORD_HANDLE = "rubyroberto_editor";

export function ContactModal({ profile }: { profile: ProfileContent }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-contact", onOpen);
    return () => window.removeEventListener("open-contact", onOpen);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const copyDiscord = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const temp = document.createElement("input");
    temp.value = DISCORD_HANDLE;
    document.body.appendChild(temp);
    temp.select();
    try {
      document.execCommand("copy");
      const toast = document.getElementById("toast");
      if (toast) {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(-50%) translateY(0)";
        setTimeout(() => {
          toast.style.opacity = "0";
          toast.style.transform = "translateX(-50%) translateY(60px)";
        }, 2500);
      }
    } catch {
      /* no-op */
    }
    document.body.removeChild(temp);
  }, []);

  const xUrl =
    profile.socials.find((s) => s.icon === "x")?.url || "https://x.com/rubyoroberto";

  return (
    <>
      <div
        className={`modal${open ? " active" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="modal-content">
          <span className="close-modal" onClick={close} role="button" aria-label="Fechar">
            ×
          </span>
          <h3 className="modal-title">LET&apos;S TALK</h3>

          <a href={xUrl} target="_blank" rel="noopener noreferrer" className="contact-btn">
            <svg viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter
          </a>

          <a href="#" onClick={copyDiscord} className="contact-btn">
            <svg viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.034.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
            </svg>
            Discord
          </a>

          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-btn"
          >
            <svg viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            Email
          </a>
        </div>
      </div>

      <div id="toast" className="toast">
        Discord copiado!
      </div>
    </>
  );
}
