"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProcedureForm } from "../../procedure-form";
import { ProcedureData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { AppErrorBoundary } from "@/components/app-error-boundary";

interface EditProcedureClientProps {
  procedure: ProcedureData;
  procedureId: string;
}

export default function EditProcedureClient({ procedure, procedureId }: EditProcedureClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (formData: Partial<ProcedureData>) => {
    setIsSaving(true);
    try {
      // In a real app, this would be an API call to update the procedure
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success toast
      toast({
        title: "Procedure updated",
        description: "The procedure has been successfully updated.",
      });

      // Navigate back to the procedure details page
      router.push(`/procedures/${procedureId}`);
    } catch (error: unknown) {
      console.error("Error updating procedure:", error);
      toast({
        title: "Error",
        description: "Failed to update the procedure. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to the procedure details page
    router.push(`/procedures/${procedureId}`);
  };

  return (
    <AppErrorBoundary section="edit-procedure">
      <ProcedureForm
        procedure={procedure}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSaving}
        submitButtonText="Update Procedure"
      />
    </AppErrorBoundary>
  );
}
