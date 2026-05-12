"use client";

import { useState, type FormEvent } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type VideoRow = {
  id: string;
  title: string;
  url: string;
  provider: string;
  videoId: string;
  aspectRatio: string;
  tag: string | null;
  sortOrder: number;
};

export function VideosManager({ initial }: { initial: VideoRow[] }) {
  const [videos, setVideos] = useState<VideoRow[]>(initial);
  const [editing, setEditing] = useState<VideoRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function onDragEnd(e: DragEndEvent) {
    if (!e.over || e.active.id === e.over.id) return;
    const oldIndex = videos.findIndex((v) => v.id === e.active.id);
    const newIndex = videos.findIndex((v) => v.id === e.over!.id);
    const next = arrayMove(videos, oldIndex, newIndex);
    setVideos(next);

    const res = await fetch("/api/admin/videos/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((v) => v.id) }),
    });
    if (!res.ok) setError("Falha ao reordenar");
  }

  async function onDelete(id: string) {
    if (!confirm("Remover este vídeo?")) return;
    const res = await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
    if (res.ok) setVideos((vs) => vs.filter((v) => v.id !== id));
    else setError("Falha ao remover");
  }

  async function onSubmit(data: {
    title: string;
    url: string;
    aspectRatio: string;
    tag: string;
  }) {
    setError(null);
    const payload = {
      title: data.title,
      url: data.url,
      aspectRatio: data.aspectRatio,
      tag: data.tag.trim() || null,
    };
    const url = editing
      ? `/api/admin/videos/${editing.id}`
      : "/api/admin/videos";
    const res = await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error === "validation" ? "Dados inválidos" : j.error ?? "Erro");
      return;
    }
    const saved = (await res.json()) as VideoRow;
    setVideos((vs) =>
      editing
        ? vs.map((v) => (v.id === saved.id ? saved : v))
        : [...vs, saved]
    );
    setEditing(null);
    setShowForm(false);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl tracking-[2px] text-white">VÍDEOS</h1>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="rounded-sm border border-accent bg-accent px-4 py-2 text-[11px] uppercase tracking-[2px] text-bg hover:bg-transparent hover:text-accent"
        >
          + Novo vídeo
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-sm border border-red-900/40 bg-red-950/30 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      )}

      {showForm && (
        <VideoForm
          initial={editing}
          onCancel={() => {
            setEditing(null);
            setShowForm(false);
          }}
          onSubmit={onSubmit}
        />
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={videos.map((v) => v.id)} strategy={verticalListSortingStrategy}>
          <ul className="flex flex-col gap-2">
            {videos.map((v) => (
              <SortableRow
                key={v.id}
                video={v}
                onEdit={() => {
                  setEditing(v);
                  setShowForm(true);
                }}
                onDelete={() => onDelete(v.id)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {!videos.length && !showForm && (
        <p className="rounded border border-accent/15 bg-brown/40 px-6 py-12 text-center text-sm text-dim">
          Nenhum vídeo. Clique em &quot;Novo vídeo&quot;.
        </p>
      )}
    </div>
  );
}

function SortableRow({
  video,
  onEdit,
  onDelete,
}: {
  video: VideoRow;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: video.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded border border-accent/15 bg-brown/40 p-3"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Arrastar"
        className="cursor-grab px-1 text-dim hover:text-accent active:cursor-grabbing"
      >
        ⋮⋮
      </button>
      <div className="flex-1 min-w-0">
        <div className="truncate text-sm text-white">{video.title}</div>
        <div className="truncate text-[11px] text-dim">
          {video.provider} · {video.aspectRatio} · {video.url}
        </div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="rounded-sm border border-accent/20 px-3 py-1 text-[10px] uppercase tracking-[1.5px] text-dim hover:border-accent hover:text-accent"
      >
        Editar
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-sm border border-red-900/30 px-3 py-1 text-[10px] uppercase tracking-[1.5px] text-red-400 hover:border-red-500"
      >
        Remover
      </button>
    </li>
  );
}

function VideoForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial: VideoRow | null;
  onCancel: () => void;
  onSubmit: (data: {
    title: string;
    url: string;
    aspectRatio: string;
    tag: string;
  }) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [aspectRatio, setAspectRatio] = useState(initial?.aspectRatio ?? "16:9");
  const [tag, setTag] = useState(initial?.tag ?? "");

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({ title, url, aspectRatio, tag });
  }

  return (
    <form
      onSubmit={submit}
      className="mb-6 rounded border border-accent/20 bg-brown/40 p-5"
    >
      <h2 className="mb-4 font-display text-lg tracking-[2px] text-white">
        {initial ? "Editar vídeo" : "Novo vídeo"}
      </h2>

      <Field label="Título">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-sm border border-accent/20 bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </Field>

      <Field label="URL (YouTube ou Vimeo)">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full rounded-sm border border-accent/20 bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Formato">
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="w-full rounded-sm border border-accent/20 bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          >
            <option value="16:9">16:9 (Long form)</option>
            <option value="9:16">9:16 (Short)</option>
          </select>
        </Field>

        <Field label="Tag (opcional)">
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="ex: 16:9 · Long"
            className="w-full rounded-sm border border-accent/20 bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </Field>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="submit"
          className="rounded-sm border border-accent bg-accent px-4 py-2 text-[11px] uppercase tracking-[2px] text-bg hover:bg-transparent hover:text-accent"
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-sm border border-accent/20 px-4 py-2 text-[11px] uppercase tracking-[2px] text-dim hover:border-accent hover:text-accent"
        >
          Cancelar
        </button>
      </div>
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
