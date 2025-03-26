"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { FileGallery } from "@/components/file-gallery";
import { FileItem } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function DicomViewerDemo() {
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([
    // Pre-loaded sample files that we downloaded
    {
      url: "/sample-data/sample-dicom.dcm",
      fileName: "VR-2022.dcm",
      type: "radiology",
      fileType: "dicom",
      caption: "DICOM Standard Conformance Test"
    },
    {
      url: "/sample-data/brain-dicom.dcm",
      fileName: "segmented_us.dcm",
      type: "radiology",
      fileType: "dicom",
      caption: "Segmented Palette DICOM"
    }
  ]);

  const handleUploadComplete = (fileData: {
    url: string;
    fileName: string;
    type: string;
    fileType?: string;
  }) => {
    const newFile: FileItem = {
      url: fileData.url,
      fileName: fileData.fileName,
      type: fileData.type,
      fileType: fileData.fileType,
      caption: `${fileData.fileName} (${new Date().toLocaleString()})`
    };

    setUploadedFiles((prevFiles) => [...prevFiles, newFile]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">DICOM Viewer Demonstration</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>About DICOM Viewer</CardTitle>
            <CardDescription>
              A specialized viewer for DICOM medical imaging files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              DICOM (Digital Imaging and Communications in Medicine) is the standard format for
              storing and transmitting medical images. Our viewer offers several key features:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Progressive loading for large files</li>
              <li>Window width/center adjustment</li>
              <li>Zoom and rotation controls</li>
              <li>Device performance detection</li>
              <li>Client-side processing to maintain privacy</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upload DICOM File</CardTitle>
            <CardDescription>
              Upload your own DICOM file to test the viewer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload
              fileType="radiology"
              onUploadComplete={handleUploadComplete}
              className="mb-4"
            />
            <p className="text-sm text-muted-foreground mt-4">
              Note: All uploads are temporary and processed client-side for privacy.
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="gallery" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="gallery">File Gallery</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery">
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Radiology Files</h2>
            <FileGallery
              files={uploadedFiles}
              onRemove={handleRemoveFile}
            />
            {uploadedFiles.length === 0 && (
              <p className="text-center py-10 text-muted-foreground">
                No files uploaded yet. Upload a DICOM file above to test the viewer.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="instructions">
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">How to Use the DICOM Viewer</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Uploading DICOM Files</h3>
                <p>
                  Use the upload area to add a DICOM (.dcm) file. The system also accepts ZIP files
                  containing DICOM data.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Viewing DICOM Images</h3>
                <p>
                  Click on a DICOM file in the gallery to open the viewer. The viewer
                  will load and display the image data.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Adjusting Window/Level</h3>
                <p>
                  Use the Window Width and Window Center sliders to adjust the contrast and brightness
                  of the image for better visualization of different tissue types.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Zoom and Rotation</h3>
                <p>
                  The control buttons allow you to zoom in/out and rotate the image for better
                  examination of the data.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Integration with NeuroLog</h2>
        <p className="mb-4">
          The DICOM viewer is fully integrated with the NeuroLog neurosurgical logbook,
          allowing surgeons to view, annotate, and organize medical images alongside
          procedure details.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Main App
          </Button>
        </div>
      </div>
    </div>
  );
}
