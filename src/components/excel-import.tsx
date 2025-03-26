"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet, Upload, AlertCircle, CheckCircle2, FileX, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';
import { ProcedureData } from '@/lib/types';
import { useNotifications } from '@/context/notification-context';
import { ExcelFieldMapper } from './excel-field-mapper';

interface ValidatedProcedure extends Partial<ProcedureData> {
  validationErrors?: string[];
  rowIndex?: number;
}

interface ExcelImportProps {
  onImport: (procedures: Partial<ProcedureData>[]) => Promise<void> | void;
  isLoading?: boolean;
}

export function ExcelImport({ onImport, isLoading = false }: ExcelImportProps) {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [importedData, setImportedData] = useState<ValidatedProcedure[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [hasValidData, setHasValidData] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Field mapping related state
  const [showFieldMapper, setShowFieldMapper] = useState(false);
  const [sourceFields, setSourceFields] = useState<string[]>([]);
  const [rawExcelData, setRawExcelData] = useState<Record<string, unknown>[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});

  const validateProcedureData = (procedures: Record<string, unknown>[]): ValidatedProcedure[] => {
    const requiredFields = ['patientName', 'patientId', 'date', 'procedureType'];
    const validProcedureTypes = ['Cranial', 'Spinal', 'Functional', 'Vascular', 'Pediatric', 'Other'];

    // Apply the field mapping to transform the data
    const transformedProcedures = procedures.map(row => {
      const transformedRow: Record<string, unknown> = {};

      // Apply field mapping
      if (Object.keys(fieldMapping).length > 0) {
        // If we have a field mapping, use it to transform the fields
        Object.entries(row).forEach(([key, value]) => {
          if (fieldMapping[key]) {
            transformedRow[fieldMapping[key]] = value;
          }
        });
      } else {
        // If no mapping, try to match fields as before (camel case and with spaces)
        Object.entries(row).forEach(([key, value]) => {
          // Try exact key match
          if (key in transformedRow) {
            transformedRow[key] = value;
          }
          // Try with first letter lowercase (camelCase)
          else {
            const camelCaseKey = key.charAt(0).toLowerCase() + key.slice(1);
            if (camelCaseKey in transformedRow) {
              transformedRow[camelCaseKey] = value;
            }
            // Try removing spaces and uppercase first letter of each word
            else {
              const spaceLessKey = key.replace(/\s+/g, '');
              const camelSpaceLessKey = spaceLessKey.charAt(0).toLowerCase() + spaceLessKey.slice(1);
              if (camelSpaceLessKey in transformedRow) {
                transformedRow[camelSpaceLessKey] = value;
              }
            }
          }
        });
      }

      return transformedRow;
    });

    return transformedProcedures.map((row, index) => {
      const procedure: ValidatedProcedure = {
        patientName: row.patientName as string || row['Patient Name'] as string,
        patientId: row.patientId as string || row['Patient ID'] as string,
        patientAge: parseInt(row.patientAge as string || row['Patient Age'] as string) || undefined,
        patientGender: row.patientGender as string || row['Patient Gender'] as string,
        date: row.date as string || row['Date'] as string,
        diagnosis: row.diagnosis as string || row['Diagnosis'] as string,
        procedureType: row.procedureType as string || row['Procedure Type'] as string,
        surgeonRole: row.surgeonRole as string || row['Surgeon Role'] as string,
        location: row.location as string || row['Location'] as string,
        notes: row.notes as string || row['Notes'] as string,
        complications: row.complications as string || row['Complications'] as string,
        outcome: row.outcome as string || row['Outcome'] as string,
        followUp: row.followUp as string || row['Follow-up'] as string,
        rowIndex: index + 2, // +2 for header row and 1-indexed
        validationErrors: [],
      };

      // Validate required fields
      requiredFields.forEach(field => {
        if (!procedure[field as keyof ValidatedProcedure]) {
          procedure.validationErrors?.push(`Row ${index + 2}: Missing required field: ${field}`);
        }
      });

      // Validate procedure type
      if (procedure.procedureType && !validProcedureTypes.includes(procedure.procedureType)) {
        procedure.validationErrors?.push(
          `Row ${index + 2}: Invalid procedure type: "${procedure.procedureType}". Must be one of: ${validProcedureTypes.join(', ')}`
        );
      }

      // Validate date
      if (procedure.date) {
        try {
          // If it's already a date object, it's valid
          if (!(procedure.date instanceof Date)) {
            // Try to parse the date
            const dateValue = new Date(procedure.date);
            if (isNaN(dateValue.getTime())) {
              procedure.validationErrors?.push(`Row ${index + 2}: Invalid date format: "${procedure.date}"`);
            } else {
              procedure.date = dateValue;
            }
          }
        } catch (error) {
          procedure.validationErrors?.push(`Row ${index + 2}: Invalid date format: "${procedure.date}"`);
        }
      }

      // Validate age as a number
      if (procedure.patientAge !== undefined && isNaN(procedure.patientAge)) {
        procedure.validationErrors?.push(`Row ${index + 2}: Patient age must be a number`);
      }

      return procedure;
    });
  };

  const processExcelFile = async (file: File) => {
    try {
      setIsValidating(true);
      setValidationErrors([]);
      setImportedData([]);
      setHasValidData(false);
      setShowFieldMapper(false);
      setSourceFields([]);
      setRawExcelData([]);
      setFieldMapping({});

      // Read the file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);

      // Get the first worksheet
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        setValidationErrors(['No data found in the Excel file']);
        setIsValidating(false);
        return;
      }

      // Extract column headers (sourceFields)
      const firstRow = jsonData[0];
      const headers = Object.keys(firstRow);
      setSourceFields(headers);
      setRawExcelData(jsonData as Record<string, unknown>[]);

      // Check if we can auto-match fields or need the mapper
      const hasStandardHeaders = headers.some(header => {
        // Check if any headers match our expected fields
        return ['patientName', 'Patient Name', 'patientId', 'Patient ID', 'date', 'Date', 'procedureType', 'Procedure Type'].includes(header);
      });

      if (!hasStandardHeaders) {
        // Show the field mapper for non-standard headers
        setShowFieldMapper(true);
        setIsValidating(false);
        toast({
          title: 'Column Mapping Required',
          description: 'Please map your Excel columns to our expected fields.',
        });
        return;
      }

      // Standard headers, continue with validation
      const validatedData = validateProcedureData(jsonData as Record<string, unknown>[]);

      // Collect all errors
      const allErrors: string[] = [];
      validatedData.forEach(procedure => {
        if (procedure.validationErrors && procedure.validationErrors.length > 0) {
          allErrors.push(...procedure.validationErrors);
        }
      });

      setValidationErrors(allErrors);
      setImportedData(validatedData);
      setHasValidData(validatedData.length > 0 && allErrors.length === 0);

      if (allErrors.length > 0) {
        toast({
          title: 'Validation Errors',
          description: `Found ${allErrors.length} errors in the imported data. Please fix them and try again.`,
          variant: 'destructive',
        });

        addNotification({
          title: 'Excel Import Validation Failed',
          message: `Found ${allErrors.length} errors in the imported data. Please check the import page for details.`,
          type: 'error',
        });
      } else {
        toast({
          title: 'Data Validated',
          description: `Successfully validated ${validatedData.length} procedures. Ready to import.`,
        });
      }
    } catch (error) {
      console.error('Error processing Excel file:', error);
      setValidationErrors([
        'Error processing Excel file. Please make sure it is a valid Excel file and try again.',
      ]);
      toast({
        title: 'Import Error',
        description: 'Failed to process the Excel file. Please check the file format.',
        variant: 'destructive',
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Handle field mapping confirmation
  const handleMappingConfirmed = (mapping: Record<string, string>) => {
    setFieldMapping(mapping);
    setShowFieldMapper(false);

    // Now validate the data with the mapping applied
    if (rawExcelData.length > 0) {
      const validatedData = validateProcedureData(rawExcelData);

      // Collect all errors
      const allErrors: string[] = [];
      validatedData.forEach(procedure => {
        if (procedure.validationErrors && procedure.validationErrors.length > 0) {
          allErrors.push(...procedure.validationErrors);
        }
      });

      setValidationErrors(allErrors);
      setImportedData(validatedData);
      setHasValidData(validatedData.length > 0 && allErrors.length === 0);

      if (allErrors.length > 0) {
        toast({
          title: 'Validation Errors',
          description: `Found ${allErrors.length} errors in the imported data after mapping fields.`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Data Validated',
          description: `Successfully validated ${validatedData.length} procedures. Ready to import.`,
        });
      }
    }
  };

  // Cancel field mapping
  const handleMappingCancelled = () => {
    setShowFieldMapper(false);
    setRawExcelData([]);
    setSourceFields([]);

    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    toast({
      title: 'Import Cancelled',
      description: 'You can try uploading a different Excel file.',
    });
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.type === 'application/vnd.ms-excel') {
        processExcelFile(file);
      } else {
        toast({
          title: 'Invalid File',
          description: 'Please upload an Excel file (.xlsx or .xls)',
          variant: 'destructive',
        });
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processExcelFile(files[0]);
    }
  };

  const handleImportClick = async () => {
    if (hasValidData && importedData.length > 0) {
      try {
        // Remove validation properties before passing to onImport
        const cleanData = importedData.map(procedure => {
          const { validationErrors, rowIndex, ...cleanProcedure } = procedure;
          return cleanProcedure;
        });

        await onImport(cleanData);

        // Reset the state
        setImportedData([]);
        setValidationErrors([]);
        setHasValidData(false);
        setShowFieldMapper(false);
        setSourceFields([]);
        setRawExcelData([]);
        setFieldMapping({});

        // Notify success
        addNotification({
          title: 'Import Successful',
          message: `Successfully imported ${cleanData.length} procedures.`,
          type: 'success',
        });
      } catch (error) {
        console.error('Error importing data:', error);
        toast({
          title: 'Import Failed',
          description: 'An error occurred while importing the data. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleCancelUpload = () => {
    setImportedData([]);
    setValidationErrors([]);
    setHasValidData(false);
    setShowFieldMapper(false);
    setSourceFields([]);
    setRawExcelData([]);
    setFieldMapping({});

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadTemplateFile = () => {
    const template = [
      {
        'Patient Name': 'John Smith',
        'Patient ID': 'P12345',
        'Patient Age': 54,
        'Patient Gender': 'Male',
        'Date': '2025-03-10',
        'Diagnosis': 'Glioblastoma multiforme',
        'Procedure Type': 'Cranial',
        'Surgeon Role': 'Lead',
        'Location': 'Memorial Hospital',
        'Notes': 'Patient underwent craniotomy for tumor resection.',
        'Complications': 'None',
        'Outcome': 'Patient recovered well from anesthesia.',
        'Follow-up': 'Follow-up appointment scheduled in 2 weeks.'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

    // Generate the Excel file
    XLSX.writeFile(workbook, 'procedure_import_template.xlsx');
  };

  // If showing field mapper, render that instead
  if (showFieldMapper) {
    return (
      <ExcelFieldMapper
        sourceFields={sourceFields}
        onMappingConfirmed={handleMappingConfirmed}
        onCancel={handleMappingCancelled}
      />
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Excel Import
        </CardTitle>
        <CardDescription>
          Import procedure data from an Excel file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Drag & drop area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center",
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20",
            (isValidating || isLoading) && "opacity-50 pointer-events-none"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".xlsx,.xls"
            onChange={handleFileInputChange}
            disabled={isValidating || isLoading}
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="font-medium text-lg">
              {isDragging ? 'Drop your Excel file here' : 'Click or drag & drop to upload'}
            </h3>
            <p className="text-sm text-muted-foreground">
              Upload an Excel file (.xlsx or .xls) containing procedure data
            </p>
            <p className="text-sm text-blue-600">
              Our system can now automatically map non-standard column headers!
            </p>

            <Button
              variant="outline"
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              disabled={isValidating || isLoading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Excel File
            </Button>
          </div>
        </div>

        {/* Download template button */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              downloadTemplateFile();
            }}
            disabled={isValidating || isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Import Template
          </Button>
        </div>

        {/* Validation results */}
        {validationErrors.length > 0 && (
          <div className="border rounded-lg p-4 bg-destructive/10 text-destructive">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-medium">Validation Errors</h3>
            </div>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              {validationErrors.slice(0, 10).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
              {validationErrors.length > 10 && (
                <li>...and {validationErrors.length - 10} more errors</li>
              )}
            </ul>
          </div>
        )}

        {/* Import success state */}
        {hasValidData && (
          <div className="border rounded-lg p-4 bg-green-100 text-green-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5" />
              <h3 className="font-medium">Data Validated</h3>
            </div>
            <p className="text-sm">
              Successfully validated {importedData.length} procedures. Ready to import.
            </p>
          </div>
        )}

        {/* Import data summary */}
        {importedData.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Import Summary</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {importedData.length} procedures found in the file.
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="font-medium">Procedure Types:</span>
                <ul className="list-disc pl-5">
                  {Object.entries(
                    importedData.reduce((acc, proc) => {
                      const type = proc.procedureType || 'Unknown';
                      acc[type] = (acc[type] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([type, count]) => (
                    <li key={type}>
                      {type}: {count}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-medium">Date Range:</span>
                <div className="pl-5">
                  {(() => {
                    const dates = importedData
                      .filter(p => p.date instanceof Date)
                      .map(p => p.date as Date);

                    if (dates.length === 0) return 'No valid dates found';

                    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
                    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

                    // Format dates nicely
                    const formatDate = (date: Date) => {
                      return date.toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      });
                    };

                    return `${formatDate(minDate)} to ${formatDate(maxDate)}`;
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Import button */}
        <div className="flex justify-end gap-2">
          {importedData.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleCancelUpload}
              disabled={isValidating || isLoading}
            >
              <FileX className="h-4 w-4 mr-2" />
              Cancel Import
            </Button>
          )}

          <Button
            onClick={handleImportClick}
            disabled={!hasValidData || isValidating || isLoading}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            {isLoading ? 'Importing...' : 'Import Data'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
