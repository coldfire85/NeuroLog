"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileSpreadsheet, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ExcelImport } from '@/components/excel-import';
import { ProcedureData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ImportProcedurePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async (procedures: Partial<ProcedureData>[]) => {
    setIsImporting(true);
    try {
      // In a real app, this would be an API call to import the procedures
      console.log('Importing procedures:', procedures);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'Import Successful',
        description: `Successfully imported ${procedures.length} procedures.`,
      });

      // Redirect to procedures list after successful import
      setTimeout(() => {
        router.push('/procedures');
      }, 1500);
    } catch (error: unknown) {
      console.error('Error importing procedures:', error);
      toast({
        title: 'Import Failed',
        description: 'Failed to import procedures. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/procedures">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Procedures
            </Button>
          </Link>
        </div>
        <Link href="/procedures/new">
          <Button size="sm">Add Single Procedure</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Import Procedures</h1>
        <p className="text-muted-foreground">
          Bulk import multiple procedure records from an Excel file
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>New Feature: Intelligent Column Mapping</AlertTitle>
        <AlertDescription>
          <p className="mb-2">Our system can now automatically detect and map columns from any Excel format, even if the column names don't match our expected fields!</p>
          <p>Simply upload your Excel file, and if the columns don't match our standard format, you'll be guided through a simple mapping process.</p>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ExcelImport onImport={handleImport} isLoading={isImporting} />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Import Instructions
              </CardTitle>
              <CardDescription>
                How to properly format your Excel file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-6 space-y-3 text-sm">
                <li>
                  <span className="font-medium block mb-1">Download the template</span>
                  Use the "Download Import Template" button to get the correct format.
                </li>
                <li>
                  <span className="font-medium block mb-1">Fill in your data</span>
                  Required fields: Patient Name, Patient ID, Date, and Procedure Type.
                </li>
                <li>
                  <span className="font-medium block mb-1">Use correct data formats</span>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Procedure Type: Cranial, Spinal, Functional, Vascular, Pediatric, or Other</li>
                    <li>Date format: YYYY-MM-DD (e.g., 2025-03-10)</li>
                    <li>Patient Age: Numbers only</li>
                  </ul>
                </li>
                <li>
                  <span className="font-medium block mb-1">Upload your file</span>
                  Drag and drop or click to browse for your Excel file.
                </li>
                <li>
                  <span className="font-medium block mb-1">Map columns (if needed)</span>
                  If your Excel columns don't match our standard format, you'll be prompted to map them.
                </li>
                <li>
                  <span className="font-medium block mb-1">Validate and import</span>
                  Fix any validation errors, then click "Import Data" when ready.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips for Success</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Keep your Excel file open while fixing validation errors for easy corrections</li>
                <li>Import smaller batches (up to 100 procedures) at a time for better performance</li>
                <li>All dates should use the same format (YYYY-MM-DD) for consistency</li>
                <li>Double-check patient IDs to avoid duplicates</li>
                <li className="text-blue-600 font-medium">
                  You can now import from any Excel format - our system will help you map the columns
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
