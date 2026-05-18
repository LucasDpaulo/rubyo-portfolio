"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { StatsPayload } from "@/lib/stats";
import { StatsDashboard } from "@/components/admin/StatsDashboard";

export function AnalyticsModal({ variant = "panel" }: { variant?: "panel" | "card" }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<StatsPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => setMounted(true), []);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("fail"))))
      .then((d: StatsPayload) => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const close = useCallback(() => setOpen(false), []);

  function handleOpen() {
    setOpen(true);
    load();
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  const chartIcon = (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 3 3 5-6" />
    </svg>
  );

  return (
    <>
      {variant === "card" ? (
        <button type="button" onClick={handleOpen} className="profile-analytics-btn">
          {chartIcon}
          Análise
        </button>
      ) : (
        <button type="button" onClick={handleOpen} className="analytics-trigger">
          <span>
            <span className="analytics-trigger-title">ANÁLISE</span>
            <span className="analytics-trigger-sub">
              Visitas, vídeos abertos e cliques em redes sociais
            </span>
          </span>
          {chartIcon}
        </button>
      )}

      {mounted &&
        open &&
        createPortal(
          <div
            className="analytics-overlay"
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <div className="analytics-modal">
              <div className="analytics-header">
                <div>
                  <div className="analytics-header-title">ANÁLISE</div>
                  <div className="analytics-header-sub">
                    Tráfego e interações do site
                  </div>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="analytics-close"
                  aria-label="Fechar"
                  title="Fechar (Esc)"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  >
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              {!data && loading && (
                <div className="analytics-state">Carregando dados…</div>
              )}

              {!data && error && (
                <div className="analytics-state">
                  Não foi possível carregar os dados.
                  <br />
                  <button type="button" onClick={load} className="analytics-retry">
                    Tentar de novo
                  </button>
                </div>
              )}

              {data && <StatsDashboard data={data} />}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
