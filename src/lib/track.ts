type ClickKind = "video" | "social";

export function trackClick(kind: ClickKind, label: string) {
  if (typeof document === "undefined") return;
  if (document.body.classList.contains("admin-mode")) return;
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
