"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-login", onOpen);
    return () => window.removeEventListener("open-login", onOpen);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => emailRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    setError(null);
    setPassword("");
  }, []);

  const submit = useCallback(async () => {
    if (!email || !password) return;
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Usuário ou senha incorretos.");
      return;
    }
    close();
    router.refresh();
  }, [email, password, router, close]);

  return (
    <div
      className={`modal${open ? " active" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="modal-content">
        <span className="close-modal" onClick={close} role="button" aria-label="Fechar">
          ×
        </span>
        <h3 className="modal-title">ADMIN LOGIN</h3>

        <input
          ref={emailRef}
          type="text"
          placeholder="Usuário"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="admin-input"
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          className="admin-input"
          autoComplete="current-password"
        />

        <button
          className="contact-btn"
          onClick={submit}
          disabled={loading}
          style={{ cursor: loading ? "wait" : "pointer" }}
        >
          {loading ? "ENTRANDO…" : "ENTRAR"}
        </button>

        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}
