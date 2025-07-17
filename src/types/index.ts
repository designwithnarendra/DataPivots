// Authentication types
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthSession {
  user: User;
  isAuthenticated: boolean;
}

// Report types
export type ReportType =
  | "prescription"
  | "invoice"
  | "progress-notes"
  | "document-chronology"
  | "patient-reports";

export interface ReportTypeOption {
  id: ReportType;
  label: string;
  description: string;
}

// Chat types
export interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  status?: "pending" | "sent" | "received";
}

// Widget types
export interface Widget {
  id: string;
  type: "summary" | "table" | "chart" | "metrics";
  title: string;
  data: unknown;
  position: { x: number; y: number; w: number; h: number };
  editable: boolean;
  version?: number;
  lastModified?: Date;
}

// Change tracking types
export interface WidgetChange {
  id: string;
  widgetId: string;
  version: number;
  timestamp: Date;
  changeType: "created" | "updated" | "deleted";
  previousData?: {
    title: string;
    data: unknown;
  };
  newData: {
    title: string;
    data: unknown;
  };
  userEmail?: string;
}

// Report data types
export interface ProcessedReport {
  id: string;
  title: string;
  reportType: ReportType;
  status: "processing" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
  extractedData: Record<string, unknown>;
  originalFile?: {
    name: string;
    url: string;
    type: string;
  };
  widgets: Widget[];
  changeHistory?: WidgetChange[];
}
