import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ProcedureData } from "@/lib/types";

// Manually loading fonts to avoid the issue
// This is needed because pdfmake tries to load fonts at runtime but can't in some environments
let fontsLoaded = false;
try {
  if (typeof window !== 'undefined' && !pdfMake.vfs) {
    // Fix for the undefined vfs issue
    if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
      fontsLoaded = true;
    }
  }
} catch (error) {
  console.error("Error loading PDF fonts:", error);
}

/**
 * Checks if PDF generation is available in the current environment
 * @returns boolean whether PDF generation is available
 */
const isPdfAvailable = (): boolean => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    console.warn("PDF generation is not available in server-side environment");
    return false;
  }

  // Check if pdfMake is loaded properly
  if (!pdfMake || !pdfMake.createPdf) {
    console.warn("PDF library (pdfMake) not properly loaded");
    return false;
  }

  // Check if fonts are loaded
  if (!fontsLoaded && !pdfMake.vfs) {
    console.warn("PDF fonts not properly loaded");
    return false;
  }

  return true;
};

/**
 * Validates procedure data before generating a PDF
 * @param procedure The procedure data to validate
 * @returns boolean indicating if the procedure data is valid
 */
const validateProcedureData = (procedure: ProcedureData): boolean => {
  // Check required fields
  if (!procedure) {
    console.error("PDF Generation Error: No procedure data provided");
    return false;
  }

  const requiredFields = ['id', 'patientId', 'patientName', 'date', 'diagnosis', 'procedureType'];

  for (const field of requiredFields) {
    if (!procedure[field as keyof ProcedureData]) {
      console.error(`PDF Generation Error: Missing required field: ${field}`);
      return false;
    }
  }

  return true;
};

/**
 * Generate and download a PDF report for a procedure
 * @param procedure The procedure data to generate a PDF for
 * @returns Promise resolving to boolean indicating success
 */
export const generatePDF = async (procedure: ProcedureData): Promise<boolean> => {
  // Ensure PDF generation is available
  if (!isPdfAvailable()) {
    throw new Error("PDF generation is not available in this environment");
  }

  // Validate procedure data
  if (!validateProcedureData(procedure)) {
    throw new Error("Invalid procedure data for PDF generation");
  }

  try {
    // Format date for display
    const formatDate = (date: Date | string | undefined): string => {
      if (!date) return 'Unknown';
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    // Create the document definition
    const docDefinition = {
      info: {
        title: `Procedure Record - ${procedure.patientName}`,
        author: 'NeuroLog',
        subject: 'Neurosurgical Procedure Record',
        keywords: 'neurosurgery, procedure, medical record',
      },
      header: {
        text: 'NeuroLog - Neurosurgical Procedure Record',
        style: 'header',
        margin: [40, 20, 40, 20],
      },
      footer: {
        text: `Generated on ${new Date().toLocaleDateString()} | Confidential Medical Record`,
        style: 'footer',
        margin: [40, 20, 40, 20],
      },
      content: [
        {
          text: `${procedure.procedureType} Procedure`,
          style: 'h1',
          margin: [0, 0, 0, 10],
        },
        {
          text: `Date: ${formatDate(procedure.date)} | Location: ${procedure.location || 'Unknown'}`,
          style: 'subheader',
          margin: [0, 0, 0, 20],
        },
        {
          style: 'section',
          table: {
            widths: ['*', '*'],
            body: [
              [
                { text: 'Patient Information', style: 'sectionHeader', colSpan: 2 },
                {},
              ],
              [
                {
                  stack: [
                    { text: 'Patient Name', style: 'label' },
                    { text: procedure.patientName, margin: [0, 0, 0, 10] },
                    { text: 'Patient ID', style: 'label' },
                    { text: procedure.patientId, margin: [0, 0, 0, 10] },
                  ]
                },
                {
                  stack: [
                    { text: 'Age', style: 'label' },
                    { text: procedure.patientAge ? `${procedure.patientAge} years` : 'Not specified', margin: [0, 0, 0, 10] },
                    { text: 'Gender', style: 'label' },
                    { text: procedure.patientGender || 'Not specified', margin: [0, 0, 0, 10] },
                  ]
                },
              ],
              [
                {
                  stack: [
                    { text: 'Diagnosis', style: 'label' },
                    { text: procedure.diagnosis, margin: [0, 0, 0, 10] },
                  ],
                  colSpan: 2
                },
                {},
              ],
            ],
          },
          layout: {
            hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0,
            vLineWidth: () => 0,
            hLineColor: () => '#CCCCCC',
            paddingTop: () => 10,
            paddingBottom: () => 10,
          },
        },
        {
          style: 'section',
          margin: [0, 20, 0, 0],
          table: {
            widths: ['*'],
            body: [
              [
                { text: 'Procedure Notes', style: 'sectionHeader' },
              ],
              [
                { text: procedure.notes || 'No procedure notes provided.', margin: [0, 5, 0, 5] },
              ],
            ],
          },
          layout: {
            hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0,
            vLineWidth: () => 0,
            hLineColor: () => '#CCCCCC',
            paddingTop: () => 10,
            paddingBottom: () => 10,
          },
        },
        {
          style: 'section',
          margin: [0, 20, 0, 0],
          table: {
            widths: ['*'],
            body: [
              [
                { text: 'Complications', style: 'sectionHeader' },
              ],
              [
                { text: procedure.complications || 'No complications noted.', margin: [0, 5, 0, 5] },
              ],
            ],
          },
          layout: {
            hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0,
            vLineWidth: () => 0,
            hLineColor: () => '#CCCCCC',
            paddingTop: () => 10,
            paddingBottom: () => 10,
          },
        },
        {
          style: 'section',
          margin: [0, 20, 0, 0],
          table: {
            widths: ['*'],
            body: [
              [
                { text: 'Outcome', style: 'sectionHeader' },
              ],
              [
                { text: procedure.outcome || 'No outcome information provided.', margin: [0, 5, 0, 5] },
              ],
            ],
          },
          layout: {
            hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0,
            vLineWidth: () => 0,
            hLineColor: () => '#CCCCCC',
            paddingTop: () => 10,
            paddingBottom: () => 10,
          },
        },
        {
          style: 'section',
          margin: [0, 20, 0, 0],
          table: {
            widths: ['*'],
            body: [
              [
                { text: 'Follow-up Plan', style: 'sectionHeader' },
              ],
              [
                { text: procedure.followUp || 'No follow-up plan specified.', margin: [0, 5, 0, 5] },
              ],
            ],
          },
          layout: {
            hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0,
            vLineWidth: () => 0,
            hLineColor: () => '#CCCCCC',
            paddingTop: () => 10,
            paddingBottom: () => 10,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 12,
          bold: true,
          color: '#333333',
          alignment: 'center',
        },
        footer: {
          fontSize: 8,
          color: '#777777',
          alignment: 'center',
        },
        h1: {
          fontSize: 18,
          bold: true,
          color: '#2563EB',
        },
        subheader: {
          fontSize: 10,
          color: '#666666',
        },
        section: {
          margin: [0, 5, 0, 15],
        },
        sectionHeader: {
          fontSize: 12,
          bold: true,
          color: '#333333',
          fillColor: '#F3F4F6',
          padding: [5, 5, 5, 5],
        },
        label: {
          fontSize: 10,
          color: '#666666',
          margin: [0, 5, 0, 2],
        },
      },
      defaultStyle: {
        fontSize: 10,
        lineHeight: 1.2,
      },
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
    };

    // Generate and download the PDF
    const pdfDoc = pdfMake.createPdf(docDefinition);

    // Wrap the download in a promise to handle any potential errors
    return new Promise((resolve, reject) => {
      try {
        // For browsers: open in a new window or download
        if (typeof window !== 'undefined') {
          pdfDoc.download(`${procedure.procedureType}_Procedure_${procedure.patientId}.pdf`,
            () => {
              resolve(true); // Successfully downloaded
            },
            (error: Error) => {
              console.error("PDF download error:", error);
              reject(error);
            });
        }
      } catch (error) {
        console.error("PDF generation error:", error);
        reject(error);
      }
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
