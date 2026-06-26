"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { EditPayload } from "@/components/public/EditButton";
import type { HeroContent, ProfileContent, SocialLink } from "@/lib/validators";
import type { Video } from "@prisma/client";
import { AvatarEditor } from "@/components/public/AvatarEditor";
import { ClientsEditor } from "@/components/public/ClientsEditor";

type Fields = Record<string, string>;

const SOCIAL_ICONS: SocialLink["icon"][] = [
  "x",
  "discord",
  "email",
  "instagram",
  "youtube",
  "tiktok",
];

const SOCIAL_PLACEHOLDERS: Record<SocialLink["icon"], string> = {
  x: "https://x.com/seuusuario",
  discord: "seuusuario (será copiado ao clicar)",
  email: "contato@exemplo.com",
  instagram: "https://instagram.com/seuusuario",
  youtube: "https://youtube.com/@seuusuario",
  tiktok: "https://tiktok.com/@seuusuario",
};

const SOCIAL_LABEL_HINT: Record<SocialLink["icon"], string> = {
  x: "Twitter / X",
  discord: "Discord",
  email: "Email",
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
};

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
    case "clients":
      return "EDITAR CLIENTES";
    case "footer":
      return "EDITAR RODAPÉ";
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
    case "socials":
      return {
        email: p.profile.email,
        iconSize: p.profile.iconSize ?? "md",
        contactSubject: p.profile.contactSubject ?? "",
        contactMessage: p.profile.contactMessage ?? "",
      };
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
    case "clients":
      return {};
    case "footer":
      return {
        footerText: p.profile.footerText ?? "",
        footerSize: p.profile.footerSize ?? "sm",
        footerBold: p.profile.footerBold ? "1" : "",
        footerItalic: p.profile.footerItalic ? "1" : "",
      };
  }
}

async function save(
  p: EditPayload,
  fields: Fields,
  socials: SocialLink[],
): Promise<void> {
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

  if (
    p.type === "name" ||
    p.type === "role" ||
    p.type === "socials" ||
    p.type === "footer"
  ) {
    const next: ProfileContent = {
      ...p.profile,
      name: p.type === "name" ? fields.name : p.profile.name,
      role: p.type === "role" ? fields.role : p.profile.role,
      email: p.type === "socials" ? fields.email : p.profile.email,
      socials: p.type === "socials" ? socials : p.profile.socials,
      footerText: p.type === "footer" ? fields.footerText : p.profile.footerText,
      footerSize:
        p.type === "footer"
          ? ((fields.footerSize as "sm" | "md" | "lg") || "sm")
          : p.profile.footerSize,
      footerBold: p.type === "footer" ? fields.footerBold === "1" : p.profile.footerBold,
      footerItalic: p.type === "footer" ? fields.footerItalic === "1" : p.profile.footerItalic,
      iconSize:
        p.type === "socials"
          ? ((fields.iconSize as "sm" | "md" | "lg") || "md")
          : p.profile.iconSize,
      contactSubject:
        p.type === "socials" ? fields.contactSubject : p.profile.contactSubject,
      contactMessage:
        p.type === "socials" ? fields.contactMessage : p.profile.contactMessage,
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

function SocialsEditor({
  socials,
  email,
  iconSize,
  contactSubject,
  contactMessage,
  setSocials,
  setEmail,
  setIconSize,
  setContactSubject,
  setContactMessage,
}: {
  socials: SocialLink[];
  email: string;
  iconSize: "sm" | "md" | "lg";
  contactSubject: string;
  contactMessage: string;
  setSocials: (next: SocialLink[]) => void;
  setEmail: (v: string) => void;
  setIconSize: (v: "sm" | "md" | "lg") => void;
  setContactSubject: (v: string) => void;
  setContactMessage: (v: string) => void;
}) {
  function update(i: number, patch: Partial<SocialLink>) {
    setSocials(socials.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }
  function remove(i: number) {
    setSocials(socials.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= socials.length) return;
    const next = socials.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setSocials(next);
  }
  function add() {
    if (socials.length >= 8) return;
    const used = new Set(socials.map((s) => s.icon));
    const nextIcon = SOCIAL_ICONS.find((i) => !used.has(i)) ?? "x";
    setSocials([
      ...socials,
      { icon: nextIcon, label: SOCIAL_LABEL_HINT[nextIcon], url: "" },
    ]);
  }
  return (
    <>
      <label className="admin-label">Email principal</label>
      <input
        className="admin-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <p className="admin-hint">Usado no CTA do rodapé. Cada link de contato é editado abaixo.</p>

      <label className="admin-label">Assunto do email (ao clicar no Gmail)</label>
      <input
        className="admin-input"
        value={contactSubject}
        placeholder="Video editing"
        onChange={(e) => setContactSubject(e.target.value)}
      />
      <label className="admin-label">Mensagem do email (pré-preenchida)</label>
      <textarea
        className="admin-input"
        style={{ height: 70, resize: "vertical" }}
        value={contactMessage}
        placeholder="Hi! I'm interested in a video editing project."
        onChange={(e) => setContactMessage(e.target.value)}
      />
      <p className="admin-hint">
        Em branco usa o padrão. Aparece já preenchido quando o visitante abre o Gmail.
      </p>

      <label className="admin-label">Tamanho dos ícones</label>
      <div className="seg-control">
        {(["sm", "md", "lg"] as const).map((s) => (
          <button
            key={s}
            type="button"
            className={`seg-btn${iconSize === s ? " is-on" : ""}`}
            onClick={() => setIconSize(s)}
          >
            {s === "sm" ? "Pequeno" : s === "md" ? "Médio" : "Grande"}
          </button>
        ))}
      </div>

      <label className="admin-label" style={{ marginTop: 8 }}>
        Links de contato
      </label>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {socials.map((s, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "28px 110px 1fr 32px",
              gap: 6,
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                title="Mover pra cima"
                aria-label="Mover pra cima"
                style={{
                  height: 22,
                  width: 28,
                  padding: 0,
                  fontSize: 12,
                  lineHeight: 1,
                  background: "transparent",
                  border: "1px solid rgba(196,149,106,0.2)",
                  color: "inherit",
                  cursor: i === 0 ? "not-allowed" : "pointer",
                  opacity: i === 0 ? 0.35 : 1,
                  borderRadius: 3,
                }}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === socials.length - 1}
                title="Mover pra baixo"
                aria-label="Mover pra baixo"
                style={{
                  height: 22,
                  width: 28,
                  padding: 0,
                  fontSize: 12,
                  lineHeight: 1,
                  background: "transparent",
                  border: "1px solid rgba(196,149,106,0.2)",
                  color: "inherit",
                  cursor: i === socials.length - 1 ? "not-allowed" : "pointer",
                  opacity: i === socials.length - 1 ? 0.35 : 1,
                  borderRadius: 3,
                }}
              >
                ↓
              </button>
            </div>
            <select
              className="admin-input"
              value={s.icon}
              onChange={(e) => update(i, { icon: e.target.value as SocialLink["icon"] })}
              style={{ padding: "8px" }}
            >
              {SOCIAL_ICONS.map((opt) => (
                <option key={opt} value={opt}>
                  {SOCIAL_LABEL_HINT[opt]}
                </option>
              ))}
            </select>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <input
                className="admin-input"
                placeholder="Rótulo (ex: Discord, @meuuser)"
                value={s.label}
                onChange={(e) => update(i, { label: e.target.value })}
              />
              <input
                className="admin-input"
                placeholder={SOCIAL_PLACEHOLDERS[s.icon as SocialLink["icon"]]}
                value={s.url}
                onChange={(e) => update(i, { url: e.target.value })}
              />
            </div>
            <button
              type="button"
              className="danger-btn"
              title="Remover"
              aria-label="Remover"
              onClick={() => remove(i)}
              style={{ width: 32, height: 32, padding: 0, fontSize: 18, lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {socials.length < 8 && (
        <button
          type="button"
          className="contact-btn"
          onClick={add}
          style={{ marginTop: 10, opacity: 0.85 }}
        >
          + ADICIONAR CONTATO
        </button>
      )}
      <p className="admin-hint">
        Discord: deixe sem &quot;http&quot; pra copiar o handle ao clicar. Email: digite só o
        endereço pra abrir o Gmail. Outros: URL completa.
      </p>
    </>
  );
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
    case "footer":
      return (
        <>
          <label className="admin-label">Texto do rodapé</label>
          <input
            className="admin-input"
            value={fields.footerText}
            placeholder="© 2026 · ROBERTO · EDITOR"
            onChange={(e) => set("footerText", e.target.value)}
          />
          <p className="admin-hint">
            Texto livre — use o separador que quiser (·, –, |, etc.). Em branco usa o padrão (©
            ano · NOME · CARGO).
          </p>

          <label className="admin-label">Tamanho</label>
          <div className="seg-control">
            {(["sm", "md", "lg"] as const).map((s) => (
              <button
                key={s}
                type="button"
                className={`seg-btn${(fields.footerSize || "sm") === s ? " is-on" : ""}`}
                onClick={() => set("footerSize", s)}
              >
                {s === "sm" ? "Pequeno" : s === "md" ? "Médio" : "Grande"}
              </button>
            ))}
          </div>

          <label className="admin-label" style={{ marginTop: 12 }}>
            Estilo
          </label>
          <div className="seg-control">
            <button
              type="button"
              className={`seg-btn${fields.footerBold === "1" ? " is-on" : ""}`}
              style={{ fontWeight: 700 }}
              onClick={() => set("footerBold", fields.footerBold === "1" ? "" : "1")}
            >
              Negrito
            </button>
            <button
              type="button"
              className={`seg-btn${fields.footerItalic === "1" ? " is-on" : ""}`}
              style={{ fontStyle: "italic" }}
              onClick={() => set("footerItalic", fields.footerItalic === "1" ? "" : "1")}
            >
              Itálico
            </button>
          </div>
        </>
      );
    case "socials":
    case "clients":
      return null;
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
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<EditPayload>).detail;
      setPayload(detail);
      setFields(initialFields(detail));
      if (detail.type === "socials") {
        setSocials(detail.profile.socials.map((s) => ({ ...s })));
      } else {
        setSocials([]);
      }
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

  // ESC fecha o modal
  useEffect(() => {
    if (!payload) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [payload, close]);

  const onSave = useCallback(async () => {
    if (!payload) return;
    setSaving(true);
    setError(null);
    try {
      await save(payload, fields, socials);
      setSaving(false);
      close();
      router.refresh();
    } catch (err) {
      setSaving(false);
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    }
  }, [payload, fields, socials, close, router]);

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
        }${payload?.type === "clients" ? " clients-modal-content" : ""}`}
      >
        <span className="close-modal" onClick={close} role="button" aria-label="Fechar">
          ×
        </span>
        <h3 className="modal-title edit-modal-title">{payload ? titleFor(payload) : ""}</h3>

        {payload?.type === "avatar" ? (
          <AvatarEditor profile={payload.profile} onClose={close} />
        ) : payload?.type === "clients" ? (
          <ClientsEditor clients={payload.clients} videos={payload.videos} onClose={close} />
        ) : (
          <>
            <div className="edit-fields">
              {payload?.type === "socials" ? (
                <SocialsEditor
                  socials={socials}
                  email={fields.email ?? ""}
                  iconSize={(fields.iconSize as "sm" | "md" | "lg") ?? "md"}
                  contactSubject={fields.contactSubject ?? ""}
                  contactMessage={fields.contactMessage ?? ""}
                  setSocials={setSocials}
                  setEmail={(v) => setFields((prev) => ({ ...prev, email: v }))}
                  setIconSize={(v) => setFields((prev) => ({ ...prev, iconSize: v }))}
                  setContactSubject={(v) => setFields((prev) => ({ ...prev, contactSubject: v }))}
                  setContactMessage={(v) => setFields((prev) => ({ ...prev, contactMessage: v }))}
                />
              ) : (
                payload &&
                renderInputs(payload, fields, (k, v) =>
                  setFields((prev) => ({ ...prev, [k]: v })),
                )
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
