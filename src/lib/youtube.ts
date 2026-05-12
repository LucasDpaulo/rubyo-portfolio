export type VideoProvider = "youtube" | "vimeo";

export type ParsedVideo = {
  provider: VideoProvider;
  videoId: string;
  embedUrl: string;
  thumbnailUrl: string | null;
};

export function parseVideoUrl(url: string): ParsedVideo | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const u = new URL(trimmed);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? youtube(id) : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        return id ? youtube(id) : null;
      }
      const m = u.pathname.match(/^\/(?:shorts|embed)\/([^/]+)/);
      if (m) return youtube(m[1]);
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const m = u.pathname.match(/\/(\d+)/);
      if (m) return vimeo(m[1]);
    }
    return null;
  } catch {
    return null;
  }
}

function youtube(id: string): ParsedVideo {
  return {
    provider: "youtube",
    videoId: id,
    embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
    thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  };
}

function vimeo(id: string): ParsedVideo {
  return {
    provider: "vimeo",
    videoId: id,
    embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1`,
    thumbnailUrl: null,
  };
}
