"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { AvatarAdjustments, ProfileContent } from "@/lib/validators";
import { DEFAULT_AVATAR_ADJUSTMENTS } from "@/lib/validators";
import { avatarFilter } from "@/components/public/Avatar";

type Preset = { id: string; label: string; adj: Partial<AvatarAdjustments> };

const PRESETS: Preset[] = [
  { id: "none", label: "Original", adj: {} },
  { id: "warm", label: "Quente", adj: { saturation: 1.2, hue: -10, sepia: 0.15 } },
  { id: "cold", label: "Frio", adj: { saturation: 0.9, hue: 20, brightness: 1.05 } },
  { id: "noir", label: "Noir", adj: { grayscale: 1, contrast: 1.25, brightness: 0.95 } },
  { id: "vintage", label: "Vintage", adj: { sepia: 0.55, saturation: 0.85, contrast: 1.1 } },
  { id: "vivid", label: "Vívido", adj: { saturation: 1.6, contrast: 1.15, brightness: 1.05 } },
  { id: "matte", label: "Fosco", adj: { contrast: 0.9, brightness: 1.05, saturation: 0.85 } },
];

function applyPreset(adj: AvatarAdjustments, preset: Preset): AvatarAdjustments {
  return { ...DEFAULT_AVATAR_ADJUSTMENTS, ...preset.adj, zoom: adj.zoom, offsetX: adj.offsetX, offsetY: adj.offsetY };
}

export function AvatarEditor({
  profile,
  onClose,
}: {
  profile: ProfileContent;
  onClose: () => void;
}) {
  const router = useRouter();
  const [url, setUrl] = useState<string>(profile.avatarUrl || "");
  const [adj, setAdj] = useState<AvatarAdjustments>(
    profile.avatarAdjustments ?? DEFAULT_AVATAR_ADJUSTMENTS,
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const setNum = (k: keyof AvatarAdjustments) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAdj((p) => ({ ...p, [k]: parseFloat(e.target.value) }));

  const onFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setError(null);
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
        const { url: assetUrl } = await res.json();
        setUrl(assetUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro no upload");
      } finally {
        setUploading(false);
      }
    },
    [],
  );

  const onSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const next: ProfileContent = {
        ...profile,
        avatarUrl: url,
        avatarAdjustments: adj,
      };
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error(await res.text());
      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }, [profile, url, adj, onClose, router]);

  const onRemove = useCallback(() => {
    setUrl("");
    setAdj(DEFAULT_AVATAR_ADJUSTMENTS);
  }, []);

  const previewStyle = useMemo<React.CSSProperties>(
    () => ({
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transform: `scale(${adj.zoom}) translate(${adj.offsetX}%, ${adj.offsetY}%)`,
      filter: avatarFilter(adj),
    }),
    [adj],
  );

  return (
    <div className="avatar-editor">
      <div className="avatar-editor-preview">
        <div className="avatar-editor-circle">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="preview" style={previewStyle} />
          ) : (
            <span className="avatar-editor-placeholder">
              {(profile.name || "R").trim().charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="avatar-editor-actions">
          <button
            type="button"
            className="contact-btn"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "ENVIANDO…" : url ? "TROCAR FOTO" : "ENVIAR FOTO"}
          </button>
          {url && (
            <button type="button" className="ghost-btn" onClick={onRemove}>
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

      <div className="avatar-editor-controls">
        <div className="avatar-editor-section">
          <h4 className="avatar-editor-heading">Ajuste</h4>
          <Slider label="Zoom" value={adj.zoom} min={1} max={4} step={0.05} onChange={setNum("zoom")} />
          <Slider label="Posição X" value={adj.offsetX} min={-50} max={50} step={1} onChange={setNum("offsetX")} unit="%" />
          <Slider label="Posição Y" value={adj.offsetY} min={-50} max={50} step={1} onChange={setNum("offsetY")} unit="%" />
        </div>

        <div className="avatar-editor-section">
          <h4 className="avatar-editor-heading">Color grade</h4>
          <div className="avatar-editor-presets">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className="preset-chip"
                onClick={() => setAdj((curr) => applyPreset(curr, p))}
              >
                {p.label}
              </button>
            ))}
          </div>
          <Slider label="Brilho" value={adj.brightness} min={0.2} max={2} step={0.05} onChange={setNum("brightness")} />
          <Slider label="Contraste" value={adj.contrast} min={0.2} max={2} step={0.05} onChange={setNum("contrast")} />
          <Slider label="Saturação" value={adj.saturation} min={0} max={2} step={0.05} onChange={setNum("saturation")} />
          <Slider label="Matiz" value={adj.hue} min={-180} max={180} step={1} onChange={setNum("hue")} unit="°" />
          <Slider label="Sépia" value={adj.sepia} min={0} max={1} step={0.05} onChange={setNum("sepia")} />
          <Slider label="P&B" value={adj.grayscale} min={0} max={1} step={0.05} onChange={setNum("grayscale")} />
          <Slider label="Desfoque" value={adj.blur} min={0} max={10} step={0.5} onChange={setNum("blur")} unit="px" />
        </div>
      </div>

      <div className="avatar-editor-footer">
        <button
          type="button"
          className="contact-btn"
          onClick={onSave}
          disabled={saving || uploading}
        >
          {saving ? "SALVANDO…" : "SALVAR FOTO"}
        </button>
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}

async function resizeToBase64(
  file: File,
  maxSize: number,
): Promise<{ base64: string; mimeType: string }> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error || new Error("read"));
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("decode"));
    i.src = dataUrl;
  });
  const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
  const w = Math.round(img.width * ratio);
  const h = Math.round(img.height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas-context");
  ctx.drawImage(img, 0, 0, w, h);
  const mimeType = "image/webp";
  const out = canvas.toDataURL(mimeType, 0.88);
  const base64 = out.split(",")[1] ?? "";
  return { base64, mimeType };
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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="slider-row">
      <span className="slider-label">
        {label} <em>{value.toFixed(step < 1 ? 2 : 0)}{unit || ""}</em>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={onChange} />
    </label>
  );
}
