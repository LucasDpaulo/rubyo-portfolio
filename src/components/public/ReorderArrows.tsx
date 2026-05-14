"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Direction = "horizontal" | "vertical";

export function ReorderArrows({
  id,
  prevId,
  nextId,
  direction,
}: {
  id: string;
  prevId: string | null;
  nextId: string | null;
  direction: Direction;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const swap = async (otherId: string) => {
    setBusy(true);
    try {
      await fetch("/api/admin/videos/swap", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ aId: id, bId: otherId }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const isHoriz = direction === "horizontal";
  const prevLabel = isHoriz ? "Mover pra esquerda" : "Mover pra cima";
  const nextLabel = isHoriz ? "Mover pra direita" : "Mover pra baixo";
  const prevIcon = isHoriz ? "‹" : "▲";
  const nextIcon = isHoriz ? "›" : "▼";

  return (
    <div
      className={`reorder-arrows ${isHoriz ? "reorder-horiz" : "reorder-vert"}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="reorder-btn"
        disabled={!prevId || busy}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (prevId) swap(prevId);
        }}
        aria-label={prevLabel}
        title={prevLabel}
      >
        {prevIcon}
      </button>
      <button
        type="button"
        className="reorder-btn"
        disabled={!nextId || busy}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (nextId) swap(nextId);
        }}
        aria-label={nextLabel}
        title={nextLabel}
      >
        {nextIcon}
      </button>
    </div>
  );
}
