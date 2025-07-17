import { ReportTypeOption } from "@/types";

export const REPORT_TYPES: ReportTypeOption[] = [
  {
    id: "prescription",
    label: "Prescription",
    description:
      "Analyze prescription documents for dosages, medications, and patient information",
  },
  {
    id: "invoice",
    label: "Invoice",
    description:
      "Extract billing information, costs, and service details from medical invoices",
  },
  {
    id: "progress-notes",
    label: "Progress Notes",
    description:
      "Process clinical progress notes for patient status and treatment updates",
  },
  {
    id: "document-chronology",
    label: "Document Chronology",
    description: "Create timeline analysis of medical documents and events",
  },
  {
    id: "patient-reports",
    label: "Patient Reports",
    description:
      "Comprehensive analysis of patient medical reports and lab results",
  },
];
