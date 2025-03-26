"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  MinusCircle,
  PlusCircle,
  RotateCcw,
  RotateCw,
  Youtube,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Fullscreen
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn, extractYoutubeVideoId } from "@/lib/utils";
import { FileItem } from "@/lib/types";

interface UnifiedMediaPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  media: FileItem | null;
  playlist?: FileItem[];
  onNavigate?: (direction: 'next' | 'prev') => void;
}

export function UnifiedMediaPlayer({
  isOpen,
  onClose,
  media,
  playlist = [],
  onNavigate
}: UnifiedMediaPlayerProps) {
  // Media player state
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPlaylist] = useState(playlist && playlist.length > 1);

  // Image viewer state
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine media type
  const isVideo = media?.type === 'video';
  const isImage = media?.type === 'image';
  const isYoutubeVideo = isVideo && media?.videoType === 'youtube';

  // Get YouTube video ID if applicable
  const youtubeVideoId = isYoutubeVideo && media?.url
    ? extractYoutubeVideoId(media.url)
    : null;

  // Reset state when new media is loaded
  useEffect(() => {
    if (isOpen && media) {
      setPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setLoading(true);
      setError(null);
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, media]);

  // Video event handlers
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setLoading(false);
    }
  };

  const handleVideoError = () => {
    setError("Failed to load video. The video might be corrupted or in an unsupported format.");
    setLoading(false);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error("Error playing video:", err);
          setError("Failed to play video. This might be due to autoplay restrictions.");
        });
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

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setMuted(newVolume === 0);
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
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
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(err => {
          console.error("Error entering fullscreen:", err);
          setError("Failed to enter fullscreen mode.");
        });
      }
    }
  };

  // Image manipulation functions
  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const rotateLeft = () => {
    setRotation(prev => prev - 90);
  };

  const rotateRight = () => {
    setRotation(prev => prev + 90);
  };

  const handleImageDragStart = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleImageDrag = (e: React.MouseEvent<HTMLImageElement>) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleImageDragEnd = () => {
    setIsDragging(false);
  };

  // YouTube video handlers
  const openYoutubeVideo = () => {
    if (isYoutubeVideo && media?.url) {
      window.open(media.url, '_blank');
    }
  };

  // Playlist navigation
  const navigatePlaylist = (direction: 'next' | 'prev') => {
    if (onNavigate) {
      onNavigate(direction);
    }
  };

  // If no media is selected, don't render anything
  if (!media) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-5xl max-h-[95vh] p-0 overflow-hidden flex flex-col bg-black text-white"
        onPointerDownOutside={(e) => e.preventDefault()}  // Prevent closing on click outside image/video
      >
        <DialogHeader className="px-4 py-2 flex flex-row items-center justify-between bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
          <DialogTitle className="text-white flex items-center gap-2">
            {isYoutubeVideo && <Youtube className="h-4 w-4 text-red-500" />}
            {isImage && <ImageIcon className="h-4 w-4 text-blue-400" />}
            {isVideo && !isYoutubeVideo && <Play className="h-4 w-4 text-green-400" />}
            {media.caption || "Media Preview"}
          </DialogTitle>

          <div className="flex items-center gap-1">
            {hasPlaylist && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigatePlaylist('prev')}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigatePlaylist('next')}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center bg-black/90 relative min-h-[300px] overflow-hidden"
        >
          {loading && !isYoutubeVideo && !isImage && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}

          {error && (
            <div className="text-center p-4 text-red-400 z-10">
              <p>{error}</p>
            </div>
          )}

          {/* YouTube Video View */}
          {isYoutubeVideo && (
            <div className="w-full h-full flex items-center justify-center">
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
                      alt={media.caption || "YouTube video"}
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
          )}

          {/* Local Video Player */}
          {isVideo && !isYoutubeVideo && (
            <video
              ref={videoRef}
              src={media.url}
              className="max-h-[calc(95vh-130px)] max-w-full object-contain"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onError={handleVideoError}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onClick={togglePlay}
              controls={false}
              playsInline  // Better for mobile
              preload="metadata"
            />
          )}

          {/* Image Viewer */}
          {isImage && (
            <div
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
              onMouseUp={handleImageDragEnd}
              onMouseLeave={handleImageDragEnd}
              onMouseMove={handleImageDrag}
            >
              <div className="absolute top-4 right-4 bg-black/50 rounded-md p-1 z-10 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={zoomIn}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={zoomOut}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={rotateLeft}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={rotateRight}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={resetZoom}
                >
                  <Fullscreen className="h-4 w-4" />
                </Button>
              </div>
              <img
                ref={imageRef}
                src={media.url}
                alt={media.caption || "Image"}
                className={cn(
                  "max-h-[calc(95vh-100px)] max-w-full object-contain transition-transform cursor-move",
                  isDragging && "cursor-grabbing"
                )}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                }}
                onMouseDown={handleImageDragStart}
                draggable={false}
                onLoad={() => setLoading(false)}
                onError={() => {
                  setError("Failed to load image.");
                  setLoading(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Video Controls */}
        {isVideo && !isYoutubeVideo && (
          <div className="p-3 bg-gray-900 border-t border-gray-800">
            <div className="flex items-center gap-3">
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

              <div className="flex items-center gap-2 w-32">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {muted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                <Slider
                  defaultValue={[1]}
                  min={0}
                  max={1}
                  step={0.01}
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>

              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs text-gray-300 w-10 text-center">
                  {formatTime(currentTime)}
                </span>
                <Slider
                  min={0}
                  max={duration || 100}
                  step={0.01}
                  value={[currentTime]}
                  onValueChange={handleSeek}
                  className="flex-1"
                />
                <span className="text-xs text-gray-300 w-10 text-center">
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
