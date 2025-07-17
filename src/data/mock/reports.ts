import { ProcessedReport } from "@/types";
import { createMockWidgets } from "./extractedData";

export const MOCK_REPORTS: ProcessedReport[] = [
  {
    id: "report-1",
    title: "Sarah Johnson - Prescription Analysis",
    reportType: "prescription",
    status: "completed",
    createdAt: new Date("2024-01-15T10:30:00"),
    updatedAt: new Date("2024-01-15T10:32:00"),
    extractedData: {
      patientName: "Sarah Johnson",
      medicationCount: 2,
      prescriberName: "Dr. Michael Chen",
    },
    originalFile: {
      name: "prescription_sarah_johnson.pdf",
      url: "/sample-documents/prescription_sarah_johnson.pdf",
      type: "application/pdf",
    },
    widgets: createMockWidgets("prescription"),
  },
  {
    id: "report-2",
    title: "Robert Williams - Medical Invoice",
    reportType: "invoice",
    status: "completed",
    createdAt: new Date("2024-01-20T14:15:00"),
    updatedAt: new Date("2024-01-20T14:17:00"),
    extractedData: {
      invoiceNumber: "INV-2024-0156",
      totalAmount: 313.2,
      patientName: "Robert Williams",
    },
    originalFile: {
      name: "invoice_robert_williams.pdf",
      url: "/sample-documents/invoice_robert_williams.pdf",
      type: "application/pdf",
    },
    widgets: createMockWidgets("invoice"),
  },
  {
    id: "report-3",
    title: "Emma Davis - Progress Notes",
    reportType: "progress-notes",
    status: "completed",
    createdAt: new Date("2024-01-18T09:45:00"),
    updatedAt: new Date("2024-01-18T09:47:00"),
    extractedData: {
      patientName: "Emma Davis",
      encounterDate: "2024-01-18",
      provider: "Dr. Lisa Park, MD",
    },
    originalFile: {
      name: "progress_notes_emma_davis.pdf",
      url: "/sample-documents/progress_notes_emma_davis.pdf",
      type: "application/pdf",
    },
    widgets: createMockWidgets("progress-notes"),
  },
  {
    id: "report-4",
    title: "Michael Thompson - Document Timeline",
    reportType: "document-chronology",
    status: "completed",
    createdAt: new Date("2024-01-22T16:20:00"),
    updatedAt: new Date("2024-01-22T16:25:00"),
    extractedData: {
      patientName: "Michael Thompson",
      timelineEvents: 4,
      dateRange: "2023-12-01 to 2024-01-25",
    },
    originalFile: {
      name: "chronology_michael_thompson.pdf",
      url: "/sample-documents/chronology_michael_thompson.pdf",
      type: "application/pdf",
    },
    widgets: createMockWidgets("document-chronology"),
  },
  {
    id: "report-5",
    title: "Jennifer Martinez - Patient Report",
    reportType: "patient-reports",
    status: "processing",
    createdAt: new Date("2024-01-25T11:00:00"),
    updatedAt: new Date("2024-01-25T11:00:00"),
    extractedData: {},
    originalFile: {
      name: "patient_report_jennifer_martinez.pdf",
      url: "/sample-documents/patient_report_jennifer_martinez.pdf",
      type: "application/pdf",
    },
    widgets: [],
  },
  {
    id: "report-6",
    title: "Failed Analysis - Corrupted File",
    reportType: "invoice",
    status: "failed",
    createdAt: new Date("2024-01-23T13:30:00"),
    updatedAt: new Date("2024-01-23T13:31:00"),
    extractedData: {},
    originalFile: {
      name: "corrupted_invoice.pdf",
      url: "/sample-documents/corrupted_invoice.pdf",
      type: "application/pdf",
    },
    widgets: [],
  },
];

export const getMockReportById = (id: string): ProcessedReport | undefined => {
  return MOCK_REPORTS.find((report) => report.id === id);
};

export const getMockReportsByStatus = (
  status: ProcessedReport["status"]
): ProcessedReport[] => {
  return MOCK_REPORTS.filter((report) => report.status === status);
};

export const getMockReportsByType = (
  reportType: ProcessedReport["reportType"]
): ProcessedReport[] => {
  return MOCK_REPORTS.filter((report) => report.reportType === reportType);
};
