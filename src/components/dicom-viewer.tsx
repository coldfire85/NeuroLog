"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, Maximize2, MinusCircle, PlusCircle } from "lucide-react";

// Cornerstone imports
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as cornerstoneTools from "cornerstone-tools";
import * as dicomParser from "dicom-parser";

// Register external modules
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstone.Math;

// Initialize tools
cornerstoneTools.init({
  showSVGCursors: true,
});

interface DicomViewerProps {
  file: {
    url: string;
    fileName?: string;
    caption?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

// Define types for annotations
interface Annotation {
  uuid: string;
  data: {
    handles: {
      start: { x: number; y: number };
      end?: { x: number; y: number };
      points?: Array<{ x: number; y: number }>;
    };
    invalidated: boolean;
    active: boolean;
    color: string;
    [key: string]: unknown;
  };
}

export function DicomViewer({ file, isOpen, onClose }: DicomViewerProps) {
  const dicomElement = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewport, setViewport] = useState<cornerstone.Viewport | null>(null);
  const [windowWidth, setWindowWidth] = useState(400);
  const [windowCenter, setWindowCenter] = useState(200);
  const [isDeviceWarningShown, setIsDeviceWarningShown] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Enable element on mount
  useEffect(() => {
    if (!isOpen || !dicomElement.current) return;

    const isMobileDevice = window.innerWidth < 768;
    const isOlderDevice = !window.navigator.hardwareConcurrency || window.navigator.hardwareConcurrency < 4;

    if (isMobileDevice || isOlderDevice) {
      setIsDeviceWarningShown(true);
    }

    // Save the current ref value to a variable to use in cleanup
    const element = dicomElement.current;

    // Enable the element
    try {
      cornerstone.enable(element);

      // Load the image
      setIsLoading(true);
      setError(null);
      cornerstone.loadAndCacheImage(`wadouri:${file.url}`)
        .then((image) => {
          // Display the image
          const viewport = cornerstone.getDefaultViewportForImage(element, image);
          cornerstone.displayImage(element, image, viewport);
          setViewport(viewport);

          // Add tools
          cornerstoneTools.addToolForElement(element, cornerstoneTools.ZoomTool);
          cornerstoneTools.addToolForElement(element, cornerstoneTools.PanTool);
          cornerstoneTools.addToolForElement(element, cornerstoneTools.WwwcTool);
          cornerstoneTools.setToolActiveForElement(element, 'Wwwc', { mouseButtonMask: 1 });

          setWindowWidth(viewport.voi.windowWidth);
          setWindowCenter(viewport.voi.windowCenter);
          setIsLoading(false);
        })
        .catch((error: Error) => {
          console.error('Error loading DICOM image:', error);
          setError("Failed to load DICOM image. Please ensure the file is a valid DICOM file.");
          setIsLoading(false);
        });
    } catch (error) {
      console.error('Error in cornerstone setup:', error);
      setError("Failed to initialize DICOM viewer. Please check your browser compatibility.");
      setIsLoading(false);
    }

    // Clean up on unmount
    return () => {
      if (element) {
        try {
          cornerstone.disable(element);
        } catch (error) {
          console.error('Error disabling cornerstone element:', error);
        }
      }
    };
  }, [isOpen, file.url]);

  // Handle window width/center changes
  useEffect(() => {
    if (!viewport || !dicomElement.current) return;

    const updatedViewport = {
      ...viewport,
      voi: {
        windowWidth,
        windowCenter
      }
    };

    try {
      cornerstone.setViewport(dicomElement.current, updatedViewport);
      setViewport(updatedViewport);
    } catch (error) {
      console.error('Error updating viewport:', error);
    }
  }, [windowWidth, windowCenter, viewport]);

  const handleZoom = (direction: 'in' | 'out') => {
    if (!dicomElement.current || !viewport) return;

    const delta = direction === 'in' ? 0.1 : -0.1;
    const updatedViewport = {
      ...viewport,
      scale: viewport.scale + delta
    };

    try {
      cornerstone.setViewport(dicomElement.current, updatedViewport);
      setViewport(updatedViewport);
    } catch (error) {
      console.error('Error zooming:', error);
    }
  };

  const handleRotate = (direction: 'cw' | 'ccw') => {
    if (!dicomElement.current || !viewport) return;

    const delta = direction === 'cw' ? 90 : -90;
    const updatedViewport = {
      ...viewport,
      rotation: (viewport.rotation + delta) % 360
    };

    try {
      cornerstone.setViewport(dicomElement.current, updatedViewport);
      setViewport(updatedViewport);
    } catch (error) {
      console.error('Error rotating:', error);
    }
  };

  const handleReset = () => {
    if (!dicomElement.current) return;

    try {
      cornerstone.reset(dicomElement.current);
      const newViewport = cornerstone.getViewport(dicomElement.current);
      setViewport(newViewport);
      setWindowWidth(newViewport.voi.windowWidth);
      setWindowCenter(newViewport.voi.windowCenter);
    } catch (error) {
      console.error('Error resetting view:', error);
    }
  };

  const handleWindowLevelChange = (type: 'width' | 'center', value: number) => {
    if (type === 'width') {
      setWindowWidth(value);
    } else {
      setWindowCenter(value);
    }
  };

  // Device warning dialog
  const DeviceWarningDialog = () => (
    <Dialog open={isDeviceWarningShown} onOpenChange={setIsDeviceWarningShown}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Performance Warning</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Your device may have limited processing power for viewing DICOM images. You may experience slower performance or lag while using the viewer.</p>
          <p className="mt-2">Would you like to continue anyway?</p>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Close Viewer</Button>
          <Button onClick={() => setIsDeviceWarningShown(false)}>Continue</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{file.caption || file.fileName || "DICOM Viewer"}</DialogTitle>
        </DialogHeader>

        {/* Device warning */}
        <DeviceWarningDialog />

        <div className="flex-1 overflow-hidden p-2 flex flex-col">
          {error ? (
            <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-md">
              <div className="text-center text-red-600">
                <p>{error}</p>
                <Button className="mt-4" onClick={onClose}>Close</Button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-md">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4">Loading DICOM image...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a moment depending on file size</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 bg-black rounded-md overflow-hidden">
                <div ref={dicomElement} className="w-full h-full dicom-viewer" />
              </div>

              <div className="mt-4 border rounded-md p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Window Width</label>
                    <div className="flex items-center gap-2 mt-1">
                      <MinusCircle
                        className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                        onClick={() => handleWindowLevelChange('width', Math.max(1, windowWidth - 10))}
                      />
                      <Slider
                        value={[windowWidth]}
                        min={1}
                        max={2000}
                        step={1}
                        onValueChange={(value) => handleWindowLevelChange('width', value[0])}
                      />
                      <PlusCircle
                        className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                        onClick={() => handleWindowLevelChange('width', Math.min(2000, windowWidth + 10))}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Window Center</label>
                    <div className="flex items-center gap-2 mt-1">
                      <MinusCircle
                        className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                        onClick={() => handleWindowLevelChange('center', Math.max(-1000, windowCenter - 10))}
                      />
                      <Slider
                        value={[windowCenter]}
                        min={-1000}
                        max={1000}
                        step={1}
                        onValueChange={(value) => handleWindowLevelChange('center', value[0])}
                      />
                      <PlusCircle
                        className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                        onClick={() => handleWindowLevelChange('center', Math.min(1000, windowCenter + 10))}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-4 space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleZoom('in')}
                    title="Zoom In"
                  >
                    <ZoomIn className="h-4 w-4 mr-1" /> Zoom In
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleZoom('out')}
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-4 w-4 mr-1" /> Zoom Out
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRotate('cw')}
                    title="Rotate Clockwise"
                  >
                    <RotateCw className="h-4 w-4 mr-1" /> Rotate CW
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRotate('ccw')}
                    title="Rotate Counter-clockwise"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" /> Rotate CCW
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleReset}
                    title="Reset View"
                  >
                    <Maximize2 className="h-4 w-4 mr-1" /> Reset
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
