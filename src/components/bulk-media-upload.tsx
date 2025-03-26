"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  FileImage,
  FileVideo,
  FileScan,       // Using FileScan for radiology/DICOM files
  Loader2,
  Trash2
} from "lucide-react";
import { ProgressBar } from "@/components/progress-bar";
import { FileItem } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BulkMediaUploadProps {
  onUploadComplete: (files: FileItem[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  className?: string;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  error?: string;
  status: "queued" | "uploading" | "completed" | "error";
  previewUrl?: string;
  type: "image" | "video" | "radiology";
  resultUrl?: string;
}

export function BulkMediaUpload({
  onUploadComplete,
  maxFiles = 10,
  acceptedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/webm",
    "image/dicom",
    "application/zip",
  ],
  className,
}: BulkMediaUploadProps) {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;

    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!e.dataTransfer.files || !e.dataTransfer.files.length) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  // Add files to queue
  const addFiles = (newFiles: File[]) => {
    // Validate file count
    if (files.length + newFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files at once.`);
      return;
    }

    // Process and validate each file
    const processedFiles: UploadingFile[] = newFiles
      .filter(file => {
        // Check file type
        const isValidType = acceptedFileTypes.includes(file.type) ||
                            (file.name.endsWith('.zip') && acceptedFileTypes.includes('application/zip')) ||
                            (file.name.endsWith('.dcm') && acceptedFileTypes.includes('image/dicom'));

        if (!isValidType) {
          console.warn(`File "${file.name}" has an invalid type: ${file.type}`);
          return false;
        }

        // Check if file already exists in queue
        const isDuplicate = files.some(existingFile =>
          existingFile.file.name === file.name &&
          existingFile.file.size === file.size
        );

        if (isDuplicate) {
          console.warn(`File "${file.name}" is already in the upload queue.`);
          return false;
        }

        return true;
      })
      .map(file => {
        // Determine file type
        let type: "image" | "video" | "radiology" = "image";
        if (file.type.startsWith("video/")) {
          type = "video";
        } else if (
          file.type === "image/dicom" ||
          file.name.endsWith('.dcm') ||
          file.type === "application/zip" ||
          file.name.endsWith('.zip')
        ) {
          type = "radiology";
        }

        // Create file preview
        let previewUrl: string | undefined;
        if (file.type.startsWith("image/") && !file.type.includes("dicom")) {
          previewUrl = URL.createObjectURL(file);
        }

        return {
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          progress: 0,
          status: "queued" as const,
          previewUrl,
          type,
        };
      });

    if (processedFiles.length === 0) return;

    setFiles(prev => [...prev, ...processedFiles]);
  };

  // Remove file from queue
  const removeFile = (id: string) => {
    setFiles(prevFiles => {
      const fileToRemove = prevFiles.find(f => f.id === id);
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prevFiles.filter(f => f.id !== id);
    });
  };

  // Upload all files
  const uploadFiles = async () => {
    if (files.length === 0 || isUploading) return;

    setIsUploading(true);

    const completedFiles: FileItem[] = [];

    // Process each file sequentially
    for (const file of files) {
      if (file.status === "completed") {
        // Skip already completed files
        if (file.resultUrl) {
          completedFiles.push({
            id: file.id,
            url: file.resultUrl,
            fileName: file.file.name,
            type: file.type,
          });
        }
        continue;
      }

      // Update file status
      setFiles(prev =>
        prev.map(f =>
          f.id === file.id
            ? { ...f, status: "uploading", progress: 0 }
            : f
        )
      );

      try {
        // Create form data
        const formData = new FormData();
        formData.append("file", file.file);
        formData.append("type", file.type);

        // Progress handler
        let lastProgress = 0;
        const progressInterval = setInterval(() => {
          lastProgress = Math.min(lastProgress + 5, 95);
          setFiles(prev =>
            prev.map(f =>
              f.id === file.id
                ? { ...f, progress: lastProgress }
                : f
            )
          );
        }, 200);

        // Send the file to the server
        const response = await fetch("/api/uploads", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const data = await response.json();

        // Update file status
        setFiles(prev =>
          prev.map(f =>
            f.id === file.id
              ? {
                  ...f,
                  status: "completed",
                  progress: 100,
                  resultUrl: data.url
                }
              : f
          )
        );

        // Add to completed files
        completedFiles.push({
          id: file.id,
          url: data.url,
          fileName: file.file.name,
          type: file.type,
        });
      } catch (error) {
        console.error("Error uploading file:", error);

        // Update file status
        setFiles(prev =>
          prev.map(f =>
            f.id === file.id
              ? {
                  ...f,
                  status: "error",
                  progress: 0,
                  error: error instanceof Error ? error.message : "Upload failed"
                }
              : f
          )
        );
      }
    }

    setIsUploading(false);

    if (completedFiles.length > 0) {
      onUploadComplete(completedFiles);
    }
  };

  // Clear all files
  const clearFiles = () => {
    // Revoke object URLs to prevent memory leaks
    files.forEach(file => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });

    setFiles([]);
  };

  // Get file icon based on file type
  const getFileIcon = (file: UploadingFile) => {
    switch (file.type) {
      case "image":
        return <FileImage className="h-5 w-5 text-blue-500" />;
      case "video":
        return <FileVideo className="h-5 w-5 text-green-500" />;
      case "radiology":
        return <FileScan className="h-5 w-5 text-purple-500" />;
      default:
        return <FileImage className="h-5 w-5" />;
    }
  };

  // Get status icon based on file status
  const getStatusIcon = (file: UploadingFile) => {
    switch (file.status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "uploading":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-base">Bulk Media Upload</Label>
        <div className="flex gap-2">
          {files.length > 0 && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={clearFiles}
                disabled={isUploading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
              <Button
                size="sm"
                onClick={uploadFiles}
                disabled={isUploading || files.length === 0 || files.every(f => f.status === "completed")}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload All
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6",
          isDragging ? "border-primary bg-primary/5" : "border-gray-300",
          "transition-colors cursor-pointer"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <h3 className="text-lg font-medium">Drag and drop files here</h3>
          <p className="text-sm text-gray-500 mt-1">
            or <span className="text-primary">browse</span> to upload
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Supported file types: Images, Videos, DICOM, ZIP
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            accept={acceptedFileTypes.join(",")}
            disabled={isUploading}
          />
        </div>
      </div>

      {files.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted py-2 px-4 font-medium text-sm">
            Files ({files.length})
          </div>
          <div className="max-h-80 overflow-y-auto">
            {files.map(file => (
              <div
                key={file.id}
                className="border-t flex items-center gap-3 p-3 hover:bg-gray-50"
              >
                <div className="flex-shrink-0">
                  {file.previewUrl ? (
                    <img
                      src={file.previewUrl}
                      alt={file.file.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      {getFileIcon(file)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <p className="text-sm font-medium truncate mr-2">
                      {file.file.name}
                    </p>
                    {getStatusIcon(file)}
                  </div>
                  {file.error && (
                    <p className="text-xs text-red-500 mt-0.5">{file.error}</p>
                  )}
                  {file.status === "uploading" && (
                    <ProgressBar progress={file.progress} />
                  )}
                  <p className="text-xs text-gray-500 mt-0.5">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  disabled={isUploading && file.status === "uploading"}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
