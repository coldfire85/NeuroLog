import { validationRules, ValidationRules } from "@/hooks/use-form-validation";
import { ProcedureData } from "@/lib/types";

// Validation rules for procedure form
export const procedureValidationRules: ValidationRules<Partial<ProcedureData>> = {
  patientName: [
    validationRules.required("Patient name is required"),
    validationRules.maxLength(100, "Patient name must be 100 characters or less"),
  ],
  patientId: [
    validationRules.required("Patient ID is required"),
    validationRules.maxLength(50, "Patient ID must be 50 characters or less"),
  ],
  patientAge: [
    validationRules.required("Patient age is required"),
    validationRules.number("Age must be a number"),
    validationRules.minValue(0, "Age must be at least 0"),
    validationRules.maxValue(150, "Age must be 150 or less"),
  ],
  patientGender: [
    validationRules.required("Patient gender is required"),
  ],
  date: [
    validationRules.required("Procedure date is required"),
  ],
  diagnosis: [
    validationRules.required("Diagnosis is required"),
    validationRules.minLength(3, "Diagnosis must be at least 3 characters"),
    validationRules.maxLength(500, "Diagnosis must be 500 characters or less"),
  ],
  procedureType: [
    validationRules.required("Procedure type is required"),
  ],
  surgeonRole: [
    validationRules.required("Surgeon role is required"),
  ],
  location: [
    validationRules.required("Procedure location is required"),
    validationRules.maxLength(100, "Location must be 100 characters or less"),
  ],
  notes: [
    validationRules.required("Procedure notes are required"),
    validationRules.minLength(10, "Procedure notes must be at least 10 characters"),
  ],
};

// Initial values for procedure form
export const procedureInitialValues: Partial<ProcedureData> = {
  patientName: "",
  patientId: "",
  patientAge: undefined,
  patientGender: "",
  date: undefined,
  diagnosis: "",
  procedureType: "",
  surgeonRole: "",
  location: "",
  notes: "",
  complications: "",
  outcome: "",
  followUp: "",
  images: [],
  videos: [],
  radiologyImages: [],
};

// Options for procedure form dropdowns
export const procedureTypeOptions = [
  "Cranial",
  "Spinal",
  "Functional",
  "Vascular",
  "Pediatric",
  "Peripheral Nerve",
  "Endoscopic",
  "Oncological",
  "Trauma",
  "Other",
];

export const surgeonRoleOptions = [
  "Lead",
  "Assistant",
  "Observer",
  "Supervisor",
];

export const genderOptions = [
  "Male",
  "Female",
  "Other",
  "Not specified",
];
