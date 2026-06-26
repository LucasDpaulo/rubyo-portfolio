"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Video } from "@prisma/client";
import type { AvatarAdjustments, ClientReview } from "@/lib/validators";
import { DEFAULT_AVATAR_ADJUSTMENTS } from "@/lib/validators";
import { resizeToBase64 } from "@/lib/imageResize";
import { avatarImgStyle } from "@/components/public/Avatar";

const MAX_CLIENTS = 50;

const EMPTY: ClientReview = {
  logoUrl: "",
  logoAdjustments: DEFAULT_AVATAR_ADJUSTMENTS,
  name: "",
  handle: "",
  verified: false,
  description: "",
  subscribers: "",
  videos: "",
  channelUrl: "",
  videoIds: [],
  videoUrls: [],
};

type Preset = { id: string; label: string; adj: Partial<AvatarAdjustments> };
const PRESETS: Preset[] = [
  { id: "none", label: "Original", adj: {} },
  { id: "warm", label: "Quente", adj: { saturation: 1.2, hue: -10, sepia: 0.15 } },
  { id: "cold", label: "Frio", adj: { saturation: 0.9, hue: 20, brightness: 1.05 } },
  { id: "noir", label: "Noir", adj: { grayscale: 1, contrast: 1.25, brightness: 0.95 } },
  { id: "vintage", label: "Vintage", adj: { sepia: 0.55, saturation: 0.85, contrast: 1.1 } },
  { id: "vivid", label: "Vívido", adj: { saturation: 1.6, contrast: 1.15, brightness: 1.05 } },
];

function applyPreset(curr: AvatarAdjustments, preset: Preset): AvatarAdjustments {
  return {
    ...DEFAULT_AVATAR_ADJUSTMENTS,
    ...preset.adj,
    zoom: curr.zoom,
    offsetX: curr.offsetX,
    offsetY: curr.offsetY,
  };
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="slider-row">
      <span className="slider-label">
        {label}{" "}
        <em>
          {value.toFixed(step < 1 ? 2 : 0)}
          {unit || ""}
        </em>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </label>
  );
}

function ClientRow({
  client,
  index,
  total,
  videos,
  onChange,
  onRemove,
  onMove,
}: {
  client: ClientReview;
  index: number;
  total: number;
  videos: Video[];
  onChange: (patch: Partial<ClientReview>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const adj = client.logoAdjustments ?? DEFAULT_AVATAR_ADJUSTMENTS;
  const setAdj = (k: keyof AvatarAdjustments, v: number) =>
    onChange({ logoAdjustments: { ...adj, [k]: v } });

  const selected = new Set(client.videoIds ?? []);
  const toggleVideo = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange({ videoIds: Array.from(next) });
  };

  const videoUrls = client.videoUrls ?? [];
  const addVideoUrl = () => onChange({ videoUrls: [...videoUrls, { url: "", title: "" }] });
  const updateVideoUrl = (i: number, patch: Partial<{ url: string; title: string }>) =>
    onChange({ videoUrls: videoUrls.map((v, idx) => (idx === i ? { ...v, ...patch } : v)) });
  const removeVideoUrl = (i: number) =>
    onChange({ videoUrls: videoUrls.filter((_, idx) => idx !== i) });

  const onFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setErr(null);
      setUploading(true);
      try {
        const { base64, mimeType } = await resizeToBase64(file, 512);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ contentType: mimeType, base64 }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.message || j.error || `Upload falhou (${res.status})`);
        }
        const { url } = await res.json();
        onChange({ logoUrl: url, logoAdjustments: client.logoAdjustments ?? DEFAULT_AVATAR_ADJUSTMENTS });
      } catch (e2) {
        setErr(e2 instanceof Error ? e2.message : "Erro no upload");
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    },
    [client.logoAdjustments, onChange],
  );

  return (
    <div className="client-row">
      <div className="client-row-head">
        <span className="client-row-index">#{index + 1}</span>
        <div className="client-row-move">
          <button
            type="button"
            className="client-move-btn"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            title="Mover pra cima"
            aria-label="Mover pra cima"
          >
            ↑
          </button>
          <button
            type="button"
            className="client-move-btn"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            title="Mover pra baixo"
            aria-label="Mover pra baixo"
          >
            ↓
          </button>
        </div>
        <button
          type="button"
          className="danger-btn client-row-remove"
          onClick={onRemove}
          title="Remover cliente"
          aria-label="Remover cliente"
        >
          ×
        </button>
      </div>

      <div className="client-row-logo">
        <div className="client-edit-circle">
          {client.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={client.logoUrl} alt={client.name || "logo"} style={avatarImgStyle(adj)} />
          ) : (
            <span className="client-edit-circle-empty">
              {(client.name || "?").trim().charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="client-logo-actions">
          <button
            type="button"
            className="contact-btn"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "ENVIANDO…" : client.logoUrl ? "TROCAR ÍCONE" : "ENVIAR ÍCONE"}
          </button>
          {client.logoUrl && (
            <button
              type="button"
              className="ghost-btn"
              onClick={() => onChange({ logoUrl: "", logoAdjustments: DEFAULT_AVATAR_ADJUSTMENTS })}
            >
              REMOVER
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            style={{ display: "none" }}
            onChange={onFile}
          />
        </div>
      </div>

      {client.logoUrl && (
        <div className="client-frame-controls">
          <div className="avatar-editor-presets">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className="preset-chip"
                onClick={() => onChange({ logoAdjustments: applyPreset(adj, p) })}
              >
                {p.label}
              </button>
            ))}
          </div>
          <Slider label="Zoom" value={adj.zoom} min={1} max={4} step={0.05} onChange={(v) => setAdj("zoom", v)} />
          <Slider label="Posição X" value={adj.offsetX} min={-50} max={50} step={1} unit="%" onChange={(v) => setAdj("offsetX", v)} />
          <Slider label="Posição Y" value={adj.offsetY} min={-50} max={50} step={1} unit="%" onChange={(v) => setAdj("offsetY", v)} />
        </div>
      )}

      <label className="admin-label">Nome do canal</label>
      <input
        className="admin-input"
        value={client.name}
        placeholder="ex: CazéTV"
        onChange={(e) => onChange({ name: e.target.value })}
      />

      <div className="client-stats-grid">
        <div>
          <label className="admin-label">@handle (opcional)</label>
          <input
            className="admin-input"
            value={client.handle ?? ""}
            placeholder="ex: CazeTV"
            onChange={(e) => onChange({ handle: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label">Link do canal (opcional)</label>
          <input
            className="admin-input"
            value={client.channelUrl ?? ""}
            placeholder="https://youtube.com/@..."
            onChange={(e) => onChange({ channelUrl: e.target.value })}
          />
        </div>
      </div>

      <div className="client-stats-grid">
        <div>
          <label className="admin-label">Inscritos</label>
          <input
            className="admin-input"
            value={client.subscribers}
            placeholder="ex: 35,4 mi"
            onChange={(e) => onChange({ subscribers: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label">Vídeos (nº do canal)</label>
          <input
            className="admin-input"
            value={client.videos}
            placeholder="ex: 28 mil"
            onChange={(e) => onChange({ videos: e.target.value })}
          />
        </div>
      </div>

      <label className="client-check-inline">
        <input
          type="checkbox"
          checked={!!client.verified}
          onChange={(e) => onChange({ verified: e.target.checked })}
        />
        Selo de verificado
      </label>

      <label className="admin-label">Descrição do canal</label>
      <textarea
        className="admin-input"
        style={{ height: 70, resize: "vertical" }}
        value={client.description}
        placeholder="Sobre o canal / o trabalho feito"
        onChange={(e) => onChange({ description: e.target.value })}
      />

      <label className="admin-label">Vídeos feitos para este cliente</label>
      {videos.length === 0 ? (
        <p className="admin-hint">Nenhum vídeo no portfólio ainda. Adicione vídeos primeiro.</p>
      ) : (
        <div className="client-video-picker">
          {videos.map((v) => {
            const on = selected.has(v.id);
            const thumb =
              v.provider === "youtube"
                ? `https://img.youtube.com/vi/${v.videoId}/default.jpg`
                : null;
            return (
              <button
                key={v.id}
                type="button"
                className={`client-video-option${on ? " is-on" : ""}`}
                onClick={() => toggleVideo(v.id)}
                title={v.title}
              >
                <span className="client-video-check">{on ? "✓" : ""}</span>
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" className="client-video-thumb" />
                ) : (
                  <span className="client-video-thumb client-video-thumb-empty" />
                )}
                <span className="client-video-title">{v.title}</span>
                <span className="client-video-kind">{v.aspectRatio === "9:16" ? "Short" : "Long"}</span>
              </button>
            );
          })}
        </div>
      )}

      <label className="admin-label">Vídeos por URL (YouTube / outras plataformas)</label>
      <div className="client-vurl-list">
        {videoUrls.map((vu, vi) => (
          <div key={vi} className="client-vurl-row">
            <input
              className="admin-input"
              placeholder="https://youtube.com/watch?v=… ou /shorts/…"
              value={vu.url}
              onChange={(e) => updateVideoUrl(vi, { url: e.target.value })}
            />
            <input
              className="admin-input"
              placeholder="Título (opcional)"
              value={vu.title ?? ""}
              onChange={(e) => updateVideoUrl(vi, { title: e.target.value })}
            />
            <button
              type="button"
              className="danger-btn client-vurl-remove"
              onClick={() => removeVideoUrl(vi)}
              aria-label="Remover vídeo"
              title="Remover vídeo"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {videoUrls.length < 50 && (
        <button
          type="button"
          className="contact-btn"
          onClick={addVideoUrl}
          style={{ opacity: 0.85, marginBottom: 6 }}
        >
          + ADICIONAR VÍDEO POR URL
        </button>
      )}

      {err && <p className="login-error">{err}</p>}
    </div>
  );
}

export function ClientsEditor({
  clients,
  videos,
  onClose,
}: {
  clients: ClientReview[];
  videos: Video[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [items, setItems] = useState<ClientReview[]>(clients.map((c) => ({ ...c })));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    (i: number, patch: Partial<ClientReview>) =>
      setItems((curr) => curr.map((c, idx) => (idx === i ? { ...c, ...patch } : c))),
    [],
  );
  const remove = useCallback(
    (i: number) => setItems((curr) => curr.filter((_, idx) => idx !== i)),
    [],
  );
  const move = useCallback(
    (i: number, dir: -1 | 1) =>
      setItems((curr) => {
        const j = i + dir;
        if (j < 0 || j >= curr.length) return curr;
        const next = curr.slice();
        [next[i], next[j]] = [next[j], next[i]];
        return next;
      }),
    [],
  );
  const add = useCallback(
    () => setItems((curr) => (curr.length >= MAX_CLIENTS ? curr : [...curr, { ...EMPTY }])),
    [],
  );

  const onSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/clients", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error(await res.text());
      onClose();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }, [items, onClose, router]);

  return (
    <div className="clients-editor">
      {items.length === 0 && (
        <p className="admin-hint">Nenhum cliente ainda. Clique em “Adicionar cliente” abaixo.</p>
      )}

      <div className="clients-editor-list">
        {items.map((c, i) => (
          <ClientRow
            key={i}
            client={c}
            index={i}
            total={items.length}
            videos={videos}
            onChange={(patch) => update(i, patch)}
            onRemove={() => remove(i)}
            onMove={(dir) => move(i, dir)}
          />
        ))}
      </div>

      {items.length < MAX_CLIENTS && (
        <button
          type="button"
          className="contact-btn"
          onClick={add}
          style={{ marginTop: 12, opacity: 0.9 }}
        >
          + ADICIONAR CLIENTE
        </button>
      )}

      <button
        type="button"
        className="contact-btn"
        onClick={onSave}
        disabled={saving}
        style={{ marginTop: 10, cursor: saving ? "wait" : "pointer" }}
      >
        {saving ? "SALVANDO…" : "SALVAR CLIENTES"}
      </button>

      <p className="admin-hint">
        O ícone fica circular (estilo YouTube) — use zoom/posição pra enquadrar logos retangulares.
        Marque abaixo os vídeos do portfólio feitos pra cada cliente: eles aparecem no pop-up do
        canal.
      </p>

      {error && <p className="login-error">{error}</p>}
    </div>
  );
}
