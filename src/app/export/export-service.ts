"use client";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import jsPDF from "jspdf";
// Import jspdf-autotable types
import 'jspdf-autotable';

type ProcedureExportData = {
  id: string;
  date: Date | string;
  patientId: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  diagnosis: string;
  procedureType: string;
  surgeonRole: string;
  location: string;
  notes?: string;
  complications?: string;
  outcome?: string;
  followUp?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  imageCount?: number;
  radiologyImageCount?: number;
};

export type ExportOptions = {
  includePatientDetails: boolean;
  includeDiagnosis: boolean;
  includeNotes: boolean;
  includeComplicationsOutcome: boolean;
  includeImages: boolean;
  dateFormat: string;
  exportFormat: string;
};

export class ExportService {
  static async exportToExcel(procedures: ProcedureExportData[], options: ExportOptions) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "NeuroLog";
    workbook.lastModifiedBy = "NeuroLog";
    workbook.created = new Date();
    workbook.modified = new Date();

    const sheet = workbook.addWorksheet("Procedures");

    // Define columns based on options
    const columns: ExcelJS.Column[] = [
      { header: "Procedure ID", key: "id", width: 20 },
      { header: "Date", key: "date", width: 15 },
    ];

    if (options.includePatientDetails) {
      columns.push(
        { header: "Patient ID", key: "patientId", width: 15 },
        { header: "Patient Name", key: "patientName", width: 25 },
        { header: "Age", key: "patientAge", width: 10 },
        { header: "Gender", key: "patientGender", width: 10 },
      );
    }

    if (options.includeDiagnosis) {
      columns.push(
        { header: "Diagnosis", key: "diagnosis", width: 30 },
      );
    }

    columns.push(
      { header: "Procedure Type", key: "procedureType", width: 15 },
      { header: "Surgeon Role", key: "surgeonRole", width: 15 },
      { header: "Location", key: "location", width: 20 },
    );

    if (options.includeNotes) {
      columns.push(
        { header: "Notes", key: "notes", width: 40 },
      );
    }

    if (options.includeComplicationsOutcome) {
      columns.push(
        { header: "Complications", key: "complications", width: 30 },
        { header: "Outcome", key: "outcome", width: 30 },
        { header: "Follow-up", key: "followUp", width: 30 },
      );
    }

    if (options.includeImages) {
      columns.push(
        { header: "Operative Images", key: "imageCount", width: 15 },
        { header: "Radiology Images", key: "radiologyImageCount", width: 15 },
      );
    }

    // Add created/updated dates
    columns.push(
      { header: "Created", key: "createdAt", width: 20 },
      { header: "Updated", key: "updatedAt", width: 20 },
    );

    sheet.columns = columns;

    // Add header row with styling
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6F0FF' } // Light blue
    };

    // Format dates according to the selected format
    const formatDateString = (dateStr: Date | string | undefined) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);

      switch (options.dateFormat) {
        case "MM/DD/YYYY":
          return format(date, "MM/dd/yyyy");
        case "DD/MM/YYYY":
          return format(date, "dd/MM/yyyy");
        case "YYYY-MM-DD":
          return format(date, "yyyy-MM-dd");
        default:
          return format(date, "MM/dd/yyyy");
      }
    };

    // Add data rows
    procedures.forEach((procedure) => {
      const rowData: Record<string, string | number | boolean | null | undefined> = {
        id: procedure.id,
        date: formatDateString(procedure.date),
        procedureType: procedure.procedureType,
        surgeonRole: procedure.surgeonRole,
        location: procedure.location,
        createdAt: formatDateString(procedure.createdAt),
        updatedAt: formatDateString(procedure.updatedAt),
      };

      if (options.includePatientDetails) {
        rowData.patientId = procedure.patientId;
        rowData.patientName = procedure.patientName;
        rowData.patientAge = procedure.patientAge || "";
        rowData.patientGender = procedure.patientGender || "";
      }

      if (options.includeDiagnosis) {
        rowData.diagnosis = procedure.diagnosis;
      }

      if (options.includeNotes) {
        rowData.notes = procedure.notes || "";
      }

      if (options.includeComplicationsOutcome) {
        rowData.complications = procedure.complications || "";
        rowData.outcome = procedure.outcome || "";
        rowData.followUp = procedure.followUp || "";
      }

      if (options.includeImages) {
        rowData.imageCount = procedure.imageCount || 0;
        rowData.radiologyImageCount = procedure.radiologyImageCount || 0;
      }

      sheet.addRow(rowData);
    });

    // Apply styles
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });

        // Alternate row colors
        if (rowNumber % 2 === 0) {
          row.eachCell((cell) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFF9FAFC' } // Very light blue/gray
            };
          });
        }
      }
    });

    // Auto-filter
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: columns.length }
    };

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    // Save file
    const fileName = `neurolog_procedures_${format(new Date(), "yyyyMMdd_HHmmss")}.xlsx`;
    saveAs(blob, fileName);

    return fileName;
  }

  static async exportToCSV(procedures: ProcedureExportData[], options: ExportOptions) {
    // Create a workbook for CSV (we'll use ExcelJS to generate CSV as well)
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Procedures");

    // Define columns based on options (similar to Excel export)
    const columns: ExcelJS.Column[] = [
      { header: "Procedure ID", key: "id" },
      { header: "Date", key: "date" },
    ];

    if (options.includePatientDetails) {
      columns.push(
        { header: "Patient ID", key: "patientId" },
        { header: "Patient Name", key: "patientName" },
        { header: "Age", key: "patientAge" },
        { header: "Gender", key: "patientGender" },
      );
    }

    if (options.includeDiagnosis) {
      columns.push(
        { header: "Diagnosis", key: "diagnosis" },
      );
    }

    columns.push(
      { header: "Procedure Type", key: "procedureType" },
      { header: "Surgeon Role", key: "surgeonRole" },
      { header: "Location", key: "location" },
    );

    if (options.includeNotes) {
      columns.push(
        { header: "Notes", key: "notes" },
      );
    }

    if (options.includeComplicationsOutcome) {
      columns.push(
        { header: "Complications", key: "complications" },
        { header: "Outcome", key: "outcome" },
        { header: "Follow-up", key: "followUp" },
      );
    }

    if (options.includeImages) {
      columns.push(
        { header: "Operative Images", key: "imageCount" },
        { header: "Radiology Images", key: "radiologyImageCount" },
      );
    }

    sheet.columns = columns;

    // Format dates according to the selected format
    const formatDateString = (dateStr: Date | string | undefined) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);

      switch (options.dateFormat) {
        case "MM/DD/YYYY":
          return format(date, "MM/dd/yyyy");
        case "DD/MM/YYYY":
          return format(date, "dd/MM/yyyy");
        case "YYYY-MM-DD":
          return format(date, "yyyy-MM-dd");
        default:
          return format(date, "MM/dd/yyyy");
      }
    };

    // Add data rows
    procedures.forEach((procedure) => {
      const rowData: Record<string, string | number | boolean | null | undefined> = {
        id: procedure.id,
        date: formatDateString(procedure.date),
        procedureType: procedure.procedureType,
        surgeonRole: procedure.surgeonRole,
        location: procedure.location,
      };

      if (options.includePatientDetails) {
        rowData.patientId = procedure.patientId;
        rowData.patientName = procedure.patientName;
        rowData.patientAge = procedure.patientAge || "";
        rowData.patientGender = procedure.patientGender || "";
      }

      if (options.includeDiagnosis) {
        rowData.diagnosis = procedure.diagnosis;
      }

      if (options.includeNotes) {
        // Remove line breaks for CSV
        rowData.notes = procedure.notes ? procedure.notes.replace(/\n/g, " ") : "";
      }

      if (options.includeComplicationsOutcome) {
        rowData.complications = procedure.complications ? procedure.complications.replace(/\n/g, " ") : "";
        rowData.outcome = procedure.outcome ? procedure.outcome.replace(/\n/g, " ") : "";
        rowData.followUp = procedure.followUp ? procedure.followUp.replace(/\n/g, " ") : "";
      }

      if (options.includeImages) {
        rowData.imageCount = procedure.imageCount || 0;
        rowData.radiologyImageCount = procedure.radiologyImageCount || 0;
      }

      sheet.addRow(rowData);
    });

    // Generate CSV
    const csvBuffer = await workbook.csv.writeBuffer();
    const blob = new Blob([csvBuffer], { type: "text/csv;charset=utf-8;" });

    // Save file
    const fileName = `neurolog_procedures_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`;
    saveAs(blob, fileName);

    return fileName;
  }

  static async exportToPDF(procedures: ProcedureExportData[], options: ExportOptions) {
    // Create a new PDF document
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Add title to the PDF
    doc.setFontSize(18);
    doc.setTextColor(0, 51, 153); // Set title color to a blue shade
    doc.text('NeuroLog Procedures Report', 14, 15);

    // Add subtitle with current date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Gray
    doc.text(`Generated on ${format(new Date(), "MMMM dd, yyyy 'at' h:mm a")}`, 14, 22);

    // Add horizontal line
    doc.setDrawColor(220, 220, 220);
    doc.line(14, 25, 280, 25);

    // Format dates according to the selected format
    const formatDateString = (dateStr: Date | string | undefined) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);

      switch (options.dateFormat) {
        case "MM/DD/YYYY":
          return format(date, "MM/dd/yyyy");
        case "DD/MM/YYYY":
          return format(date, "dd/MM/yyyy");
        case "YYYY-MM-DD":
          return format(date, "yyyy-MM-dd");
        default:
          return format(date, "MM/dd/yyyy");
      }
    };

    // Prepare data for the table
    const tableHeaders = [
      "ID",
      "Date"
    ];

    if (options.includePatientDetails) {
      tableHeaders.push("Patient ID", "Patient Name", "Age", "Gender");
    }

    if (options.includeDiagnosis) {
      tableHeaders.push("Diagnosis");
    }

    tableHeaders.push("Type", "Role", "Location");

    if (options.includeNotes) {
      tableHeaders.push("Notes");
    }

    if (options.includeComplicationsOutcome) {
      tableHeaders.push("Complications", "Outcome", "Follow-up");
    }

    if (options.includeImages) {
      tableHeaders.push("Images", "Radiology");
    }

    // Prepare the data rows
    const tableData = procedures.map(procedure => {
      const row: (string | number)[] = [
        procedure.id,
        formatDateString(procedure.date)
      ];

      if (options.includePatientDetails) {
        row.push(
          procedure.patientId,
          procedure.patientName,
          procedure.patientAge?.toString() || '',
          procedure.patientGender || ''
        );
      }

      if (options.includeDiagnosis) {
        row.push(procedure.diagnosis);
      }

      row.push(
        procedure.procedureType,
        procedure.surgeonRole,
        procedure.location
      );

      if (options.includeNotes) {
        // Truncate notes to prevent them from taking too much space
        const truncatedNotes = procedure.notes && procedure.notes.length > 40
          ? procedure.notes.substring(0, 40) + '...'
          : procedure.notes || '';
        row.push(truncatedNotes);
      }

      if (options.includeComplicationsOutcome) {
        // Truncate complications, outcome, and followUp
        const truncatedComplications = procedure.complications && procedure.complications.length > 40
          ? procedure.complications.substring(0, 40) + '...'
          : procedure.complications || '';

        const truncatedOutcome = procedure.outcome && procedure.outcome.length > 40
          ? procedure.outcome.substring(0, 40) + '...'
          : procedure.outcome || '';

        const truncatedFollowUp = procedure.followUp && procedure.followUp.length > 40
          ? procedure.followUp.substring(0, 40) + '...'
          : procedure.followUp || '';

        row.push(truncatedComplications, truncatedOutcome, truncatedFollowUp);
      }

      if (options.includeImages) {
        row.push(
          procedure.imageCount?.toString() || '0',
          procedure.radiologyImageCount?.toString() || '0'
        );
      }

      return row;
    });

    // Generate the PDF table using autoTable
    (doc as any).autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 30,
      headStyles: {
        fillColor: [230, 240, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [249, 250, 252]
      },
      margin: { top: 30 },
      styles: {
        cellPadding: 3,
        fontSize: 9
      },
      columnStyles: {
        // Adjust column widths based on content
        0: { cellWidth: 15 }, // ID
        1: { cellWidth: 20 }, // Date
        // Dynamic width for other columns
      }
    });

    // Add footer with page numbers
    const totalPages = (doc as any).getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);

      // Footer with page numbers
      doc.text(
        `Page ${i} of ${totalPages} - NeuroLog Neurosurgical Logbook`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    // Save the PDF
    const fileName = `neurolog_procedures_${format(new Date(), "yyyyMMdd_HHmmss")}.pdf`;
    doc.save(fileName);

    return fileName;
  }
}
