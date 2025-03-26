// Remove "use client" to make it a server component
// Add a client wrapper component

import React from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProcedureForm } from "../../procedure-form";
import { FileItem, ProcedureData } from "@/lib/types";
import { AppErrorBoundary } from "@/components/app-error-boundary";
import { UnifiedMediaPlayer } from "@/components/unified-media-player";
import { ImageAnnotator } from "@/components/image-annotator";
import { BulkMediaUpload } from "@/components/bulk-media-upload";
import EditProcedureClient from "./edit-client";

// Mock procedure data (same as detail page)
const mockProcedure: ProcedureData = {
  id: "1",
  date: new Date("2025-03-10"),
  patientId: "P12345",
  patientName: "John Smith",
  patientAge: 54,
  patientGender: "Male",
  diagnosis: "Glioblastoma multiforme",
  procedureType: "Cranial",
  surgeonRole: "Lead",
  location: "Memorial Hospital",
  notes: "Performed a right frontal craniotomy for tumor resection. Used neuronavigation for precise localization. Gross total resection achieved. No intraoperative complications.",
  complications: "None",
  outcome: "Patient awoke without new neurological deficits. Post-op CT showed complete tumor resection without hemorrhage.",
  followUp: "Follow-up in clinic in 2 weeks. Will start adjuvant therapy as per oncology recommendation.",
  images: [
    { id: "img1", url: "https://placehold.co/600x400?text=Operative+Image+1", fileName: "Image 1", caption: "Exposure", type: "image" },
    { id: "img2", url: "https://placehold.co/600x400?text=Operative+Image+2", fileName: "Image 2", caption: "Tumor bed", type: "image" },
  ],
  videos: [],
  radiologyImages: [
    { id: "rad1", url: "https://placehold.co/600x400?text=MRI+Image", fileName: "MRI", caption: "Pre-operative T1 with contrast", type: "radiology" },
    { id: "rad2", url: "https://placehold.co/600x400?text=CT+Image", fileName: "CT", caption: "Post-operative", type: "radiology" },
  ],
  createdAt: new Date("2025-03-10"),
  updatedAt: new Date("2025-03-10"),
};

export default function EditProcedurePage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  // Unwrap params properly with React.use() if it's a promise
  const unwrappedParams = params instanceof Promise ? React.use(params) : params;
  const procedureId = unwrappedParams.id;

  // In a server component we could fetch data directly
  // For now, use mock data
  const procedure = {
    ...mockProcedure,
    id: procedureId,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <Link href={`/procedures/${procedureId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Procedure Details
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Edit Procedure</h1>
        <p className="text-muted-foreground">
          Update the details of this neurosurgical procedure.
        </p>
      </div>

      <div className="glass-card p-6">
        <EditProcedureClient procedure={procedure} procedureId={procedureId} />
      </div>
    </div>
  );
}
