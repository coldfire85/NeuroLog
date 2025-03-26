"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Youtube, AlertCircle, X, Check, Play } from "lucide-react";
import { extractYoutubeVideoId } from "@/lib/utils";

interface YouTubeUrlInputProps {
  onSubmit: (url: string, videoId: string) => void;
  placeholder?: string;
}

export function YouTubeUrlInput({ onSubmit, placeholder = "https://www.youtube.com/watch?v=..." }: YouTubeUrlInputProps) {
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [thumbnailError, setThumbnailError] = useState<boolean>(false);

  // Validate URL whenever it changes
  useEffect(() => {
    // Reset states
    setError(null);
    setVideoId(null);
    setVideoTitle(null);
    setIsValid(false);
    setThumbnailError(false);

    // Trim the URL
    const trimmedUrl = url.trim();

    // Skip empty URLs
    if (!trimmedUrl) return;

    // Start validation
    setIsValidating(true);

    // Extract video ID
    const extractedVideoId = extractYoutubeVideoId(trimmedUrl);

    if (!extractedVideoId) {
      setError("Please enter a valid YouTube URL");
      setIsValidating(false);
      return;
    }

    // Set video ID and mark as valid
    setVideoId(extractedVideoId);
    setIsValid(true);
    setIsValidating(false);

    // We could technically fetch the video title from YouTube API here
    // but that would require a server API key, so we'll just show the thumbnail

  }, [url]);

  const handleSubmit = () => {
    if (!isValid || !videoId) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    // Create standard watch URL
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Call the callback with the URL and video ID
    onSubmit(watchUrl, videoId);

    // Reset form
    setUrl("");
    setVideoId(null);
    setVideoTitle(null);
    setIsValid(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="youtube-url" className="flex items-center">
          <Youtube className="h-4 w-4 text-red-500 mr-2" />
          YouTube Video URL
        </Label>

        <div className="relative">
          <Input
            id="youtube-url"
            type="url"
            placeholder={placeholder}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`pr-10 ${error ? 'border-red-400 focus-visible:ring-red-400' : (isValid ? 'border-green-400 focus-visible:ring-green-400' : '')}`}
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValidating ? (
              <div className="h-4 w-4 border-2 border-t-transparent border-primary rounded-full animate-spin" />
            ) : error ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : isValid ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : null}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 flex items-center mt-1">
            <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
            {error}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Paste any YouTube URL (e.g., youtube.com/watch?v=VIDEO_ID, youtu.be/VIDEO_ID, youtube.com/shorts/VIDEO_ID)
        </p>
      </div>

      {videoId && (
        <div className="bg-muted p-3 rounded-md">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-sm font-medium flex items-center">
              <Youtube className="h-3.5 w-3.5 text-red-500 mr-1.5" />
              Video Preview
            </h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => {
                setUrl("");
                setVideoId(null);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {!thumbnailError ? (
            <div className="relative rounded-md overflow-hidden">
              <img
                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                alt="Video thumbnail"
                className="w-full h-auto object-cover rounded-md"
                onError={() => setThumbnailError(true)}
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="rounded-full bg-red-600/90 p-2 flex items-center justify-center shadow-lg">
                  <Play fill="white" className="h-4 w-4 text-white ml-0.5" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center bg-gray-100 h-24 rounded-md">
              <Youtube className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          )}
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!isValid || !videoId}
        className="w-full mt-4"
      >
        <Youtube className="h-4 w-4 mr-2" />
        Add YouTube Video
      </Button>
    </div>
  );
}
