"use client";

import { useState, type FormEvent } from "react";
import type { ProfileContent, SocialLink } from "@/lib/validators";

const ICONS: SocialLink["icon"][] = [
  "x",
  "discord",
  "email",
  "instagram",
  "youtube",
  "tiktok",
];

export function ProfileEditor({ initial }: { initial: ProfileContent }) {
  const [profile, setProfile] = useState<ProfileContent>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ProfileContent>(key: K, value: ProfileContent[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  function updateSocial(i: number, patch: Partial<SocialLink>) {
    setProfile((p) => ({
      ...p,
      socials: p.socials.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    }));
  }

  function addSocial() {
    setProfile((p) => ({
      ...p,
      socials: [...p.socials, { label: "", url: "", icon: "x" }],
    }));
  }

  function removeSocial(i: number) {
    setProfile((p) => ({
      ...p,
      socials: p.socials.filter((_, idx) => idx !== i),
    }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    setError(null);
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    if (res.ok) setMsg("Salvo!");
    else setError("Falha ao salvar — confira email e URLs");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-3xl tracking-[2px] text-white">PERFIL</h1>

      <Field label="Nome">
        <input
          value={profile.name}
          onChange={(e) => set("name", e.target.value)}
          className="w-full rounded-sm border border-accent/20 bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </Field>

      <Field label="Função / linha sob o nome">
        <input
          value={profile.role}
          onChange={(e) => set("role", e.target.value)}
          className="w-full rounded-sm border border-accent/20 bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </Field>

      <Field label="Email de contato">
        <input
          type="email"
          value={profile.email}
          onChange={(e) => set("email", e.target.value)}
          className="w-full rounded-sm border border-accent/20 bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </Field>

      <div className="mb-3 mt-6 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[1.5px] text-dim">
          Redes sociais
        </span>
        <button
          type="button"
          onClick={addSocial}
          className="rounded-sm border border-accent/20 px-3 py-1 text-[10px] uppercase tracking-[1.5px] text-dim hover:border-accent hover:text-accent"
        >
          + Adicionar
        </button>
      </div>

      <ul className="mb-6 flex flex-col gap-2">
        {profile.socials.map((s, i) => (
          <li
            key={i}
            className="grid grid-cols-[110px_1fr_1fr_auto] items-center gap-2 rounded border border-accent/15 bg-brown/30 p-2"
          >
            <select
              value={s.icon}
              onChange={(e) =>
                updateSocial(i, { icon: e.target.value as SocialLink["icon"] })
              }
              className="rounded-sm border border-accent/20 bg-bg px-2 py-1.5 text-xs outline-none focus:border-accent"
            >
              {ICONS.map((ic) => (
                <option key={ic} value={ic}>
                  {ic}
                </option>
              ))}
            </select>
            <input
              value={s.label}
              onChange={(e) => updateSocial(i, { label: e.target.value })}
              placeholder="Rótulo"
              className="rounded-sm border border-accent/20 bg-bg px-2 py-1.5 text-xs outline-none focus:border-accent"
            />
            <input
              value={s.url}
              onChange={(e) => updateSocial(i, { url: e.target.value })}
              placeholder="https://... ou mailto:..."
              className="rounded-sm border border-accent/20 bg-bg px-2 py-1.5 text-xs outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={() => removeSocial(i)}
              className="rounded-sm border border-red-900/30 px-2 py-1 text-[10px] uppercase text-red-400 hover:border-red-500"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

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
