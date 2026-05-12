"use client";

import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Email ou senha incorretos.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded border border-accent/15 bg-brown/50 p-8"
      >
        <h1 className="mb-1 font-display text-2xl tracking-[2px] text-white">ADMIN</h1>
        <p className="mb-6 text-[11px] uppercase tracking-[2px] text-accent">
          Acesso restrito
        </p>

        <label className="mb-4 block">
          <span className="mb-1 block text-[11px] uppercase tracking-[1.5px] text-dim">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded-sm border border-accent/20 bg-bg px-3 py-2 text-sm text-cream outline-none focus:border-accent"
          />
        </label>

        <label className="mb-6 block">
          <span className="mb-1 block text-[11px] uppercase tracking-[1.5px] text-dim">
            Senha
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-sm border border-accent/20 bg-bg px-3 py-2 text-sm text-cream outline-none focus:border-accent"
          />
        </label>

        {error && (
          <p className="mb-4 rounded-sm border border-red-900/40 bg-red-950/30 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-sm border border-accent bg-accent px-4 py-2.5 text-xs font-medium uppercase tracking-[2px] text-bg transition-colors hover:bg-transparent hover:text-accent disabled:opacity-50"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
