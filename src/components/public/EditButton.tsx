"use client";

import type { HeroContent, ProfileContent } from "@/lib/validators";
import type { Video } from "@prisma/client";

export type EditPayload =
  | { type: "titles"; hero: HeroContent }
  | { type: "desc"; hero: HeroContent }
  | { type: "bg"; hero: HeroContent }
  | { type: "name"; profile: ProfileContent }
  | { type: "role"; profile: ProfileContent }
  | { type: "socials"; profile: ProfileContent }
  | { type: "avatar"; profile: ProfileContent }
  | { type: "project"; video: Video }
  | { type: "new-video"; aspectRatio: "16:9" | "9:16" };

export function EditButton({ payload, label }: { payload: EditPayload; label: string }) {
  return (
    <button
      type="button"
      className="edit-btn"
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent("open-edit", { detail: payload }));
      }}
    >
      ✏️
    </button>
  );
}
