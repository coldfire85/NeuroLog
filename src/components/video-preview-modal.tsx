"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play, Pause, Volume2, VolumeX, Maximize, Youtube } from "lucide-react";
import { cn, extractYoutubeVideoId } from "@/lib/utils";
import { FileItem } from "@/lib/types";

interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: FileItem | null;
}

export function VideoPreviewModal({ isOpen, onClose, video }: VideoPreviewModalProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [youtubeReady, setYoutubeReady] = useState(false);

  // Track if this is a YouTube video
  const isYoutubeVideo = video?.videoType === 'youtube';

  // Get YouTube video ID if applicable
  const youtubeVideoId = isYoutubeVideo && video?.url
    ? extractYoutubeVideoId(video.url)
    : null;

  // Reset state when new video is loaded
  useEffect(() => {
    if (isOpen) {
      setPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setLoading(true);
      setError(null);
    }
  }, [isOpen, video]);

  // Handle local video events
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVideoError = () => {
    setError("Failed to load video. The video might be corrupted or in an unsupported format.");
    setLoading(false);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const enterFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // For YouTube videos, open in YouTube
  const openYoutubeVideo = () => {
    if (isYoutubeVideo && video?.url) {
      window.open(video.url, '_blank');
    }
  };

  // If no video is selected, don't render anything
  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col bg-black text-white">
        <DialogHeader className="px-4 py-2 flex flex-row items-center justify-between bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
          <div className="flex-1">
            <DialogTitle className="text-white flex items-center">
              {isYoutubeVideo && (
                <Youtube className="h-4 w-4 text-red-500 mr-2" />
              )}
              {video.caption || "Video Preview"}
            </DialogTitle>
            {video.fileName && (
              <DialogDescription className="text-gray-300 text-xs">
                {video.fileName}
              </DialogDescription>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex-1 flex items-center justify-center bg-black/90 relative min-h-[300px]">
          {loading && !isYoutubeVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}

          {error && (
            <div className="text-center p-4 text-red-400">
              <p>{error}</p>
            </div>
          )}

          {isYoutubeVideo ? (
            <div className="w-full h-full flex items-center justify-center">
              {/* YouTube Thumbnail and Play Button */}
              <div className="relative flex flex-col items-center">
                <p className="mb-4 text-white text-lg font-medium">
                  This video will open in YouTube
                </p>

                {youtubeVideoId && (
                  <div
                    className="relative cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={openYoutubeVideo}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`}
                      onError={(e) => {
                        // Fallback to hqdefault if maxresdefault doesn't exist
                        (e.target as HTMLImageElement).src =
                          `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
                      }}
                      alt={video.caption || "YouTube video"}
                      className="rounded-lg shadow-lg max-h-[400px]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-red-600 p-6 shadow-lg flex items-center justify-center">
                        <Play fill="white" className="h-8 w-8 text-white ml-1" />
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  className="mt-6 bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                  onClick={openYoutubeVideo}
                >
                  <Youtube className="h-4 w-4" />
                  Open in YouTube
                </Button>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              src={video.url}
              className="max-h-[calc(90vh-100px)] max-w-full object-contain"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onError={handleVideoError}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onClick={togglePlay}
            />
          )}
        </div>

        {!isYoutubeVideo && (
          <div className="p-3 bg-gray-900 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {playing ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {muted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>

              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs text-gray-300 w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 rounded-full appearance-none bg-gray-700 accent-primary cursor-pointer"
                />
                <span className="text-xs text-gray-300 w-10">
                  {formatTime(duration)}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={enterFullScreen}
                className="text-white hover:bg-white/20"
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
