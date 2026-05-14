"use client";

import { useEffect } from "react";

export function VisitBeacon() {
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/admin") || path.startsWith("/api")) return;

    const payload = JSON.stringify({ path });
    try {
      const blob = new Blob([payload], { type: "application/json" });
      if (navigator.sendBeacon?.("/api/visit", blob)) return;
    } catch {
      // fallback
    }
    fetch("/api/visit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }, []);

  return null;
}
