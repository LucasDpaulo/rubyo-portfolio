"use client";

import { useState, type FormEvent } from "react";
import type { HeroContent } from "@/lib/validators";

export function HeroEditor({ initial }: { initial: HeroContent }) {
  const [hero, setHero] = useState<HeroContent>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof HeroContent>(key: K, value: HeroContent[K]) {
    setHero((h) => ({ ...h, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    setError(null);
    const res = await fetch("/api/admin/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hero),
    });
    setSaving(false);
    if (res.ok) setMsg("Salvo!");
    else setError("Falha ao salvar");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-3xl tracking-[2px] text-white">HERO</h1>

      <Field label="Linha 1 do título">
        <input
          value={hero.titleLine1}
          onChange={(e) => set("titleLine1", e.target.value)}
          className="w-full rounded-sm border border-accent/20 bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </Field>

      <Field label="Linha 2 (em destaque)">
        <input
          value={hero.titleLine2}
          onChange={(e) => set("titleLine2", e.target.value)}
          className="w-full rounded-sm border border-accent/20 bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </Field>

      <Field label="Linha 3">
        <input
          value={hero.titleLine3}
          onChange={(e) => set("titleLine3", e.target.value)}
          className="w-full rounded-sm border border-accent/20 bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </Field>

      <Field label="Descrição">
        <textarea
          value={hero.description}
          onChange={(e) => set("description", e.target.value)}
          rows={4}
          className="w-full rounded-sm border border-accent/20 bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </Field>

      {msg && <p className="mb-3 text-xs text-accent">{msg}</p>}
      {error && (
        <p className="mb-3 rounded-sm border border-red-900/40 bg-red-950/30 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="rounded-sm border border-accent bg-accent px-4 py-2 text-[11px] uppercase tracking-[2px] text-bg hover:bg-transparent hover:text-accent disabled:opacity-50"
      >
        {saving ? "Salvando…" : "Salvar"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-[11px] uppercase tracking-[1.5px] text-dim">
        {label}
      </span>
      {children}
    </label>
  );
}
