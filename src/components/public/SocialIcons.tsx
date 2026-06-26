"use client";

import { useCallback } from "react";
import { Icon, type IconName } from "@/components/public/Icons";
import type { SocialLink } from "@/lib/validators";
import { trackClick } from "@/lib/track";

type Variant = "hero" | "footer";

function emailAddress(s: SocialLink, email: string): string {
  const url = (s.url || "").trim();
  if (url.startsWith("mailto:")) return url.slice(7);
  if (url.startsWith("http")) return email;
  return url || email;
}

function resolveHref(s: SocialLink, email: string): string {
  const url = (s.url || "").trim();
  if (s.icon === "email") {
    // sempre abre o Gmail compose (web), mesmo salvo como mailto:
    if (url.startsWith("http")) return url;
    const addr = url.startsWith("mailto:") ? url.slice(7) : url || email;
    return addr ? `https://mail.google.com/mail/?view=cm&fs=1&to=${addr}` : "#";
  }
  if (s.icon === "discord") {
    if (!url) return "#";
    if (url.startsWith("http")) return url;
    if (url.includes("/")) return `https://${url}`; // ex: discord.com/users/... ou discord.gg/...
    return "https://discord.com/app"; // handle puro → abre o app do Discord
  }
  return url || "#";
}

// o que copiar ao clicar (email/discord). null = não copia.
function copyTextFor(s: SocialLink, email: string): string | null {
  if (s.icon === "email") return emailAddress(s, email);
  if (s.icon === "discord") {
    const url = (s.url || "").trim();
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.includes("/")) return `https://${url}`;
    return url; // handle
  }
  return null;
}

function flashToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(0)";
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(60px)";
  }, 2500);
}

export function SocialIcons({
  variant = "hero",
  socials,
  email,
  size = "md",
}: {
  variant?: Variant;
  socials: SocialLink[];
  email: string;
  size?: "sm" | "md" | "lg";
}) {
  const copyValue = useCallback((value: string) => {
    const temp = document.createElement("input");
    temp.value = value;
    document.body.appendChild(temp);
    temp.select();
    try {
      document.execCommand("copy");
      flashToast();
    } catch {
      /* no-op */
    }
    document.body.removeChild(temp);
  }, []);

  const wrap = `${variant === "footer" ? "footer-icons" : "social-icons"} icons-${size}`;
  const link = variant === "footer" ? "footer-icon-link" : "icon-link";

  return (
    <div className={wrap}>
      {socials.map((s, i) => {
        const icon = s.icon as IconName;
        const title = s.label || s.icon;
        const href = resolveHref(s, email);
        const copyText = copyTextFor(s, email);
        return (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={title}
            className={link}
            onClick={() => {
              trackClick("social", icon);
              if (copyText) copyValue(copyText);
            }}
          >
            <Icon name={icon} />
          </a>
        );
      })}
    </div>
  );
}
