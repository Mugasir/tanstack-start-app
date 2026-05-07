/**
 * Detect media type from URL and return embeddable iframe URL.
 */
export function detectMediaType(url: string): "youtube" | "tiktok" | "upload" {
  const u = url.toLowerCase();
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("tiktok.com")) return "tiktok";
  return "upload";
}

export function getYouTubeEmbed(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

export function getTikTokEmbed(url: string): string | null {
  // TikTok embeds need video id
  const match = url.match(/\/video\/(\d+)/);
  return match ? `https://www.tiktok.com/embed/v2/${match[1]}` : null;
}

export function getEmbedUrl(mediaType: string, url: string): string | null {
  if (mediaType === "youtube") return getYouTubeEmbed(url);
  if (mediaType === "tiktok") return getTikTokEmbed(url);
  return url;
}

export function buildShareUrl(path: string): string {
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
}

export async function nativeShare(data: { title: string; text?: string; url: string }) {
  if (typeof navigator !== "undefined" && navigator.share) {
    try { await navigator.share(data); return true; } catch { /* user cancelled */ }
  }
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(data.url);
    return "copied";
  }
  return false;
}
