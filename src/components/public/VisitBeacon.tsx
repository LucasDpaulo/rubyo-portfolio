"use client";

import { useEffect } from "react";

export function VisitBeacon() {
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/admin") || path.startsWith("/api")) return;

    let visitId: string | null = null;
    let sent = false;
    const startedAt = Date.now();
    let activeMs = 0;
    let lastTickAt = document.visibilityState === "visible" ? Date.now() : null;

    const accrue = () => {
      if (lastTickAt != null) {
        activeMs += Date.now() - lastTickAt;
        lastTickAt = null;
      }
    };
    const resume = () => {
      if (lastTickAt == null) lastTickAt = Date.now();
    };

    fetch("/api/visit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path }),
      keepalive: true,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.id) visitId = d.id as string;
      })
      .catch(() => {});

    const send = () => {
      if (sent || !visitId) return;
      accrue();
      const durationMs = activeMs || Date.now() - startedAt;
      fetch("/api/visit", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: visitId, durationMs }),
        keepalive: true,
      }).catch(() => {});
      sent = true;
    };

    const onVis = () => {
      if (document.visibilityState === "hidden") {
        accrue();
        send();
      } else {
        sent = false; // permitir reenvio se voltou (mas só conta tempo ativo)
        resume();
      }
    };
    const onHide = () => {
      accrue();
      send();
    };

    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", onHide);
    window.addEventListener("beforeunload", onHide);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("beforeunload", onHide);
      send();
    };
  }, []);

  return null;
}
