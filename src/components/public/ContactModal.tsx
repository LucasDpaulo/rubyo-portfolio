"use client";

import { useEffect, useState, useCallback } from "react";
import { Icon, type IconName } from "@/components/public/Icons";
import type { ProfileContent, SocialLink } from "@/lib/validators";
import { trackClick } from "@/lib/track";

const LABELS: Record<IconName, string> = {
  x: "Twitter",
  discord: "Discord",
  email: "Email",
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  play: "",
};

function resolveHref(s: SocialLink, email: string): string {
  const url = (s.url || "").trim();
  if (s.icon === "email") {
    if (url.startsWith("http") || url.startsWith("mailto:")) return url;
    const addr = url || email;
    return addr ? `https://mail.google.com/mail/?view=cm&fs=1&to=${addr}` : "#";
  }
  return url || "#";
}

function isCopyable(s: SocialLink): boolean {
  if (s.icon === "email") return true; // email é copiado (como o discord), não abre link
  if (s.icon !== "discord") return false;
  const url = (s.url || "").trim();
  return !!url && !url.startsWith("http");
}

function emailAddress(s: SocialLink, email: string): string {
  const url = (s.url || "").trim();
  if (!url) return email;
  if (url.startsWith("mailto:")) return url.slice(7);
  if (url.startsWith("http")) return email;
  return url;
}

function flashToast(text: string) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = text;
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(0)";
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(60px)";
  }, 2500);
}

export function ContactModal({ profile }: { profile: ProfileContent }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-contact", onOpen);
    return () => window.removeEventListener("open-contact", onOpen);
  }, []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const handleCopy = useCallback((value: string, icon: IconName) => {
    trackClick("social", icon);
    const temp = document.createElement("input");
    temp.value = value;
    document.body.appendChild(temp);
    temp.select();
    try {
      document.execCommand("copy");
      flashToast(`${LABELS[icon] || icon} copiado!`);
    } catch {
      /* no-op */
    }
    document.body.removeChild(temp);
  }, []);

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

          {profile.socials.map((s, i) => {
            const icon = s.icon as IconName;
            const label = s.label || LABELS[icon] || icon;

            if (isCopyable(s)) {
              return (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCopy(s.icon === "email" ? emailAddress(s, profile.email) : s.url, icon);
                  }}
                  className="contact-btn"
                >
                  <Icon name={icon} />
                  {label}
                </a>
              );
            }

            return (
              <a
                key={i}
                href={resolveHref(s, profile.email)}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn"
                onClick={() => trackClick("social", icon)}
              >
                <Icon name={icon} />
                {label}
              </a>
            );
          })}

          {profile.socials.length === 0 && (
            <p style={{ opacity: 0.6, fontSize: "0.9rem", textAlign: "center" }}>
              Nenhum link ainda.
            </p>
          )}
        </div>
      </div>

      <div id="toast" className="toast">
        Copiado!
      </div>
    </>
  );
}
