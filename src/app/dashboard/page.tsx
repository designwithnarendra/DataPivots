"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { GlobalHeader } from "@/components/molecules/GlobalHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileUpload } from "@/components/molecules/FileUpload";
import { TwoColumnChatLayout } from "@/components/organisms/TwoColumnChatLayout";
import {
  FileText,
  Receipt,
  ClipboardList,
  Calendar,
  FolderOpen,
  MessageSquare,
  RotateCcw,
} from "lucide-react";

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [selectedReportType, setSelectedReportType] = useState<string | null>(
    null
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTwoColumn, setShowTwoColumn] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <h1 className="text-h3 font-bold text-primary font-heading">
            DataPivots
          </h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const reportTypes = [
    {
      id: "prescription",
      name: "Prescription Analysis",
      description:
        "Extract medication details, dosages, and instructions from prescription documents",
      icon: FileText,
    },
    {
      id: "invoice",
      name: "Invoice Processing",
      description:
        "Process medical bills and extract billing codes, amounts, and services",
      icon: Receipt,
    },
    {
      id: "progress-notes",
      name: "Progress Notes",
      description: "Analyze patient progress notes and treatment summaries",
      icon: ClipboardList,
    },
    {
      id: "document-chronology",
      name: "Document Chronology",
      description:
        "Create timeline and chronological analysis of medical records",
      icon: Calendar,
    },
    {
      id: "patient-reports",
      name: "Patient Reports",
      description: "Comprehensive patient information extraction and analysis",
      icon: FolderOpen,
    },
  ];

  const handleReportTypeSelect = (reportType: string) => {
    setSelectedReportType(reportType);
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);

    // Simulate processing and transition to two-column layout
    setTimeout(() => {
      setShowTwoColumn(true);
    }, 1000);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setIsProcessing(false);
    setShowTwoColumn(false);
  };

  const handleChangeReportType = () => {
    setSelectedReportType(null);
    setUploadedFile(null);
    setIsProcessing(false);
    setShowTwoColumn(false);
  };

  const handleReset = () => {
    setSelectedReportType(null);
    setUploadedFile(null);
    setIsProcessing(false);
    setShowTwoColumn(false);
  };

  // If processing has started and we want two-column layout
  if (showTwoColumn) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <main className="flex">
          <div className="w-full flex flex-col h-[calc(100vh-4rem)]">
            <TwoColumnChatLayout />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />

      {/* Main Content */}
      {!selectedReportType ? (
        // Initial state - Report type selection
        <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-12 px-6">
          <div className="w-full max-w-4xl space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <h1 className="text-h3 font-bold tracking-tight font-heading">
                AI Document Analysis
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Select the type of healthcare document you&apos;d like to
                analyze, or view your previous reports
              </p>
            </div>

            {/* AI Assistant Chat Container */}
            <Card className="shadow-8dp border-primary/10">
              <CardHeader className="text-center pb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <CardTitle className="font-heading text-h6">
                    Choose Analysis Type
                  </CardTitle>
                </div>
                <CardDescription className="text-base">
                  What type of document would you like to analyze today?
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Report Type Selection */}
                <div className="grid gap-3 md:grid-cols-1 lg:grid-cols-2">
                  {reportTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={type.id}
                        variant="outline"
                        className="h-auto p-4 flex items-center space-x-4 text-left hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 justify-start"
                        onClick={() => handleReportTypeSelect(type.id)}
                      >
                        <Icon className="h-6 w-6 text-primary flex-shrink-0" />
                        <div className="space-y-1 text-left min-w-0 flex-1">
                          <div className="font-semibold text-sm truncate">
                            {type.name}
                          </div>
                          <div className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {type.description}
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>

                {/* View Past Reports Option */}
                <div className="pt-4 border-t border-border">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full h-auto p-4 flex items-center justify-start space-x-3"
                    onClick={() => router.push("/reports")}
                  >
                    <FolderOpen className="h-5 w-5 flex-shrink-0" />
                    <div className="space-y-1 text-left">
                      <div className="font-semibold">View Past Reports</div>
                      <div className="text-sm opacity-80">
                        Browse and manage your previous analyses
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      ) : (
        // After report type selection - Upload state
        <main className="py-6 px-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Compact Header with Selected Report Type */}
            <Card className="shadow-4dp">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg font-heading">
                        {
                          reportTypes.find((t) => t.id === selectedReportType)
                            ?.name
                        }
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {
                          reportTypes.find((t) => t.id === selectedReportType)
                            ?.description
                        }
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* File Upload Section */}
            <Card className="shadow-4dp">
              <CardHeader>
                <CardTitle className="text-lg font-heading">
                  Upload Document
                </CardTitle>
                <CardDescription>
                  Upload your{" "}
                  {reportTypes
                    .find((t) => t.id === selectedReportType)
                    ?.name.toLowerCase()}{" "}
                  document for analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFileSelect={handleFileUpload}
                  onRemoveFile={handleRemoveFile}
                  selectedFile={uploadedFile || undefined}
                  disabled={isProcessing}
                />

                {isProcessing && (
                  <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-md">
                    <div className="text-sm text-primary font-medium">
                      Processing your document...
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      This will take a few moments
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Change Report Type Option */}
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Want to analyze a different type of document?
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleChangeReportType}
                className="text-sm"
              >
                Change Document Type
              </Button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
