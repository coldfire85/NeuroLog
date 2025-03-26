"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Square,
  Circle,
  Type,
  ArrowRight,
  Trash2,
  Undo,
  Save,
  Download,
  Eraser,
  Image as ImageIcon
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Tool = "arrow" | "rectangle" | "circle" | "text" | "freehand" | "eraser";
type Annotation = {
  id: string;
  type: Tool;
  points: number[][];
  color: string;
  lineWidth: number;
  text?: string;
};

interface ImageAnnotatorProps {
  imageUrl: string;
  initialAnnotations?: Annotation[];
  onSave?: (annotations: Annotation[], dataUrl: string) => void;
  readOnly?: boolean;
  className?: string;
}

export function ImageAnnotator({
  imageUrl,
  initialAnnotations = [],
  onSave,
  readOnly = false,
  className,
}: ImageAnnotatorProps) {
  // State
  const [annotations, setAnnotations] = useState<Annotation[]>(initialAnnotations);
  const [currentTool, setCurrentTool] = useState<Tool>("freehand");
  const [currentColor, setCurrentColor] = useState("#FF0000");
  const [currentLineWidth, setCurrentLineWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null);
  const [textInput, setTextInput] = useState("");
  const [textPosition, setTextPosition] = useState<[number, number] | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set up the canvas when the image loads
  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    const handleImageLoad = () => {
      setImageLoaded(true);
      if (image && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        // Calculate the scale to fit the image within the container
        const scaleX = containerWidth / image.naturalWidth;
        const scaleY = containerHeight / image.naturalHeight;
        const scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 100%

        // Set canvas dimensions based on scaled image
        const width = image.naturalWidth * scale;
        const height = image.naturalHeight * scale;
        setCanvasSize({ width, height });
      }
    };

    image.onload = handleImageLoad;
    if (image.complete) handleImageLoad();

    return () => {
      image.onload = null;
    };
  }, [imageUrl]);

  // Render annotations whenever they change
  useEffect(() => {
    if (!canvasRef.current || !imageLoaded || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the image first
    if (imageRef.current) {
      ctx.drawImage(
        imageRef.current,
        0,
        0,
        canvasSize.width,
        canvasSize.height
      );
    }

    // Draw all annotations
    annotations.forEach((annotation) => {
      ctx.strokeStyle = annotation.color;
      ctx.fillStyle = annotation.color;
      ctx.lineWidth = annotation.lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      switch (annotation.type) {
        case "freehand":
          if (annotation.points.length < 2) return;
          ctx.beginPath();
          ctx.moveTo(annotation.points[0][0], annotation.points[0][1]);
          for (let i = 1; i < annotation.points.length; i++) {
            ctx.lineTo(annotation.points[i][0], annotation.points[i][1]);
          }
          ctx.stroke();
          break;

        case "rectangle":
          if (annotation.points.length < 2) return;
          const [startX, startY] = annotation.points[0];
          const [endX, endY] = annotation.points[1];
          ctx.beginPath();
          ctx.rect(
            startX,
            startY,
            endX - startX,
            endY - startY
          );
          ctx.stroke();
          break;

        case "circle":
          if (annotation.points.length < 2) return;
          const [cStartX, cStartY] = annotation.points[0];
          const [cEndX, cEndY] = annotation.points[1];
          const radius = Math.sqrt(
            Math.pow(cEndX - cStartX, 2) + Math.pow(cEndY - cStartY, 2)
          );
          ctx.beginPath();
          ctx.arc(cStartX, cStartY, radius, 0, 2 * Math.PI);
          ctx.stroke();
          break;

        case "arrow":
          if (annotation.points.length < 2) return;
          const [aStartX, aStartY] = annotation.points[0];
          const [aEndX, aEndY] = annotation.points[1];

          // Draw the line
          ctx.beginPath();
          ctx.moveTo(aStartX, aStartY);
          ctx.lineTo(aEndX, aEndY);
          ctx.stroke();

          // Draw the arrowhead
          const angle = Math.atan2(aEndY - aStartY, aEndX - aStartX);
          const arrowSize = 10 + annotation.lineWidth;

          ctx.beginPath();
          ctx.moveTo(aEndX, aEndY);
          ctx.lineTo(
            aEndX - arrowSize * Math.cos(angle - Math.PI / 6),
            aEndY - arrowSize * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(aEndX, aEndY);
          ctx.lineTo(
            aEndX - arrowSize * Math.cos(angle + Math.PI / 6),
            aEndY - arrowSize * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
          break;

        case "text":
          if (!annotation.text || annotation.points.length < 1) return;
          const [tX, tY] = annotation.points[0];
          ctx.font = `${annotation.lineWidth * 5}px Arial`;
          ctx.fillText(annotation.text, tX, tY);
          break;

        default:
          break;
      }
    });
  }, [annotations, imageLoaded, canvasSize]);

  // Update canvas size when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        const scaleX = containerWidth / imageRef.current.naturalWidth;
        const scaleY = containerHeight / imageRef.current.naturalHeight;
        const scale = Math.min(scaleX, scaleY, 1);

        const width = imageRef.current.naturalWidth * scale;
        const height = imageRef.current.naturalHeight * scale;
        setCanvasSize({ width, height });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === "text") {
      setTextPosition([x, y]);
      return;
    }

    // Create a new annotation
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type: currentTool,
      points: [[x, y]],
      color: currentColor,
      lineWidth: currentLineWidth,
    };

    setCurrentAnnotation(newAnnotation);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly || !currentAnnotation) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === "freehand") {
      // Add point for freehand drawing
      setCurrentAnnotation({
        ...currentAnnotation,
        points: [...currentAnnotation.points, [x, y]],
      });
    } else {
      // Update the end point for other shapes
      setCurrentAnnotation({
        ...currentAnnotation,
        points: [currentAnnotation.points[0], [x, y]],
      });
    }
  };

  const handleMouseUp = () => {
    if (readOnly) return;

    setIsDrawing(false);

    if (currentAnnotation) {
      if (currentTool === "text") {
        // Don't add text annotation here - it will be added when text is confirmed
      } else {
        // Add the annotation
        setAnnotations([...annotations, currentAnnotation]);
      }
    }

    setCurrentAnnotation(null);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!textPosition || !textInput.trim()) {
      setTextPosition(null);
      setTextInput("");
      return;
    }

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type: "text",
      points: [textPosition],
      color: currentColor,
      lineWidth: currentLineWidth,
      text: textInput.trim(),
    };

    setAnnotations([...annotations, newAnnotation]);
    setTextPosition(null);
    setTextInput("");
  };

  const handleTextCancel = () => {
    setTextPosition(null);
    setTextInput("");
  };

  const handleUndo = () => {
    if (annotations.length === 0) return;

    setAnnotations(annotations.slice(0, -1));
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all annotations?")) {
      setAnnotations([]);
    }
  };

  const handleSave = () => {
    if (!canvasRef.current || !onSave) return;

    const dataUrl = canvasRef.current.toDataURL("image/png");
    onSave(annotations, dataUrl);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const dataUrl = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "annotated-image.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Image is loaded off screen just to get dimensions */}
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Source"
        className="hidden"
        crossOrigin="anonymous"
      />

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium flex items-center">
          <ImageIcon className="mr-2 h-5 w-5" />
          Image Annotation
        </h3>

        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            title="Download"
          >
            <Download className="h-4 w-4" />
          </Button>

          {onSave && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              title="Save"
            >
              <Save className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {!readOnly && (
        <div className="flex flex-wrap items-center gap-2 mb-3 p-2 border rounded-md bg-gray-50">
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={currentTool === "freehand" ? "default" : "outline"}
              onClick={() => setCurrentTool("freehand")}
              title="Freehand Drawing"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={currentTool === "rectangle" ? "default" : "outline"}
              onClick={() => setCurrentTool("rectangle")}
              title="Rectangle"
            >
              <Square className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={currentTool === "circle" ? "default" : "outline"}
              onClick={() => setCurrentTool("circle")}
              title="Circle"
            >
              <Circle className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={currentTool === "arrow" ? "default" : "outline"}
              onClick={() => setCurrentTool("arrow")}
              title="Arrow"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={currentTool === "text" ? "default" : "outline"}
              onClick={() => setCurrentTool("text")}
              title="Text"
            >
              <Type className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={currentTool === "eraser" ? "default" : "outline"}
              onClick={() => setCurrentTool("eraser")}
              title="Eraser"
            >
              <Eraser className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Label htmlFor="color" className="sr-only">Color</Label>
            <Input
              id="color"
              type="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              className="w-8 h-8 p-0.5 rounded"
            />

            <Select
              value={currentLineWidth.toString()}
              onValueChange={(value) => setCurrentLineWidth(parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue placeholder="Width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Thin</SelectItem>
                <SelectItem value="3">Medium</SelectItem>
                <SelectItem value="5">Thick</SelectItem>
                <SelectItem value="8">Extra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-1 ml-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={handleUndo}
              disabled={annotations.length === 0}
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClear}
              disabled={annotations.length === 0}
              title="Clear All"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className="relative flex-1 border rounded-md overflow-hidden bg-gray-100 flex items-center justify-center"
      >
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className={`max-w-full max-h-full ${!readOnly ? "cursor-crosshair" : ""}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {textPosition && (
          <div
            className="absolute bg-white border p-2 rounded-md shadow-md"
            style={{
              left: textPosition[0] + "px",
              top: textPosition[1] + "px",
            }}
          >
            <form onSubmit={handleTextSubmit} className="flex gap-2">
              <Input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text"
                autoFocus
                className="w-40"
              />
              <div className="flex gap-1">
                <Button type="submit" size="sm">Add</Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleTextCancel}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
