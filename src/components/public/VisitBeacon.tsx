"use client";

import { useEffect, useState } from "react";
import { NOTRACK_KEY } from "@/lib/track";

export function VisitBeacon() {
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/admin") || path.startsWith("/api")) return;

    // Opt-out por aparelho: abrir o site com ?notrack=1 marca este aparelho
    // pra nunca mais contar nas estatísticas; ?notrack=0 reativa a contagem.
    let optedOut = false;
    try {
      const flag = new URLSearchParams(window.location.search).get("notrack");
      if (flag === "1") {
        localStorage.setItem(NOTRACK_KEY, "1");
        setNotice("Este aparelho NÃO será mais contado nas estatísticas.");
      } else if (flag === "0") {
        localStorage.removeItem(NOTRACK_KEY);
        setNotice("Este aparelho voltará a ser contado nas estatísticas.");
      }
      optedOut = localStorage.getItem(NOTRACK_KEY) === "1";
    } catch {
      // localStorage indisponível (modo privado etc.) — segue contando normal
    }
    if (optedOut) return;

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

  if (!notice) return null;

  return (
    <div
      role="status"
      style={{
        position: "fixed",
        left: "50%",
        bottom: "24px",
        transform: "translateX(-50%)",
        zIndex: 9999,
        maxWidth: "min(92vw, 420px)",
        padding: "12px 18px",
        borderRadius: "999px",
        background: "rgba(13, 10, 8, 0.92)",
        color: "#F3E9DD",
        border: "1px solid rgba(196, 149, 106, 0.5)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        fontSize: "0.85rem",
        textAlign: "center",
        lineHeight: 1.35,
      }}
    >
      {notice}
    </div>
  );
}
