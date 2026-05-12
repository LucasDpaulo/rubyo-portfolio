"use client";

import { useState, type FormEvent } from "react";
import { signOut } from "next-auth/react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMsg(null);

    if (newPassword.length < 8) {
      setError("Nova senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirm) {
      setError("As novas senhas não conferem.");
      return;
    }

    setSaving(true);
    const res = await fetch("/api/admin/account/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setSaving(false);

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error === "validation" ? "Nova senha inválida (mín. 8 caracteres)." : j.error ?? "Falha ao trocar senha.");
      return;
    }

    setMsg("Senha alterada! Vou desconectar — entre de novo com a senha nova.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirm("");
    setTimeout(() => signOut({ callbackUrl: "/admin/login" }), 1500);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md">
      <h1 className="mb-6 font-display text-3xl tracking-[2px] text-white">CONTA</h1>

      <Field label="Senha atual">
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full rounded-sm border border-accent/20 bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </Field>

      <Field label="Nova senha (mín. 8 caracteres)">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-sm border border-accent/20 bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </Field>

      <Field label="Confirmar nova senha">
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
          className="w-full rounded-sm border border-accent/20 bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </Field>

      {msg && (
        <p className="mb-3 rounded-sm border border-accent/30 bg-accent/10 px-3 py-2 text-xs text-accent">
          {msg}
        </p>
      )}
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
        {saving ? "Salvando…" : "Trocar senha"}
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
