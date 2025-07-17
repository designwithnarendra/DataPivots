"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChatMessage } from "@/components/molecules/ChatMessage";
import { ReportTypeChips } from "@/components/molecules/ReportTypeChips";
import { FileUpload } from "@/components/molecules/FileUpload";
import { useChat } from "@/hooks/useChat";
import { REPORT_TYPES } from "@/data/mock/reportTypes";
import { RotateCcw, Plus } from "lucide-react";

export function ChatInterface() {
  const {
    messages,
    selectedReportType,
    uploadedFile,
    isProcessing,
    currentStep,
    selectReportType,
    uploadFile,
    removeFile,
    resetChat,
    startNewAnalysis,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showReportTypeSelection =
    currentStep === "type-selection" && !selectedReportType;

  const showFileUpload =
    currentStep === "file-upload" && selectedReportType && !uploadedFile;

  const showProcessingFile =
    (currentStep === "processing" || currentStep === "completed") &&
    uploadedFile;

  const showNewAnalysisButton = currentStep === "completed";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary font-heading">
              AI Assistant
            </h1>
            <p className="text-sm text-muted-foreground">
              Let&apos;s analyze your healthcare documents together
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={resetChat}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Chat
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-0">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>

        {/* Interactive Elements */}
        <div className="p-6 space-y-6">
          {/* Report Type Selection */}
          {showReportTypeSelection && (
            <Card className="shadow-4dp">
              <CardContent className="p-6">
                <ReportTypeChips
                  reportTypes={REPORT_TYPES}
                  selectedType={selectedReportType || undefined}
                  onSelect={selectReportType}
                  disabled={isProcessing}
                />
              </CardContent>
            </Card>
          )}

          {/* File Upload */}
          {showFileUpload && (
            <Card className="shadow-4dp">
              <CardContent className="p-6">
                <FileUpload
                  onFileSelect={uploadFile}
                  onRemoveFile={removeFile}
                  selectedFile={uploadedFile || undefined}
                  disabled={isProcessing}
                  isProcessing={isProcessing}
                />
              </CardContent>
            </Card>
          )}

          {/* Processing File Display */}
          {showProcessingFile && (
            <Card className="shadow-4dp">
              <CardContent className="p-6">
                <FileUpload
                  onFileSelect={() => {}} // No-op since file is already selected
                  onRemoveFile={
                    currentStep !== "processing" ? removeFile : undefined
                  }
                  selectedFile={uploadedFile}
                  disabled={true}
                  isProcessing={isProcessing}
                />
              </CardContent>
            </Card>
          )}

          {/* New Analysis Button */}
          {showNewAnalysisButton && (
            <Card className="shadow-4dp">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Analysis complete! What would you like to do next?
                  </p>
                  <div className="flex gap-3">
                    <Button onClick={startNewAnalysis} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Start New Analysis
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/dashboard">View Dashboard</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
