"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Trash2, Youtube, Play, ZoomIn, Pencil, FileImage,
  Globe, Lock, Share2
} from "lucide-react";
import { FileItem } from "@/lib/types";
import { cn, extractYoutubeVideoId } from "@/lib/utils";
import { VideoPreviewModal } from "./video-preview-modal";
import { ImageAnnotator } from "./image-annotator";
import { DicomViewer } from "./dicom-viewer";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface FileGalleryProps {
  files: FileItem[];
  onRemove?: (index: number) => void;
  onTogglePublic?: (index: number, isPublic: boolean) => void;
  editable?: boolean;
  showPublicControls?: boolean;
}

export function FileGallery({
  files,
  onRemove,
  onTogglePublic,
  editable = true,
  showPublicControls = false
}: FileGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<FileItem | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<FileItem | null>(null);
  const [isAnnotatorOpen, setIsAnnotatorOpen] = useState(false);
  const [selectedDicom, setSelectedDicom] = useState<FileItem | null>(null);
  const [isDicomViewerOpen, setIsDicomViewerOpen] = useState(false);
  const { toast } = useToast();

  if (!files || files.length === 0) {
    return null;
  }

  // Extract video ID from a YouTube URL
  const getVideoId = (url: string): string | null => {
    // Handle embed URLs
    const embedMatch = url.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];

    return extractYoutubeVideoId(url);
  };

  // Convert embed URL to watch URL for direct viewing
  const getYoutubeWatchUrl = (url: string): string => {
    const videoId = getVideoId(url);
    if (!videoId) return url;
    return `https://www.youtube.com/watch?v=${videoId}`;
  };

  // Handle video click
  const handleVideoClick = (file: FileItem) => {
    setSelectedVideo(file);
    setIsVideoModalOpen(true);
  };

  // Handle video modal close
  const handleVideoModalClose = () => {
    setIsVideoModalOpen(false);
  };

  // Handle image annotation
  const handleAnnotateClick = (file: FileItem, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedImage(file);
    setIsAnnotatorOpen(true);
  };

  // Handle annotator close
  const handleAnnotatorClose = () => {
    setIsAnnotatorOpen(false);
    setSelectedImage(null);
  };

  // Handle save annotations
  const handleSaveAnnotations = (annotations: Array<Record<string, unknown>>, dataUrl: string) => {
    // In a production app, we would save the annotated image
    // For this demo, we'll just download the image
    const link = document.createElement("a");
    link.download = `annotated-${selectedImage?.fileName || "image"}.png`;
    link.href = dataUrl;
    link.click();

    // Close the dialog
    handleAnnotatorClose();
  };

  // Handle DICOM file click
  const handleDicomClick = (file: FileItem) => {
    setSelectedDicom(file);
    setIsDicomViewerOpen(true);
  };

  // Handle DICOM viewer close
  const handleDicomViewerClose = () => {
    setIsDicomViewerOpen(false);
    setSelectedDicom(null);
  };

  // Check if a radiology file is a DICOM file
  const isDicomFile = (file: FileItem): boolean => {
    return file.type === "radiology" && file.fileType === "dicom";
  };

  // Handle toggle public status
  const handleTogglePublic = (index: number, isPublic: boolean) => {
    if (onTogglePublic) {
      onTogglePublic(index, isPublic);

      toast({
        title: isPublic ? "Item Made Public" : "Item Made Private",
        description: isPublic
          ? "This item is now visible to other users in search"
          : "This item is now private and only visible to you",
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {files.map((file, index) => (
          <div
            key={file.id || index}
            className={cn(
              "relative rounded-md overflow-hidden border",
              file.isPublic && showPublicControls && "border-green-500"
            )}
          >
            {/* Display public indicator if enabled */}
            {showPublicControls && file.isPublic && (
              <div className="absolute top-2 right-2 z-10">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  <Globe className="h-3 w-3 mr-1" />
                  Public
                </Badge>
              </div>
            )}

            {file.type === "image" ? (
              <div className="aspect-video flex items-center justify-center bg-black/5 relative group">
                <img
                  src={file.url}
                  alt={file.caption || file.fileName || `File ${index + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white rounded-full bg-black/40 hover:bg-black/60"
                    onClick={() => {
                      window.open(file.url, '_blank');
                    }}
                  >
                    <ZoomIn className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white rounded-full bg-black/40 hover:bg-black/60"
                    onClick={(e) => handleAnnotateClick(file, e)}
                  >
                    <Pencil className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : file.type === "video" ? (
              <div
                className="aspect-video relative cursor-pointer group"
                onClick={() => handleVideoClick(file)}
              >
                {file.videoType === "youtube" ? (
                  <div className="relative h-full w-full bg-gray-100">
                    {/* YouTube thumbnail with play button overlay */}
                    {getVideoId(file.url) && (
                      <>
                        <img
                          src={`https://img.youtube.com/vi/${getVideoId(file.url)}/hqdefault.jpg`}
                          alt={file.caption || "YouTube thumbnail"}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <div className="rounded-full bg-red-600/90 p-3 flex items-center justify-center shadow-lg">
                            <Play fill="white" className="h-5 w-5 text-white ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                          <Youtube className="h-3 w-3 text-red-500 mr-1" />
                          YouTube
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="h-full w-full bg-black relative">
                    <video
                      src={file.url}
                      className="w-full h-full object-contain"
                      poster=""
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <div className="rounded-full bg-primary/90 p-3 flex items-center justify-center shadow-lg">
                        <Play fill="white" className="h-5 w-5 text-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Radiology files section
              isDicomFile(file) ? (
                <div
                  className="aspect-video flex items-center justify-center bg-slate-100 cursor-pointer group relative"
                  onClick={() => handleDicomClick(file)}
                >
                  <div className="flex flex-col items-center text-slate-600">
                    <FileImage className="h-10 w-10 mb-2" />
                    <span className="text-sm font-medium">DICOM Image</span>
                    <span className="text-xs">{file.caption || file.fileName || `DICOM File ${index + 1}`}</span>
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white bg-black/40 hover:bg-black/60"
                    >
                      View DICOM
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gray-200">
                  <div className="flex flex-col items-center text-slate-600">
                    <FileImage className="h-8 w-8 mb-1" />
                    <span>{file.caption || file.fileName || `Radiology File ${index + 1}`}</span>
                  </div>
                </div>
              )
            )}
            <div className="p-2 text-sm flex items-center justify-between bg-background">
              <div className={cn("truncate max-w-[70%]", file.videoType === "youtube" && "flex items-center")}>
                {file.videoType === "youtube" && (
                  <Youtube className="h-3 w-3 text-red-500 mr-1 flex-shrink-0" />
                )}
                {file.caption || file.fileName ||
                  `${file.type === "image"
                    ? "Image"
                    : file.type === "video"
                      ? file.videoType === "youtube"
                        ? "YouTube Video"
                        : "Video"
                      : isDicomFile(file)
                        ? "DICOM File"
                        : "Radiology"
                  } ${index + 1}`
                }
              </div>
              <div className="flex items-center gap-1">
                {/* Public toggle button */}
                {editable && showPublicControls && onTogglePublic && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center mr-1">
                          <Switch
                            checked={!!file.isPublic}
                            onCheckedChange={(checked) => handleTogglePublic(index, checked)}
                            className="mr-1"
                            size="sm"
                          />
                          {file.isPublic ? (
                            <Globe className="h-3.5 w-3.5 text-green-600" />
                          ) : (
                            <Lock className="h-3.5 w-3.5 text-gray-400" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {file.isPublic
                          ? "Make this file private (currently public)"
                          : "Make this file public for others to search"
                        }
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {/* Remove button */}
                {editable && onRemove && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(index);
                    }}
                    title="Remove file"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Preview Modal */}
      <VideoPreviewModal
        isOpen={isVideoModalOpen}
        onClose={handleVideoModalClose}
        video={selectedVideo}
      />

      {/* Image Annotation Dialog */}
      <Dialog open={isAnnotatorOpen} onOpenChange={setIsAnnotatorOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Image Annotation</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {selectedImage && (
              <ImageAnnotator
                imageUrl={selectedImage.url}
                onSave={handleSaveAnnotations}
                className="h-full"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* DICOM Viewer */}
      {selectedDicom && (
        <DicomViewer
          file={selectedDicom}
          isOpen={isDicomViewerOpen}
          onClose={handleDicomViewerClose}
        />
      )}
    </>
  );
}
