"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardGrid } from "./DashboardGrid";
import { DocumentViewer } from "@/components/molecules/DocumentViewer";
import { EditableWidget } from "@/components/molecules/EditableWidget";
import { ChangeHistoryDialog } from "@/components/molecules/ChangeHistoryDialog";
import { ProcessedReport, Widget, WidgetChange } from "@/types";
import { useChangeTracking } from "@/hooks/useChangeTracking";
import { Download, FileText, BarChart3, Plus, History } from "lucide-react";

interface AnalysisDashboardProps {
  report: ProcessedReport;
  onStartNewAnalysis?: () => void;
  onExportReport?: (format: "pdf" | "doc" | "ppt") => void;
  onUpdateReport?: (updatedReport: ProcessedReport) => void;
}

export function AnalysisDashboard({
  report,
  onStartNewAnalysis,
  onExportReport,
  onUpdateReport,
}: AnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState("report");
  const [editingWidget, setEditingWidget] = useState<string | null>(null);
  const [widgets, setWidgets] = useState(report.widgets);

  const { trackChange, getWidgetHistory, revertToVersion } =
    useChangeTracking();

  // Initialize change tracking for existing widgets
  useEffect(() => {
    // Only track on initial mount, not when widgets change
    const initialWidgets = report.widgets;
    initialWidgets.forEach((widget) => {
      if (!widget.version) {
        // Track initial creation for widgets without version
        trackChange(
          { ...widget, version: 1, lastModified: new Date() },
          "created"
        );
      }
    });
  }, [report.id]); // Only re-run if report changes

  const getStatusColor = (status: ProcessedReport["status"]) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground";
      case "processing":
        return "bg-warning text-warning-foreground";
      case "failed":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const formatReportType = (type: string) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleExport = (format: "pdf" | "doc" | "ppt") => {
    // Simulate export process
    if (onExportReport) {
      onExportReport(format);
    } else {
      // Mock download
      console.log(`Exporting report as ${format.toUpperCase()}...`);
      // In a real app, this would trigger a download
    }
  };

  const handleWidgetEdit = (widgetId: string) => {
    setEditingWidget(widgetId);
  };

  const handleWidgetSave = (updatedWidget: Widget) => {
    const originalWidget = widgets.find((w) => w.id === updatedWidget.id);

    // Track the change
    const change = trackChange(
      {
        ...updatedWidget,
        version: (originalWidget?.version || 0) + 1,
        lastModified: new Date(),
      },
      "updated",
      originalWidget
        ? {
            title: originalWidget.title,
            data: originalWidget.data,
          }
        : undefined
    );

    // Update widget with new version info
    const versionedWidget = {
      ...updatedWidget,
      version: change.version,
      lastModified: change.timestamp,
    };

    const newWidgets = widgets.map((w) =>
      w.id === updatedWidget.id ? versionedWidget : w
    );
    setWidgets(newWidgets);
    setEditingWidget(null);

    // Update the report if callback provided
    if (onUpdateReport) {
      onUpdateReport({
        ...report,
        widgets: newWidgets,
        updatedAt: new Date(),
      });
    }
  };

  const handleWidgetRemove = (widgetId: string) => {
    const widgetToRemove = widgets.find((w) => w.id === widgetId);
    if (widgetToRemove) {
      // Track deletion
      trackChange(widgetToRemove, "deleted");
    }

    const newWidgets = widgets.filter((w) => w.id !== widgetId);
    setWidgets(newWidgets);

    // Update the report if callback provided
    if (onUpdateReport) {
      onUpdateReport({
        ...report,
        widgets: newWidgets,
        updatedAt: new Date(),
      });
    }
  };

  const handleRevertWidget = (widgetId: string, change: WidgetChange) => {
    const revertedWidget = revertToVersion(widgetId, change.version);
    if (revertedWidget) {
      const newWidgets = widgets.map((w) =>
        w.id === widgetId ? revertedWidget : w
      );
      setWidgets(newWidgets);

      // Track the revert as a new update
      trackChange(revertedWidget, "updated", {
        title: widgets.find((w) => w.id === widgetId)?.title || "",
        data: widgets.find((w) => w.id === widgetId)?.data,
      });

      if (onUpdateReport) {
        onUpdateReport({
          ...report,
          widgets: newWidgets,
          updatedAt: new Date(),
        });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingWidget(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="flex-shrink-0 p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-heading">
                {report.title}
              </h1>
              <Badge className={getStatusColor(report.status)}>
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{formatReportType(report.reportType)}</span>
              <span>•</span>
              <span>Created {report.createdAt.toLocaleDateString()}</span>
              {report.originalFile && (
                <>
                  <span>•</span>
                  <span>{report.originalFile.name}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {report.status === "completed" && (
              <>
                <ChangeHistoryDialog
                  widget={{
                    id: "report",
                    title: "Report Changes",
                    type: "summary",
                    data: {},
                    position: { x: 0, y: 0, w: 1, h: 1 },
                    editable: false,
                  }}
                  changes={getWidgetHistory("report")}
                  trigger={
                    <Button variant="outline" size="sm" className="gap-2">
                      <History className="h-4 w-4" />
                      History
                    </Button>
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("pdf")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("doc")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  DOC
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("ppt")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  PPT
                </Button>
              </>
            )}
            {onStartNewAnalysis && (
              <Button onClick={onStartNewAnalysis} className="gap-2">
                <Plus className="h-4 w-4" />
                Start New Report
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {report.status === "completed" ? (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            <div className="flex-shrink-0 px-6 pt-4">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="report" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Consolidated Report
                </TabsTrigger>
                <TabsTrigger value="document" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Original Document
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="report" className="h-full m-0 p-6">
                <div className="h-full overflow-auto">
                  {editingWidget ? (
                    <div className="max-w-2xl mx-auto">
                      <EditableWidget
                        widget={widgets.find((w) => w.id === editingWidget)!}
                        onSave={handleWidgetSave}
                        onCancel={handleCancelEdit}
                      />
                    </div>
                  ) : widgets.length > 0 ? (
                    <DashboardGrid
                      widgets={widgets}
                      editable={true}
                      onWidgetEdit={handleWidgetEdit}
                      onWidgetRemove={handleWidgetRemove}
                      onWidgetHistory={getWidgetHistory}
                      onRevertWidget={handleRevertWidget}
                    />
                  ) : (
                    <Card className="h-full flex items-center justify-center">
                      <CardContent className="text-center space-y-4">
                        <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto" />
                        <div>
                          <h3 className="text-lg font-semibold">
                            No Widgets Available
                          </h3>
                          <p className="text-muted-foreground">
                            Analysis data will appear here once processing is
                            complete.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="document" className="h-full m-0 p-6">
                <div className="h-full">
                  {report.originalFile ? (
                    <DocumentViewer
                      fileName={report.originalFile.name}
                      fileUrl={report.originalFile.url}
                      fileType={report.originalFile.type}
                    />
                  ) : (
                    <Card className="h-full flex items-center justify-center">
                      <CardContent className="text-center space-y-4">
                        <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
                        <div>
                          <h3 className="text-lg font-semibold">
                            No Document Available
                          </h3>
                          <p className="text-muted-foreground">
                            The original document is not available for viewing.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        ) : (
          <div className="h-full flex items-center justify-center p-6">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-center">
                  {report.status === "processing"
                    ? "Processing Document"
                    : "Analysis Failed"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                {report.status === "processing" ? (
                  <>
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                    <p className="text-muted-foreground">
                      Please wait while we analyze your document...
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center mx-auto">
                      <span className="text-destructive-foreground text-sm font-bold">
                        !
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      There was an error processing your document. Please try
                      again.
                    </p>
                    {onStartNewAnalysis && (
                      <Button onClick={onStartNewAnalysis} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Try Again
                      </Button>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
