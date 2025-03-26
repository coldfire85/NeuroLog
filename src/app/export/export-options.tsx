"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ExportService, ExportOptions as ExportOptionsType } from "./export-service";

// Mock data for procedures - in a real app, this would be fetched from the database
const mockProcedures = [
  {
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
    imageCount: 3,
    radiologyImageCount: 2,
    createdAt: new Date("2025-03-10"),
    updatedAt: new Date("2025-03-10"),
  },
  {
    id: "2",
    date: new Date("2025-03-08"),
    patientId: "P12346",
    patientName: "Sarah Johnson",
    patientAge: 43,
    patientGender: "Female",
    diagnosis: "Lumbar disc herniation L4-L5",
    procedureType: "Spinal",
    surgeonRole: "Lead",
    location: "University Medical Center",
    notes: "Performed L4-L5 discectomy via posterior approach. Confirmed herniation intraoperatively. Adequate decompression achieved.",
    complications: "None",
    outcome: "Immediate relief of radicular pain. Motor function intact.",
    followUp: "Follow-up in 2 weeks. Physical therapy to start in 1 week.",
    imageCount: 5,
    radiologyImageCount: 3,
    createdAt: new Date("2025-03-08"),
    updatedAt: new Date("2025-03-08"),
  },
  {
    id: "3",
    date: new Date("2025-03-05"),
    patientId: "P12347",
    patientName: "David Williams",
    patientAge: 62,
    patientGender: "Male",
    diagnosis: "Anterior communicating artery aneurysm",
    procedureType: "Vascular",
    surgeonRole: "Assistant",
    location: "Memorial Hospital",
    notes: "Assisted in anterior communicating artery aneurysm clipping. Standard pterional approach. Aneurysm successfully clipped.",
    complications: "Mild vasospasm, treated with nimodipine.",
    outcome: "Patient stable postoperatively. No new deficits.",
    followUp: "ICU for 48 hours, then regular neurosurgical unit. Follow-up angiogram scheduled.",
    imageCount: 6,
    radiologyImageCount: 4,
    createdAt: new Date("2025-03-05"),
    updatedAt: new Date("2025-03-05"),
  },
];

export function ExportOptions() {
  const [options, setOptions] = useState<ExportOptionsType>({
    includePatientDetails: true,
    includeDiagnosis: true,
    includeNotes: true,
    includeComplicationsOutcome: true,
    includeImages: false,
    dateFormat: "MM/DD/YYYY",
    exportFormat: "xlsx",
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleOptionChange = (key: keyof ExportOptionsType, value: boolean | string) => {
    setOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // In a real app, this would fetch procedures from the API
      const procedures = mockProcedures;

      let fileName;
      if (options.exportFormat === "xlsx") {
        fileName = await ExportService.exportToExcel(procedures, options);
      } else if (options.exportFormat === "pdf") {
        fileName = await ExportService.exportToPDF(procedures, options);
      } else {
        fileName = await ExportService.exportToCSV(procedures, options);
      }

      toast({
        title: "Export Successful",
        description: `Your data has been exported to ${fileName}`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Data to Include</h3>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="patientDetails"
                checked={options.includePatientDetails}
                onCheckedChange={(checked) =>
                  handleOptionChange("includePatientDetails", checked === true)
                }
              />
              <Label htmlFor="patientDetails">Patient Details</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="diagnosis"
                checked={options.includeDiagnosis}
                onCheckedChange={(checked) =>
                  handleOptionChange("includeDiagnosis", checked === true)
                }
              />
              <Label htmlFor="diagnosis">Diagnosis</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notes"
                checked={options.includeNotes}
                onCheckedChange={(checked) =>
                  handleOptionChange("includeNotes", checked === true)
                }
              />
              <Label htmlFor="notes">Procedure Notes</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="complicationsOutcome"
                checked={options.includeComplicationsOutcome}
                onCheckedChange={(checked) =>
                  handleOptionChange("includeComplicationsOutcome", checked === true)
                }
              />
              <Label htmlFor="complicationsOutcome">Complications & Outcome</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="images"
                checked={options.includeImages}
                onCheckedChange={(checked) =>
                  handleOptionChange("includeImages", checked === true)
                }
              />
              <Label htmlFor="images">Image References</Label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Export Format</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Select
                value={options.dateFormat}
                onValueChange={(value) => handleOptionChange("dateFormat", value)}
              >
                <SelectTrigger id="dateFormat">
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exportFormat">File Format</Label>
              <Select
                value={options.exportFormat}
                onValueChange={(value) => handleOptionChange("exportFormat", value)}
              >
                <SelectTrigger id="exportFormat">
                  <SelectValue placeholder="Select export format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                  <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={handleExport} disabled={isExporting}>
          {isExporting ? "Exporting..." : "Export Data"}
        </Button>
      </div>
    </div>
  );
}
