"use client";

import { useCallback } from "react";
import { Icon, type IconName } from "@/components/public/Icons";
import type { SocialLink } from "@/lib/validators";
import { trackClick } from "@/lib/track";

type Variant = "hero" | "footer";

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
  if (url.startsWith("http")) return email; // link de compose → usa o email principal
  return url;
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
  const handleCopy = useCallback((value: string, icon: IconName) => {
    trackClick("social", icon);
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

        if (isCopyable(s)) {
          return (
            <a
              key={i}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleCopy(s.icon === "email" ? emailAddress(s, email) : s.url, icon);
              }}
              title={`${title} — copiar`}
              className={link}
            >
              <Icon name={icon} />
            </a>
          );
        }

        const href = resolveHref(s, email);
        return (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={title}
            className={link}
            onClick={() => trackClick("social", icon)}
          >
            <Icon name={icon} />
          </a>
        );
      })}
    </div>
  );
}
