"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileItem } from "@/lib/types";
import { UnifiedMediaPlayer } from "@/components/unified-media-player";
import { ImageAnnotator } from "@/components/image-annotator";
import { BulkMediaUpload } from "@/components/bulk-media-upload";
import { FileGallery } from "@/components/file-gallery";

export default function MediaShowcasePage() {
  // State for the media player demo
  const [selectedMedia, setSelectedMedia] = useState<FileItem | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  // State for file gallery demo
  const [galleryFiles, setGalleryFiles] = useState<FileItem[]>([
    {
      id: "img1",
      url: "/demo/craniotomy1.jpg",
      caption: "Pre-operative MRI scan",
      type: "image"
    },
    {
      id: "vid1",
      url: "/demo/procedure-video.mp4",
      caption: "Tumor resection technique",
      type: "video",
      videoType: "file"
    },
    {
      id: "ytv1",
      url: "https://www.youtube.com/watch?v=jFGGboW5z_U",
      caption: "Craniotomy Educational Video",
      type: "video",
      videoType: "youtube"
    }
  ]);

  // Handle media selection
  const handleMediaSelect = (media: FileItem) => {
    setSelectedMedia(media);
    setIsMediaModalOpen(true);
  };

  // Handle bulk upload completion
  const handleUploadComplete = (files: FileItem[]) => {
    setGalleryFiles(prev => [...prev, ...files]);
  };

  // Handle file removal
  const handleRemoveFile = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Sample image for annotation
  const sampleImageUrl = "/demo/craniotomy1.jpg";

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Media Features Showcase</h1>
      <p className="text-gray-600 mb-8">
        This page demonstrates the new media capabilities added to the NeuroLog application.
      </p>

      <Tabs defaultValue="player" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-lg">
          <TabsTrigger value="player">Media Player</TabsTrigger>
          <TabsTrigger value="annotator">Image Annotator</TabsTrigger>
          <TabsTrigger value="upload">Bulk Upload</TabsTrigger>
        </TabsList>

        {/* Unified Media Player Demo */}
        <TabsContent value="player">
          <Card>
            <CardHeader>
              <CardTitle>Unified Media Player</CardTitle>
              <CardDescription>
                View different types of media including videos, images, and YouTube videos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Click on any media item to open it in the unified media player.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <FileGallery files={galleryFiles} onRemove={handleRemoveFile} />
              </div>

              <div className="mt-4">
                <Button onClick={() => {
                  const youtubeMedia: FileItem = {
                    id: "yt2",
                    url: "https://www.youtube.com/watch?v=XcRIHrZCjtQ",
                    caption: "Sample YouTube Video",
                    type: "video",
                    videoType: "youtube"
                  };
                  setSelectedMedia(youtubeMedia);
                  setIsMediaModalOpen(true);
                }}>
                  Open Sample YouTube Video
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Media player modal */}
          <UnifiedMediaPlayer
            isOpen={isMediaModalOpen}
            onClose={() => setIsMediaModalOpen(false)}
            media={selectedMedia}
            playlist={galleryFiles}
            onNavigate={(direction) => {
              if (!selectedMedia || galleryFiles.length === 0) return;

              const currentIndex = galleryFiles.findIndex(f => f.id === selectedMedia.id);
              if (currentIndex === -1) return;

              let newIndex = currentIndex;
              if (direction === 'next') {
                newIndex = (currentIndex + 1) % galleryFiles.length;
              } else {
                newIndex = (currentIndex - 1 + galleryFiles.length) % galleryFiles.length;
              }

              setSelectedMedia(galleryFiles[newIndex]);
            }}
          />
        </TabsContent>

        {/* Image Annotator Demo */}
        <TabsContent value="annotator">
          <Card>
            <CardHeader>
              <CardTitle>Image Annotator</CardTitle>
              <CardDescription>
                Annotate surgical images with various drawing tools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[600px]">
                <ImageAnnotator
                  imageUrl={sampleImageUrl}
                  onSave={(annotations, dataUrl) => {
                    console.log("Saved annotations:", annotations);

                    // Add the annotated image to the gallery
                    const newAnnotatedImage: FileItem = {
                      id: `annotated-${Date.now()}`,
                      url: dataUrl,
                      caption: "Annotated Image",
                      type: "image"
                    };

                    setGalleryFiles(prev => [...prev, newAnnotatedImage]);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Upload Demo */}
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Media Upload</CardTitle>
              <CardDescription>
                Upload multiple files at once with progress tracking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BulkMediaUpload
                onUploadComplete={handleUploadComplete}
                maxFiles={5}
              />

              <div className="mt-8">
                <CardTitle className="text-lg mb-4">Uploaded Files</CardTitle>
                {galleryFiles.length > 0 ? (
                  <FileGallery files={galleryFiles} onRemove={handleRemoveFile} />
                ) : (
                  <p className="text-gray-500">No files uploaded yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
