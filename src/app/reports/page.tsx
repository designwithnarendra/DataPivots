"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useReports } from "@/hooks/useReports";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportsFilters } from "@/components/molecules/ReportsFilters";
import { ReportsTable } from "@/components/molecules/ReportsTable";
import { ReportsPagination } from "@/components/molecules/ReportsPagination";
import { Plus, FileText } from "lucide-react";

export default function ReportsPage() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();

  const {
    reports,
    filteredReportsCount,
    totalReports,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    sortField,
    sortDirection,
    handleSort,
    selectedReports,
    handleSelectReport,
    handleSelectAll,
    clearSelection,
    isAllSelected,
    deleteReport,
    deleteMultipleReports,
    renameReport,
    isLoading: reportsLoading,
  } = useReports({ itemsPerPage: 10 });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-primary font-heading">
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

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleViewReport = () => {
    // For demo purposes, navigate to chat with the report
    router.push("/chat");
  };

  const handleExportReport = async (
    reportId: string,
    format: "pdf" | "doc" | "ppt"
  ) => {
    // Mock export functionality
    const report = reports.find((r) => r.id === reportId);
    if (!report) return;

    const blob = new Blob(
      [`Mock ${format.toUpperCase()} export for ${report.title}`],
      {
        type: "text/plain",
      }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.title}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleBatchExport = async (format: "pdf" | "doc" | "ppt") => {
    // Mock batch export
    const selectedReportsList = reports.filter((r) =>
      selectedReports.includes(r.id)
    );
    const blob = new Blob(
      [
        `Mock batch ${format.toUpperCase()} export for ${selectedReportsList.length} reports:\n${selectedReportsList
          .map((r) => r.title)
          .join(", ")}`,
      ],
      {
        type: "text/plain",
      }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `batch_export_${selectedReportsList.length}_reports.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    clearSelection();
  };

  const handleBatchDelete = () => {
    if (selectedReports.length > 0) {
      deleteMultipleReports(selectedReports);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="text-2xl font-bold text-primary font-heading hover:bg-transparent"
            >
              DataPivots
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.name}
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight font-heading">
                Reports
              </h1>
              <p className="text-muted-foreground">
                Manage and view all your analyzed documents
              </p>
            </div>
            <Button onClick={() => router.push("/chat")} className="gap-2">
              <Plus className="h-4 w-4" />
              New Analysis
            </Button>
          </div>

          {/* Reports Management */}
          {totalReports > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  All Reports
                </CardTitle>
                <CardDescription>
                  Search, filter, and manage your document analysis reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Filters */}
                <ReportsFilters
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  typeFilter={typeFilter}
                  setTypeFilter={setTypeFilter}
                  selectedReports={selectedReports}
                  totalReports={totalReports}
                  filteredCount={filteredReportsCount}
                  onBatchExport={handleBatchExport}
                  onBatchDelete={handleBatchDelete}
                  onClearSelection={clearSelection}
                />

                {/* Reports Table */}
                <ReportsTable
                  reports={reports}
                  selectedReports={selectedReports}
                  isAllSelected={isAllSelected}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  isLoading={reportsLoading}
                  onSelectReport={handleSelectReport}
                  onSelectAll={handleSelectAll}
                  onSort={handleSort}
                  onView={handleViewReport}
                  onRename={renameReport}
                  onDelete={deleteReport}
                  onExport={handleExportReport}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <ReportsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredReportsCount}
                  />
                )}
              </CardContent>
            </Card>
          ) : (
            /* Empty State */
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Reports Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Start analyzing your healthcare documents to see reports here.
                  Upload prescriptions, invoices, or patient records to get
                  started.
                </p>
                <Button onClick={() => router.push("/chat")} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Report
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
