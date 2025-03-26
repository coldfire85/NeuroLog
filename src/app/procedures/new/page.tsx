import { ProcedureForm } from "../procedure-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewProcedurePage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Procedure</h1>
          <p className="text-muted-foreground">
            Add a new neurosurgical procedure to your logbook.
          </p>
        </div>
        <Link href="/procedures">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      <div className="glass-card p-6">
        <ProcedureForm />
      </div>
    </div>
  );
}
