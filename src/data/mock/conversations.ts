import { ChatMessage, ReportType } from "@/types";

export const INITIAL_GREETING: ChatMessage = {
  id: "greeting-1",
  type: "ai",
  content:
    "Welcome to DataPivots! I'm your AI assistant ready to help you analyze healthcare documents. What type of document would you like to analyze today?",
  timestamp: new Date(),
  status: "received",
};

export const PROCESSING_MESSAGES = {
  fileReceived: (filename: string): ChatMessage => ({
    id: `msg-${Date.now()}`,
    type: "ai",
    content: `Received "${filename}". Starting analysis...`,
    timestamp: new Date(),
    status: "received",
  }),

  step1: (): ChatMessage => ({
    id: `msg-${Date.now()}`,
    type: "ai",
    content: "(1/3) Analyzing document layout...",
    timestamp: new Date(),
    status: "received",
  }),

  step2: (): ChatMessage => ({
    id: `msg-${Date.now()}`,
    type: "ai",
    content: "(2/3) Extracting key data points...",
    timestamp: new Date(),
    status: "received",
  }),

  step3: (): ChatMessage => ({
    id: `msg-${Date.now()}`,
    type: "ai",
    content: "(3/3) Structuring your report...",
    timestamp: new Date(),
    status: "received",
  }),

  completed: (): ChatMessage => ({
    id: `msg-${Date.now()}`,
    type: "ai",
    content:
      "Your report is ready! You can review the extracted data on the right or download the report in your preferred format.",
    timestamp: new Date(),
    status: "received",
  }),
};

export const VALIDATION_MESSAGES = {
  invalidFile: (reportType: ReportType): ChatMessage => ({
    id: `msg-${Date.now()}`,
    type: "ai",
    content: `This file doesn't appear to be a valid ${reportType.replace("-", " ")} document. Please upload a relevant file and try again.`,
    timestamp: new Date(),
    status: "received",
  }),

  fileTypeError: (): ChatMessage => ({
    id: `msg-${Date.now()}`,
    type: "ai",
    content:
      "Please upload a PDF, PNG, or JPG file. Other file types are not supported.",
    timestamp: new Date(),
    status: "received",
  }),
};

export const REPORT_TYPE_CONFIRMATIONS = {
  prescription:
    "Great! I'll help you analyze a prescription document. Please upload your prescription file.",
  invoice:
    "Perfect! I'll analyze your medical invoice. Please upload the invoice file.",
  "progress-notes":
    "Excellent! I'll process your progress notes. Please upload the document.",
  "document-chronology":
    "Wonderful! I'll create a chronological analysis. Please upload your documents.",
  "patient-reports":
    "Great choice! I'll analyze your patient report. Please upload the file.",
} as const;
