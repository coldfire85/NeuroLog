"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, CheckCircle2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Field definition with display info
interface FieldMapping {
  sourceField: string;
  targetField: string;
  isRequired: boolean;
  description: string;
  options?: string[];
  example: string;
}

interface ExcelFieldMapperProps {
  sourceFields: string[];
  onMappingConfirmed: (mapping: Record<string, string>) => void;
  onCancel: () => void;
}

export function ExcelFieldMapper({ sourceFields, onMappingConfirmed, onCancel }: ExcelFieldMapperProps) {
  // Available target fields that the app expects - wrapped in useMemo to avoid dependency changes
  const defaultTargetFields = useMemo<FieldMapping[]>(() => [
    {
      sourceField: "",
      targetField: "patientName",
      isRequired: true,
      description: "Full name of the patient",
      example: "John Smith"
    },
    {
      sourceField: "",
      targetField: "patientId",
      isRequired: true,
      description: "Patient identification number",
      example: "P12345"
    },
    {
      sourceField: "",
      targetField: "patientAge",
      isRequired: false,
      description: "Patient's age (numeric)",
      example: "54"
    },
    {
      sourceField: "",
      targetField: "patientGender",
      isRequired: false,
      description: "Patient's gender",
      example: "Male/Female/Other"
    },
    {
      sourceField: "",
      targetField: "date",
      isRequired: true,
      description: "Date of procedure (YYYY-MM-DD)",
      example: "2025-03-10"
    },
    {
      sourceField: "",
      targetField: "diagnosis",
      isRequired: false,
      description: "Patient's diagnosis",
      example: "Glioblastoma multiforme"
    },
    {
      sourceField: "",
      targetField: "procedureType",
      isRequired: true,
      description: "Type of neurosurgical procedure",
      options: ["Cranial", "Spinal", "Functional", "Vascular", "Pediatric", "Other"],
      example: "Cranial"
    },
    {
      sourceField: "",
      targetField: "surgeonRole",
      isRequired: false,
      description: "Your role in the procedure",
      example: "Lead/Assistant/Observer"
    },
    {
      sourceField: "",
      targetField: "location",
      isRequired: false,
      description: "Hospital or facility name",
      example: "Memorial Hospital"
    },
    {
      sourceField: "",
      targetField: "notes",
      isRequired: false,
      description: "Additional procedural notes",
      example: "Patient underwent craniotomy..."
    },
    {
      sourceField: "",
      targetField: "complications",
      isRequired: false,
      description: "Any complications during procedure",
      example: "None"
    },
    {
      sourceField: "",
      targetField: "outcome",
      isRequired: false,
      description: "Procedure outcome",
      example: "Patient recovered well..."
    },
    {
      sourceField: "",
      targetField: "followUp",
      isRequired: false,
      description: "Follow-up information",
      example: "Follow-up appointment in 2 weeks"
    }
  ], []); // Empty dependency array as these values never change

  // State for field mappings
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>(() =>
    // Initialize with a copy of the default fields
    defaultTargetFields.map(field => ({ ...field }))
  );
  const initialMappingDone = useRef(false);

  // Try to automatically map fields that seem to match - runs once when sourceFields change
  useEffect(() => {
    if (sourceFields.length === 0 || initialMappingDone.current) return;

    // We need to create a new array to avoid modifying state directly
    const newMappings = defaultTargetFields.map(mapping => ({...mapping}));

    // Try to auto-map fields with exact or close matches
    newMappings.forEach((mapping) => {
      // Default is empty (unmapped)
      mapping.sourceField = "";

      // Look for exact matches (case insensitive)
      const exactMatch = sourceFields.find(
        field => field.toLowerCase() === mapping.targetField.toLowerCase()
      );
      if (exactMatch) {
        mapping.sourceField = exactMatch;
        return;
      }

      // Look for matches with spaces (e.g., "Patient Name" for "patientName")
      const spacedFieldName = mapping.targetField
        .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
        .replace(/^./, str => str.toUpperCase()); // Capitalize first letter

      const spacedMatch = sourceFields.find(
        field => field.toLowerCase() === spacedFieldName.toLowerCase()
      );
      if (spacedMatch) {
        mapping.sourceField = spacedMatch;
        return;
      }

      // Look for partial matches
      const partialMatch = sourceFields.find(
        field => field.toLowerCase().includes(mapping.targetField.toLowerCase())
      );
      if (partialMatch) {
        mapping.sourceField = partialMatch;
      }
    });

    setFieldMappings(newMappings);
    initialMappingDone.current = true;
  }, [sourceFields, defaultTargetFields]);

  // Handle selection change
  const handleMappingChange = (targetField: string, sourceField: string) => {
    const newMappings = fieldMappings.map(mapping => {
      // If this sourceField is already selected elsewhere, unmap it from that location
      if (mapping.sourceField === sourceField && mapping.targetField !== targetField) {
        return { ...mapping, sourceField: "" };
      }

      // Set the new mapping
      if (mapping.targetField === targetField) {
        return { ...mapping, sourceField };
      }

      return mapping;
    });

    setFieldMappings(newMappings);
  };

  // Reset the field mapping process
  const resetMapping = () => {
    // Reset to empty mappings
    setFieldMappings(defaultTargetFields.map(field => ({ ...field, sourceField: "" })));
    initialMappingDone.current = false;

    // Rerun the auto-mapping
    if (sourceFields.length > 0) {
      const newMappings = defaultTargetFields.map(mapping => ({...mapping, sourceField: ""}));

      // Same logic as in the useEffect
      newMappings.forEach((mapping) => {
        // Try exact matches
        const exactMatch = sourceFields.find(
          field => field.toLowerCase() === mapping.targetField.toLowerCase()
        );
        if (exactMatch) {
          mapping.sourceField = exactMatch;
          return;
        }

        // Try spaced matches
        const spacedFieldName = mapping.targetField
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());

        const spacedMatch = sourceFields.find(
          field => field.toLowerCase() === spacedFieldName.toLowerCase()
        );
        if (spacedMatch) {
          mapping.sourceField = spacedMatch;
          return;
        }

        // Try partial matches
        const partialMatch = sourceFields.find(
          field => field.toLowerCase().includes(mapping.targetField.toLowerCase())
        );
        if (partialMatch) {
          mapping.sourceField = partialMatch;
        }
      });

      setFieldMappings(newMappings);
    }
  };

  // Check if all required fields are mapped
  const areRequiredFieldsMapped = () => {
    return fieldMappings
      .filter(mapping => mapping.isRequired)
      .every(mapping => mapping.sourceField !== "");
  };

  // Generate the final mapping for the parent component
  const generateMapping = (): Record<string, string> => {
    const mapping: Record<string, string> = {};
    fieldMappings.forEach(field => {
      if (field.sourceField) {
        mapping[field.sourceField] = field.targetField;
      }
    });
    return mapping;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Map Your Excel Columns
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
          <p>We detected columns in your Excel file that need to be mapped to our system fields.</p>
          <p className="mt-2">For each field below, select the corresponding column from your Excel file.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md">
            <div className="w-1/3 font-medium">Your Excel Column</div>
            <div className="w-1/3 font-medium">Maps To</div>
            <div className="w-1/3 font-medium">Description</div>
          </div>

          {fieldMappings.map((field, index) => (
            <div
              key={field.targetField}
              className={`flex items-center gap-2 p-4 rounded-md border ${
                field.isRequired ?
                  field.sourceField ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"
                  : "border-gray-200"
              }`}
            >
              <div className="w-1/3">
                <Select
                  value={field.sourceField || ""}
                  onValueChange={(value) => handleMappingChange(field.targetField, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Not mapped</SelectItem>
                    {sourceFields.map((sourceField) => (
                      <SelectItem key={sourceField} value={sourceField}>
                        {sourceField}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-1/3 flex items-center gap-2">
                {field.targetField}
                {field.isRequired && (
                  <Badge variant="outline" className="text-xs font-normal">
                    Required
                  </Badge>
                )}
                {field.sourceField && field.isRequired && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
                {!field.sourceField && field.isRequired && (
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                )}
              </div>

              <div className="w-1/3 text-sm text-gray-600">
                <div>
                  {field.description}
                  {field.options && (
                    <div className="text-xs mt-1">
                      Options: {field.options.join(', ')}
                    </div>
                  )}
                  <div className="text-xs mt-1 italic">
                    Example: {field.example}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between gap-2 mt-4">
          <Button variant="ghost" onClick={resetMapping}>
            Auto-Map Again
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={() => onMappingConfirmed(generateMapping())}
              disabled={!areRequiredFieldsMapped()}
            >
              {areRequiredFieldsMapped()
                ? "Confirm Mapping"
                : "Map All Required Fields"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
