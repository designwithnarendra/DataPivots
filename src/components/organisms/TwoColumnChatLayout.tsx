"use client";

import { useEffect, useState } from "react";
import { ChatInterface } from "./ChatInterface";
import { AnalysisDashboard } from "./AnalysisDashboard";
import { useChat } from "@/hooks/useChat";
import { getMockReportById } from "@/data/mock/reports";
import { ProcessedReport } from "@/types";
import { cn } from "@/lib/utils";

export function TwoColumnChatLayout() {
  const { currentStep, resetChat } = useChat();
  const [currentReport, setCurrentReport] = useState<ProcessedReport | null>(
    null
  );
  const [showDashboard, setShowDashboard] = useState(false);

  // Show dashboard when analysis is completed
  useEffect(() => {
    if (currentStep === "completed") {
      // Simulate getting the latest report
      // In a real app, this would be returned from the chat completion
      const mockReport = getMockReportById("report-1"); // Use first mock report for demo
      if (mockReport) {
        setCurrentReport(mockReport);
        setShowDashboard(true);
      }
    } else {
      setShowDashboard(false);
      setCurrentReport(null);
    }
  }, [currentStep]);

  const handleStartNewAnalysis = () => {
    setShowDashboard(false);
    setCurrentReport(null);
    resetChat();
  };

  const handleExportReport = (format: "pdf" | "doc" | "ppt") => {
    // Mock export functionality
    const blob = new Blob(
      [`Mock ${format.toUpperCase()} export for ${currentReport?.title}`],
      {
        type: "text/plain",
      }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentReport?.title || "report"}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpdateReport = (updatedReport: ProcessedReport) => {
    setCurrentReport(updatedReport);
    // In a real app, this would sync with backend or global state
    console.log("Report updated:", updatedReport);
  };

  return (
    <div className="h-full flex">
      {/* Chat Column */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out border-r border-border",
          showDashboard ? "w-1/3 min-w-[400px]" : "w-full"
        )}
      >
        <ChatInterface />
      </div>

      {/* Dashboard Column */}
      {showDashboard && currentReport && (
        <div className="flex-1 min-w-0 animate-in slide-in-from-right duration-300">
          <AnalysisDashboard
            report={currentReport}
            onStartNewAnalysis={handleStartNewAnalysis}
            onExportReport={handleExportReport}
            onUpdateReport={handleUpdateReport}
          />
        </div>
      )}
    </div>
  );
}
