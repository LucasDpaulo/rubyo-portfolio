type ClickKind = "video" | "social";

// Marca de opt-out por aparelho (setada via ?notrack=1 no VisitBeacon).
// Aparelho marcado não conta visita NEM clique em vídeo/contato.
export const NOTRACK_KEY = "rb_notrack";

export function isOptedOut(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(NOTRACK_KEY) === "1";
  } catch {
    return false;
  }
}

export function trackClick(kind: ClickKind, label: string) {
  if (typeof document === "undefined") return;
  if (document.body.classList.contains("admin-mode")) return;
  if (isOptedOut()) return;
  try {
    fetch("/api/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, label }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* no-op */
  }
}
