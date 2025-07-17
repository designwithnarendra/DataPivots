import { Widget, ReportType } from "@/types";

export const MOCK_EXTRACTED_DATA = {
  prescription: {
    patientInfo: {
      name: "Sarah Johnson",
      dob: "1985-03-15",
      address: "123 Oak Street, Springfield, IL 62701",
      phone: "(555) 123-4567",
    },
    prescriber: {
      name: "Dr. Michael Chen",
      license: "MD12345",
      practice: "Springfield Family Medicine",
      phone: "(555) 987-6543",
    },
    medications: [
      {
        name: "Metformin",
        strength: "500mg",
        quantity: "60 tablets",
        directions: "Take twice daily with meals",
        refills: 5,
      },
      {
        name: "Lisinopril",
        strength: "10mg",
        quantity: "30 tablets",
        directions: "Take once daily in the morning",
        refills: 3,
      },
    ],
    prescriptionDate: "2024-01-15",
    pharmacy: "Wellness Pharmacy",
  },

  invoice: {
    invoiceNumber: "INV-2024-0156",
    date: "2024-01-20",
    dueDate: "2024-02-20",
    provider: "Central Medical Center",
    patient: {
      name: "Robert Williams",
      id: "P789012",
      insurance: "Blue Cross Blue Shield",
    },
    services: [
      {
        code: "99213",
        description: "Office visit - Level 3",
        quantity: 1,
        unitPrice: 180.0,
        total: 180.0,
      },
      {
        code: "85025",
        description: "Complete Blood Count",
        quantity: 1,
        unitPrice: 45.0,
        total: 45.0,
      },
      {
        code: "80053",
        description: "Comprehensive Metabolic Panel",
        quantity: 1,
        unitPrice: 65.0,
        total: 65.0,
      },
    ],
    subtotal: 290.0,
    tax: 23.2,
    total: 313.2,
    amountDue: 62.64, // 20% patient responsibility
  },

  "progress-notes": {
    patientInfo: {
      name: "Emma Davis",
      mrn: "MRN456789",
      dob: "1992-07-22",
      age: 31,
    },
    encounter: {
      date: "2024-01-18",
      provider: "Dr. Lisa Park, MD",
      type: "Follow-up Visit",
      location: "Cardiology Clinic",
    },
    chiefComplaint: "Follow-up for hypertension management",
    assessment:
      "Hypertension well-controlled on current medication regimen. Patient reports no side effects.",
    plan: [
      "Continue current medication (Lisinopril 10mg daily)",
      "Follow-up in 3 months",
      "Continue lifestyle modifications",
      "Home blood pressure monitoring",
    ],
    vitals: {
      bloodPressure: "128/82 mmHg",
      heartRate: "72 bpm",
      temperature: "98.6°F",
      weight: "165 lbs",
    },
  },

  "document-chronology": {
    timelineEvents: [
      {
        date: "2023-12-01",
        type: "Initial Consultation",
        provider: "Dr. Smith",
        summary: "Patient presents with chest pain, EKG normal",
      },
      {
        date: "2023-12-15",
        type: "Lab Results",
        provider: "Lab Corp",
        summary: "Cholesterol levels elevated, LDL 165 mg/dL",
      },
      {
        date: "2024-01-10",
        type: "Follow-up Visit",
        provider: "Dr. Smith",
        summary: "Started on statin therapy, lifestyle counseling provided",
      },
      {
        date: "2024-01-25",
        type: "Cardiology Referral",
        provider: "Dr. Johnson",
        summary: "Stress test ordered, echocardiogram scheduled",
      },
    ],
    patientInfo: {
      name: "Michael Thompson",
      mrn: "MRN789123",
      dob: "1975-11-08",
    },
  },

  "patient-reports": {
    patientInfo: {
      name: "Jennifer Martinez",
      mrn: "MRN321654",
      dob: "1988-04-12",
      age: 35,
      gender: "Female",
    },
    labResults: [
      {
        test: "Hemoglobin A1C",
        value: "6.8%",
        reference: "< 7.0%",
        status: "Normal",
        date: "2024-01-15",
      },
      {
        test: "Fasting Glucose",
        value: "128 mg/dL",
        reference: "70-100 mg/dL",
        status: "High",
        date: "2024-01-15",
      },
      {
        test: "Total Cholesterol",
        value: "195 mg/dL",
        reference: "< 200 mg/dL",
        status: "Normal",
        date: "2024-01-15",
      },
    ],
    diagnoses: ["Type 2 Diabetes Mellitus", "Hypertension", "Dyslipidemia"],
    medications: [
      "Metformin 1000mg twice daily",
      "Lisinopril 20mg daily",
      "Atorvastatin 40mg daily",
    ],
    recommendations: [
      "Continue current diabetes management",
      "Dietary consultation recommended",
      "Regular exercise program",
      "Follow-up in 3 months",
    ],
  },
};

export const createMockWidgets = (reportType: ReportType): Widget[] => {
  const data = MOCK_EXTRACTED_DATA[reportType];
  const widgets: Widget[] = [];

  switch (reportType) {
    case "prescription":
      const prescriptionData = data as typeof MOCK_EXTRACTED_DATA.prescription;
      widgets.push(
        {
          id: "patient-info",
          type: "summary",
          title: "Patient Information",
          data: prescriptionData.patientInfo,
          position: { x: 0, y: 0, w: 4, h: 3 },
          editable: true,
        },
        {
          id: "medications",
          type: "table",
          title: "Prescribed Medications",
          data: prescriptionData.medications,
          position: { x: 4, y: 0, w: 8, h: 4 },
          editable: true,
        },
        {
          id: "prescriber",
          type: "summary",
          title: "Prescriber Information",
          data: prescriptionData.prescriber,
          position: { x: 0, y: 3, w: 4, h: 2 },
          editable: true,
        },
        {
          id: "refills-chart",
          type: "chart",
          title: "Medication Refills Remaining",
          data: {
            type: "bar",
            data: prescriptionData.medications.map((med) => ({
              name: med.name,
              value: med.refills,
            })),
          },
          position: { x: 4, y: 4, w: 8, h: 3 },
          editable: true,
        }
      );
      break;

    case "invoice":
      const invoiceData = data as typeof MOCK_EXTRACTED_DATA.invoice;
      widgets.push(
        {
          id: "invoice-summary",
          type: "metrics",
          title: "Invoice Summary",
          data: {
            "Total Amount": `$${invoiceData.total}`,
            "Amount Due": `$${invoiceData.amountDue}`,
            "Due Date": invoiceData.dueDate,
            "Invoice #": invoiceData.invoiceNumber,
          },
          position: { x: 0, y: 0, w: 4, h: 3 },
          editable: true,
        },
        {
          id: "services",
          type: "table",
          title: "Services & Charges",
          data: invoiceData.services,
          position: { x: 4, y: 0, w: 8, h: 4 },
          editable: true,
        },
        {
          id: "patient-billing",
          type: "summary",
          title: "Patient & Billing Info",
          data: invoiceData.patient,
          position: { x: 0, y: 3, w: 4, h: 2 },
          editable: true,
        },
        {
          id: "charges-breakdown",
          type: "chart",
          title: "Service Charges Breakdown",
          data: {
            type: "pie",
            data: invoiceData.services.map((service) => ({
              name: service.description,
              value: service.total,
            })),
          },
          position: { x: 4, y: 4, w: 8, h: 3 },
          editable: true,
        }
      );
      break;

    default:
      // Add similar widget configurations for other report types
      widgets.push({
        id: "main-summary",
        type: "summary",
        title: "Document Summary",
        data: data,
        position: { x: 0, y: 0, w: 12, h: 4 },
        editable: true,
      });
  }

  return widgets;
};
