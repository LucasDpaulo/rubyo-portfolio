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

// mensagem pré-preenchida ao abrir o Gmail (usada quando o admin não definiu uma)
const DEFAULT_CONTACT_SUBJECT = "Video editing";
const DEFAULT_CONTACT_BODY = "Hi! I'm interested in a video editing project.";

function resolveHref(s: SocialLink, email: string, subject?: string, message?: string): string {
  const url = (s.url || "").trim();
  if (s.icon === "email") {
    // sempre abre o Gmail compose (web), com assunto + mensagem prontos
    if (url.startsWith("http")) return url;
    const addr = url.startsWith("mailto:") ? url.slice(7) : url || email;
    if (!addr) return "#";
    const su = (subject || "").trim() || DEFAULT_CONTACT_SUBJECT;
    const body = (message || "").trim() || DEFAULT_CONTACT_BODY;
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${addr}&su=${encodeURIComponent(su)}&body=${encodeURIComponent(body)}`;
  }
  if (s.icon === "discord") {
    if (!url) return "#";
    if (url.startsWith("http")) return url;
    if (url.includes("/")) return `https://${url}`; // ex: discord.com/users/...
    return "https://discord.com/app"; // handle puro → abre o app
  }
  return url || "#";
}

function copyTextFor(s: SocialLink, email: string): string | null {
  if (s.icon === "email") return emailAddress(s, email);
  if (s.icon === "discord") {
    const url = (s.url || "").trim();
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.includes("/")) return `https://${url}`;
    return url;
  }
  return null;
}

function emailAddress(s: SocialLink, email: string): string {
  const url = (s.url || "").trim();
  if (url.startsWith("mailto:")) return url.slice(7);
  if (url.startsWith("http")) return email;
  return url || email;
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
            const copyText = copyTextFor(s, profile.email);
            return (
              <a
                key={i}
                href={resolveHref(s, profile.email, profile.contactSubject, profile.contactMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn"
                onClick={() => {
                  if (copyText) handleCopy(copyText, icon);
                  else trackClick("social", icon);
                }}
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
