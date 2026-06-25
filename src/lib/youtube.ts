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

export function youtubeThumbnail(idOrUrl: string, quality: "max" | "hq" | "mq" = "max") {
  const id = extractYouTubeId(idOrUrl) || idOrUrl;
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

export interface YouTubeVideoDetails {
  title: string;
  author_name: string;
  author_avatar?: string;
  views: string;
  duration: string;
  time_ago: string;
}

// Convert ISO 8601 duration to "MM:SS" or "HH:MM:SS"
function formatDuration(isoString: string) {
  const match = isoString.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "0:00";
  const h = (match[1] || "").replace("H", "");
  const m = (match[2] || "").replace("M", "");
  const s = (match[3] || "").replace("S", "");

  const minutes = m ? (h ? m.padStart(2, "0") : m) : "0";
  const seconds = s ? s.padStart(2, "0") : "00";

  return h ? `${h}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
}

// Convert numbers like 1200000 to "1.2M"
function formatViews(viewCount: string) {
  const num = parseInt(viewCount, 10);
  if (isNaN(num)) return "0 views";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M views";
  if (num >= 1000) return (num / 1000).toFixed(0) + "K views";
  return num.toString() + " views";
}

// Convert date to "2 months ago"
function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

// Fetch fully dynamic details from YouTube Data API v3
export async function fetchYouTubeVideoDetails(id: string, apiKey?: string): Promise<YouTubeVideoDetails | null> {
  // If no API key is provided, we gracefully fallback to the public oEmbed API
  // It will only give us title and author, so we mock the views and duration.
  if (!apiKey) {
     const oembed = await fetchYouTubeOEmbed(id);
     if (!oembed) return null;
     return {
       title: oembed.title,
       author_name: oembed.author_name,
       views: "--- views", 
       duration: "--:--", 
       time_ago: "--- ago" 
     };
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${id}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.items || data.items.length === 0) return null;
    
    const item = data.items[0];
    const channelId = item.snippet.channelId;
    
    // Fetch channel details to get the actual avatar
    let author_avatar = undefined;
    try {
      const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;
      const channelRes = await fetch(channelUrl);
      const channelData = await channelRes.json();
      if (channelData.items && channelData.items.length > 0) {
        author_avatar = channelData.items[0].snippet.thumbnails.default.url;
      }
    } catch {
      // Ignore avatar fetch errors
    }

    return {
      title: item.snippet.title,
      author_name: item.snippet.channelTitle,
      author_avatar,
      views: formatViews(item.statistics.viewCount),
      duration: formatDuration(item.contentDetails.duration),
      time_ago: formatTimeAgo(item.snippet.publishedAt)
    };
  } catch {
    return null;
  }
}

export interface YouTubeVideoBatchItem {
  youtube_id: string;
  yt_title: string;
  yt_channel: string;
  yt_channel_avatar: string;
  yt_views: string;
  yt_duration: string;
  yt_time_ago: string;
}

/**
 * Batch-fetch YouTube stats for multiple video IDs in TWO API calls:
 *   1. videos.list  — views, duration, publish date, channelId
 *   2. channels.list — channel avatar thumbnail
 * Returns a map of youtube_id to details.
 */
export async function fetchYouTubeVideosBatch(
  ids: string[],
  apiKey: string,
): Promise<Map<string, YouTubeVideoBatchItem>> {
  const result = new Map<string, YouTubeVideoBatchItem>();
  if (!ids.length || !apiKey) return result;

  try {
    // Step 1: fetch video stats
    const videoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos` +
      `?part=snippet,contentDetails,statistics` +
      `&id=${ids.join(",")}` +
      `&maxResults=50` +
      `&key=${apiKey}`,
    );
    const videoData = await videoRes.json();
    if (!videoData.items) return result;

    // Build initial entries and collect channelIds
    const channelIdByVideoId = new Map<string, string>();
    for (const item of videoData.items) {
      channelIdByVideoId.set(item.id, item.snippet.channelId);
      result.set(item.id, {
        youtube_id: item.id,
        yt_title: item.snippet.title,
        yt_channel: item.snippet.channelTitle,
        yt_channel_avatar: "",
        yt_views: formatViews(item.statistics?.viewCount ?? "0"),
        yt_duration: formatDuration(item.contentDetails?.duration ?? "PT0S"),
        yt_time_ago: formatTimeAgo(item.snippet.publishedAt),
      });
    }

    // Step 2: fetch channel avatars (one batch call for all unique channels)
    const uniqueChannelIds = [...new Set(channelIdByVideoId.values())];
    if (uniqueChannelIds.length > 0) {
      const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels` +
        `?part=snippet` +
        `&id=${uniqueChannelIds.join(",")}` +
        `&maxResults=50` +
        `&key=${apiKey}`,
      );
      const channelData = await channelRes.json();
      if (channelData.items) {
        const avatarByChannelId = new Map<string, string>();
        for (const ch of channelData.items) {
          avatarByChannelId.set(ch.id, ch.snippet.thumbnails?.default?.url ?? "");
        }
        for (const [videoId, channelId] of channelIdByVideoId) {
          const entry = result.get(videoId);
          if (entry) entry.yt_channel_avatar = avatarByChannelId.get(channelId) ?? "";
        }
      }
    }
  } catch {
    // Silently return partial results on failure
  }

  return result;
}
