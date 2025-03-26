"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, X, FileImage } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { YouTubeUrlInput } from "./youtube-url-input";

interface FileUploadProps {
  fileType: "image" | "video" | "radiology";
  onUploadComplete: (fileData: { url: string; fileName: string; type: string; videoType?: string; fileType?: string }) => void;
  className?: string;
}

export function FileUpload({ fileType, onUploadComplete, className = "" }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("file");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const allowedTypes = {
    image: ["image/jpeg", "image/png", "image/gif"],
    video: ["video/mp4", "video/webm", "video/avi", "video/quicktime", "video/x-matroska"],
    radiology: ["image/jpeg", "image/png", "image/dicom", "application/dicom", "application/zip", "application/x-zip-compressed"]
  };

  const maxSizeInBytes = {
    image: 20 * 1024 * 1024, // 20MB
    video: 500 * 1024 * 1024, // 500MB
    radiology: 50 * 1024 * 1024 // 50MB (increased for DICOM files)
  };

  const maxSizeFormatted = {
    image: "20MB",
    video: "500MB",
    radiology: "50MB"
  };

  const placeholderText = {
    image: "JPG, PNG or GIF. Max size 20MB.",
    video: "MP4, WEBM, AVI, MOV or MKV. Max size 500MB.",
    radiology: "JPG, PNG, DICOM or ZIP (for DICOM folders). Max size 50MB."
  };

  // Detect if a file is a DICOM file
  const isDicomFile = (file: File): boolean => {
    // Check by extension (not always reliable)
    if (file.name.toLowerCase().endsWith('.dcm')) {
      return true;
    }

    // Check by MIME type
    if (file.type === 'application/dicom' || file.type === 'image/dicom') {
      return true;
    }

    // For files without recognized MIME type, we might need to try to read the file
    // This is simplified and would need more robust detection in production
    return false;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!allowedTypes[fileType].includes(file.type) &&
        !(fileType === 'radiology' && (file.name.endsWith('.zip') || file.name.endsWith('.dcm')))) {
      toast({
        title: "Invalid file type",
        description: `Please select a valid ${fileType} file.`,
        variant: "destructive",
      });
      return;
    }

    // Check file size
    if (file.size > maxSizeInBytes[fileType]) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSizeFormatted[fileType]}.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);

    // Create a preview URL for the file (images and videos only)
    if (fileType !== 'radiology' || file.type.startsWith('image/')) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    } else if (file.name.endsWith('.zip') || isDicomFile(file)) {
      // For ZIP files or DICOM files, we can just show the file name
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Create a FormData object
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("type", fileType);

    // Add special flag for DICOM files
    if (fileType === 'radiology' && isDicomFile(selectedFile)) {
      formData.append("fileType", "dicom");
    }

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 100);

      // Send the file to the server
      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();

      // For DICOM files, add the fileType
      if (fileType === 'radiology' && isDicomFile(selectedFile)) {
        data.fileType = "dicom";
      } else if (fileType === 'image') {
        // Set file type for images based on extension
        if (selectedFile.name.toLowerCase().endsWith('.jpg') || selectedFile.name.toLowerCase().endsWith('.jpeg')) {
          data.fileType = "jpg";
        } else if (selectedFile.name.toLowerCase().endsWith('.png')) {
          data.fileType = "png";
        }
      } else if (fileType === 'video') {
        data.fileType = "mp4"; // Assuming most videos are MP4
      }

      toast({
        title: "Upload successful",
        description: `${
          fileType === "image"
            ? "Image"
            : fileType === "video"
              ? "Video"
              : isDicomFile(selectedFile)
                ? "DICOM file"
                : "Radiology file"
        } has been uploaded.`,
      });

      // Call the callback with the uploaded file data
      onUploadComplete(data);

      // Reset the component state
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleYoutubeUrlSubmit = (youtubeUrl: string, videoId: string) => {
    // Call the callback with the YouTube video data
    onUploadComplete({
      url: youtubeUrl,
      fileName: "YouTube Video",
      type: "video",
      videoType: "youtube"
    });

    toast({
      title: "YouTube video added",
      description: "YouTube video has been added to your procedure.",
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Check file type
    if (!allowedTypes[fileType].includes(file.type) &&
        !(fileType === 'radiology' && (file.name.endsWith('.zip') || file.name.endsWith('.dcm')))) {
      toast({
        title: "Invalid file type",
        description: `Please select a valid ${fileType} file.`,
        variant: "destructive",
      });
      return;
    }

    // Check file size
    if (file.size > maxSizeInBytes[fileType]) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSizeFormatted[fileType]}.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);

    // Create a preview URL for the file (images and videos only)
    if (fileType !== 'radiology' || file.type.startsWith('image/')) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    } else if (file.name.endsWith('.zip') || isDicomFile(file)) {
      // For ZIP or DICOM files, we can just show the file name
      setPreviewUrl(null);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Determine the file accept attribute based on fileType
  const getAcceptTypes = () => {
    switch (fileType) {
      case 'image':
        return 'image/jpeg,image/png,image/gif,.jpg,.jpeg,.png,.gif';
      case 'video':
        return 'video/mp4,video/webm,video/avi,video/quicktime,video/x-matroska,.mp4,.webm,.avi,.mov,.mkv';
      case 'radiology':
        return 'image/jpeg,image/png,image/dicom,application/dicom,application/zip,application/x-zip-compressed,.jpg,.jpeg,.png,.dcm,.zip';
      default:
        return '';
    }
  };

  // Special rendering for radiology files without preview
  const renderFilePreview = () => {
    if (!selectedFile) return null;

    if (previewUrl) {
      if (fileType === "image" || (fileType === "radiology" && selectedFile.type.startsWith('image/'))) {
        return (
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-32 max-w-full rounded-md object-contain"
          />
        );
      } else if (fileType === "video") {
        return (
          <video
            src={previewUrl}
            controls
            className="max-h-32 max-w-full rounded-md"
          />
        );
      }
    }

    if (fileType === "radiology" && (selectedFile.name.endsWith('.dcm') || isDicomFile(selectedFile))) {
      return (
        <div className="flex flex-col items-center justify-center p-4 border rounded bg-slate-50">
          <FileImage className="h-8 w-8 text-slate-400 mb-2" />
          <span className="text-sm font-medium">DICOM File</span>
          <span className="text-xs text-slate-500 mt-1">Preview not available</span>
        </div>
      );
    }

    return null;
  };

  // Only show the YouTube option for video uploads
  if (fileType === "video") {
    return (
      <div className={`w-full ${className}`}>
        <Tabs defaultValue="file" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="file">Upload Video File</TabsTrigger>
            <TabsTrigger value="youtube">YouTube Link</TabsTrigger>
          </TabsList>

          <TabsContent value="file">
            {!selectedFile ? (
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 text-muted-foreground mb-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  <p>Upload Video</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {placeholderText[fileType]}
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={getAcceptTypes()}
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium truncate max-w-xs">{selectedFile.name}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelUpload}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {previewUrl && (
                  <div className="mb-2 flex justify-center">
                    <video
                      src={previewUrl}
                      controls
                      className="max-h-32 max-w-full rounded-md"
                    />
                  </div>
                )}

                {isUploading && (
                  <div className="w-full bg-secondary rounded-full h-2.5 mb-2">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    size="sm"
                    className="ml-auto"
                  >
                    {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isUploading ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="youtube">
            <div className="border rounded-lg p-4">
              <YouTubeUrlInput onSubmit={handleYoutubeUrlSubmit} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // For non-video file types, use the original component rendering
  return (
    <div className={`w-full ${className}`}>
      {!selectedFile ? (
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-muted-foreground mb-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <p>Upload {
              fileType === "image"
                ? "Image"
                : fileType === "video"
                  ? "Video"
                  : "Radiology File"
            }</p>
            <p className="text-xs text-muted-foreground mt-1">
              {placeholderText[fileType]}
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={getAcceptTypes()}
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="font-medium truncate max-w-xs">{selectedFile.name}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelUpload}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="mb-2 flex justify-center">
            {renderFilePreview()}
          </div>

          {isUploading && (
            <div className="w-full bg-secondary rounded-full h-2.5 mb-2">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              size="sm"
              className="ml-auto"
            >
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
