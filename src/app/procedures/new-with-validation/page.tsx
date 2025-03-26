"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProcedureFormWithValidation } from "../procedure-form-with-validation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProcedureData } from "@/lib/types";

export default function NewProcedureWithValidationPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: Partial<ProcedureData>) => {
    try {
      // Simulate saving procedure
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      toast({
        title: "Procedure saved",
        description: "Your procedure has been saved successfully.",
      });

      // Redirect to procedures list
      router.push("/procedures");
    } catch (error: unknown) {
      // Show error message
      toast({
        title: "Error",
        description: "Failed to save procedure. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href="/procedures">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Procedures
          </Button>
        </Link>
        <div className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
          With Real-time Validation
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">New Procedure</h1>
        <p className="text-muted-foreground">
          Record a new neurosurgical procedure with real-time form validation.
        </p>
      </div>

      <div className="glass-card p-6">
        <ProcedureFormWithValidation
          onSubmit={handleSubmit}
          onCancel={() => router.push("/procedures")}
        />
      </div>
    </div>
  );
}
