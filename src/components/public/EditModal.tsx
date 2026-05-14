"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { EditPayload } from "@/components/public/EditButton";
import type { HeroContent, ProfileContent } from "@/lib/validators";
import type { Video } from "@prisma/client";
import { AvatarEditor } from "@/components/public/AvatarEditor";

type Fields = Record<string, string>;

function titleFor(p: EditPayload): string {
  switch (p.type) {
    case "titles":
      return "EDITAR TÍTULOS";
    case "desc":
      return "EDITAR DESCRIÇÃO";
    case "bg":
      return "EDITAR VÍDEO DE FUNDO";
    case "name":
      return "EDITAR NOME";
    case "role":
      return "EDITAR CARGO";
    case "socials":
      return "EDITAR LINKS";
    case "project":
      return `EDITAR VÍDEO: ${p.video.title.toUpperCase()}`;
    case "new-video":
      return p.aspectRatio === "9:16" ? "NOVO SHORT" : "NOVO LONG FORM";
    case "avatar":
      return "EDITAR FOTO";
  }
}

function extractYouTubeId(input: string): string {
  const s = input.trim();
  if (!s) return "";
  const m =
    s.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/) ??
    s.match(/^([A-Za-z0-9_-]{11})$/);
  return m ? m[1] : s;
}

function initialFields(p: EditPayload): Fields {
  switch (p.type) {
    case "titles":
      return { line1: p.hero.titleLine1, line2: p.hero.titleLine2 };
    case "desc":
      return { description: p.hero.description };
    case "bg":
      return { bgVideoId: p.hero.bgVideoId ?? "" };
    case "name":
      return { name: p.profile.name };
    case "role":
      return { role: p.profile.role };
    case "socials": {
      const x = p.profile.socials.find((s) => s.icon === "x")?.url ?? "";
      return { x, email: p.profile.email };
    }
    case "project":
      return {
        title: p.video.title,
        url: p.video.url,
        tag: p.video.tag ?? "",
      };
    case "new-video":
      return { title: "", url: "", tag: "" };
    case "avatar":
      return {};
  }
}

async function save(p: EditPayload, fields: Fields): Promise<void> {
  if (p.type === "titles" || p.type === "desc" || p.type === "bg") {
    const next: HeroContent = {
      ...p.hero,
      titleLine1: p.type === "titles" ? fields.line1 : p.hero.titleLine1,
      titleLine2: p.type === "titles" ? fields.line2 : p.hero.titleLine2,
      description: p.type === "desc" ? fields.description : p.hero.description,
      bgVideoId:
        p.type === "bg" ? extractYouTubeId(fields.bgVideoId) : (p.hero.bgVideoId ?? ""),
    };
    const res = await fetch("/api/admin/hero", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(next),
    });
    if (!res.ok) throw new Error(await res.text());
    return;
  }

  if (p.type === "name" || p.type === "role" || p.type === "socials") {
    const next: ProfileContent = {
      ...p.profile,
      name: p.type === "name" ? fields.name : p.profile.name,
      role: p.type === "role" ? fields.role : p.profile.role,
      email: p.type === "socials" ? fields.email : p.profile.email,
      socials:
        p.type === "socials"
          ? p.profile.socials.map((s) =>
              s.icon === "x" ? { ...s, url: fields.x } : s,
            )
          : p.profile.socials,
    };
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(next),
    });
    if (!res.ok) throw new Error(await res.text());
    return;
  }

  if (p.type === "project") {
    const v: Video = p.video;
    const body = {
      title: fields.title,
      url: fields.url,
      tag: fields.tag || null,
      aspectRatio: v.aspectRatio,
    };
    const res = await fetch(`/api/admin/videos/${v.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return;
  }

  if (p.type === "new-video") {
    const body = {
      title: fields.title,
      url: fields.url,
      tag: fields.tag || null,
      aspectRatio: p.aspectRatio,
    };
    const res = await fetch(`/api/admin/videos`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return;
  }
}

function renderInputs(p: EditPayload, fields: Fields, set: (k: string, v: string) => void) {
  switch (p.type) {
    case "titles":
      return (
        <>
          <label className="admin-label">Linha 1</label>
          <input
            className="admin-input"
            value={fields.line1}
            onChange={(e) => set("line1", e.target.value)}
          />
          <label className="admin-label">Linha 2</label>
          <input
            className="admin-input"
            value={fields.line2}
            onChange={(e) => set("line2", e.target.value)}
          />
        </>
      );
    case "desc":
      return (
        <>
          <label className="admin-label">Descrição</label>
          <textarea
            className="admin-input"
            style={{ height: 110, resize: "vertical" }}
            value={fields.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </>
      );
    case "bg":
      return (
        <>
          <label className="admin-label">URL ou ID do YouTube</label>
          <input
            className="admin-input"
            placeholder="ex: https://youtu.be/dQw4w9WgXcQ ou só o ID"
            value={fields.bgVideoId}
            onChange={(e) => set("bgVideoId", e.target.value)}
          />
          <p className="admin-hint">Deixe em branco pra remover o vídeo de fundo.</p>
        </>
      );
    case "name":
      return (
        <>
          <label className="admin-label">Nome</label>
          <input
            className="admin-input"
            value={fields.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </>
      );
    case "role":
      return (
        <>
          <label className="admin-label">Cargo</label>
          <input
            className="admin-input"
            value={fields.role}
            onChange={(e) => set("role", e.target.value)}
          />
        </>
      );
    case "socials":
      return (
        <>
          <label className="admin-label">Link X (Twitter)</label>
          <input
            className="admin-input"
            value={fields.x}
            onChange={(e) => set("x", e.target.value)}
          />
          <label className="admin-label">Email</label>
          <input
            className="admin-input"
            type="email"
            value={fields.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </>
      );
    case "project":
    case "new-video":
      return (
        <>
          <label className="admin-label">Título</label>
          <input
            className="admin-input"
            value={fields.title}
            onChange={(e) => set("title", e.target.value)}
          />
          <label className="admin-label">URL (YouTube/Vimeo)</label>
          <input
            className="admin-input"
            placeholder="https://www.youtube.com/watch?v=..."
            value={fields.url}
            onChange={(e) => set("url", e.target.value)}
          />
          <label className="admin-label">Tag (opcional)</label>
          <input
            className="admin-input"
            value={fields.tag}
            onChange={(e) => set("tag", e.target.value)}
          />
        </>
      );
  }
}

export function EditModal() {
  const router = useRouter();
  const [payload, setPayload] = useState<EditPayload | null>(null);
  const [fields, setFields] = useState<Fields>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<EditPayload>).detail;
      setPayload(detail);
      setFields(initialFields(detail));
      setError(null);
    };
    window.addEventListener("open-edit", onOpen);
    return () => window.removeEventListener("open-edit", onOpen);
  }, []);

  useEffect(() => {
    document.body.style.overflow = payload ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [payload]);

  const close = useCallback(() => {
    setPayload(null);
    setError(null);
  }, []);

  const onSave = useCallback(async () => {
    if (!payload) return;
    setSaving(true);
    setError(null);
    try {
      await save(payload, fields);
      setSaving(false);
      close();
      router.refresh();
    } catch (err) {
      setSaving(false);
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    }
  }, [payload, fields, close, router]);

  const onDelete = useCallback(async () => {
    if (!payload || payload.type !== "project") return;
    const ok = window.confirm(
      `Excluir "${payload.video.title}"? Essa ação não pode ser desfeita.`,
    );
    if (!ok) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/videos/${payload.video.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      setDeleting(false);
      close();
      router.refresh();
    } catch (err) {
      setDeleting(false);
      setError(err instanceof Error ? err.message : "Erro ao excluir");
    }
  }, [payload, close, router]);

  const open = payload !== null;

  return (
    <div
      className={`modal${open ? " active" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className={`modal-content edit-modal-content${
          payload?.type === "avatar" ? " avatar-modal-content" : ""
        }`}
      >
        <span className="close-modal" onClick={close} role="button" aria-label="Fechar">
          ×
        </span>
        <h3 className="modal-title edit-modal-title">{payload ? titleFor(payload) : ""}</h3>

        {payload?.type === "avatar" ? (
          <AvatarEditor profile={payload.profile} onClose={close} />
        ) : (
          <>
            <div className="edit-fields">
              {payload &&
                renderInputs(payload, fields, (k, v) =>
                  setFields((prev) => ({ ...prev, [k]: v })),
                )}
            </div>

            <button
              className="contact-btn"
              onClick={onSave}
              disabled={saving || deleting}
              style={{ marginTop: 10, cursor: saving ? "wait" : "pointer" }}
            >
              {saving ? "SALVANDO…" : "SALVAR ALTERAÇÕES"}
            </button>

            {payload?.type === "project" && (
              <button
                type="button"
                className="danger-btn"
                onClick={onDelete}
                disabled={saving || deleting}
                style={{ marginTop: 10, cursor: deleting ? "wait" : "pointer" }}
              >
                {deleting ? "EXCLUINDO…" : "EXCLUIR VÍDEO"}
              </button>
            )}

            {error && <p className="login-error">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
