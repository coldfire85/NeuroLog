import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extract YouTube video ID from various YouTube URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractYoutubeVideoId(url: string): string | null {
  // Handle regular youtube.com URLs
  const regExpWatch = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  // Handle youtube.com/shorts URLs
  const regExpShorts = /^.*(youtube.com\/shorts\/)([^#&?]*).*/;

  const matchWatch = url.match(regExpWatch);
  const matchShorts = url.match(regExpShorts);

  if (matchWatch && matchWatch[2].length === 11) {
    return matchWatch[2];
  } else if (matchShorts && matchShorts[2].length === 11) {
    return matchShorts[2];
  }

  return null;
}

/**
 * Validates if a string is a valid YouTube URL
 */
export function isValidYoutubeUrl(url: string): boolean {
  return extractYoutubeVideoId(url) !== null;
}

/**
 * Converts any YouTube URL to embed format with necessary parameters
 * Includes parameters for better security and player control:
 * - origin: Specifies the origin that will be embedding the video
 * - rel=0: Restricts related videos to the same channel
 * - modestbranding=1: Reduces YouTube branding in player
 * - enablejsapi=1: Enables JavaScript API for control
 */
export function getYoutubeEmbedUrl(url: string): string | null {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) return null;

  // Use window.location.origin if available, or fallback to a safe default
  const origin = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://neuro-log.app';

  // Return a full embed URL with parameters for better security and control
  return `https://www.youtube-nocookie.com/embed/${videoId}?origin=${encodeURIComponent(origin)}&rel=0&modestbranding=1&enablejsapi=1`;
}

/**
 * Get the thumbnail URL for a YouTube video
 * Returns the high-quality thumbnail URL
 */
export function getYoutubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
