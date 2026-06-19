// Extract YouTube video ID from any common URL format
export function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  // Direct ID (11 chars typical)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.slice(1).split("/")[0] || null;
    }
    if (url.hostname.includes("youtube.com")) {
      if (url.pathname === "/watch") return url.searchParams.get("v");
      const m = url.pathname.match(/\/(embed|shorts|v)\/([a-zA-Z0-9_-]{11})/);
      if (m) return m[2];
    }
  } catch {
    // not a URL
  }
  const m = trimmed.match(/([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export function youtubeThumbnail(id: string, quality: "max" | "hq" | "mq" = "max") {
  const q = quality === "max" ? "maxresdefault" : quality === "hq" ? "hqdefault" : "mqdefault";
  return `https://img.youtube.com/vi/${id}/${q}.jpg`;
}

export function youtubeEmbedUrl(id: string) {
  return `https://www.youtube.com/embed/${id}`;
}

export function youtubeWatchUrl(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}

// Fetch title/description via YouTube's public oEmbed endpoint (no API key)
export async function fetchYouTubeOEmbed(id: string): Promise<{ title: string; author_name: string } | null> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`,
    );
    if (!res.ok) return null;
    const data = await res.json();
    return { title: data.title, author_name: data.author_name };
  } catch {
    return null;
  }
}
