"use client";

import { useState } from "react";

export function Avatar({ name }: { name: string }) {
  const [errored, setErrored] = useState(false);
  const initial = (name || "R").trim().charAt(0).toUpperCase();

  return (
    <div className="avatar-container">
      {!errored ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/avatar.jpg"
          alt={name}
          onError={() => setErrored(true)}
          className="avatar-img"
        />
      ) : (
        <span className="avatar-text">{initial}</span>
      )}
    </div>
  );
}
