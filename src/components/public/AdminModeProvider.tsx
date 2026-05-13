"use client";

import { useEffect } from "react";

export function AdminModeProvider({ isAdmin }: { isAdmin: boolean }) {
  useEffect(() => {
    if (isAdmin) {
      document.body.classList.add("admin-mode");
    } else {
      document.body.classList.remove("admin-mode");
    }
    return () => {
      document.body.classList.remove("admin-mode");
    };
  }, [isAdmin]);

  return null;
}
