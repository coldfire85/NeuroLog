/**
 * Common type definitions for the application
 */

// Type for file items (images, videos, radiology images)
export interface FileItem {
  id?: string;
  url: string;
  caption?: string;
  fileName?: string;
  type: "image" | "video" | "radiology";
  videoType?: "youtube" | "local"; // Only for video type
  fileType?: "dicom" | "jpg" | "png" | "mp4"; // Added to specify specific file formats
  isPublic?: boolean; // Whether this item is publicly accessible to other users
}

// Type for procedure template
export interface Template {
  id: string;
  name: string;
  procedureType: string;
  notes: string;
  complications?: string;
  outcome?: string;
  followUp?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Type for procedure form values
export interface ProcedureFormValues {
  patientId: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  date: Date;
  diagnosis: string;
  procedureType: string;
  surgeonRole: string;
  location: string;
  notes?: string;
  notesPublic?: boolean; // Whether notes are public
  complications?: string;
  outcome?: string;
  followUp?: string;
}

// Type for procedure data
export interface ProcedureData {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  date: Date | string;
  diagnosis: string;
  procedureType: string;
  surgeonRole: string;
  location: string;
  notes?: string;
  notesPublic?: boolean; // Whether notes are public
  complications?: string;
  outcome?: string;
  followUp?: string;
  images?: FileItem[];
  videos?: FileItem[];
  radiologyImages?: FileItem[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
