"use client";

import { ReportType, ProcessedReport } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, Download, Trash2, X, ChevronDown } from "lucide-react";

interface ReportsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: ProcessedReport["status"] | "all";
  setStatusFilter: (status: ProcessedReport["status"] | "all") => void;
  typeFilter: ReportType | "all";
  setTypeFilter: (type: ReportType | "all") => void;
  selectedReports: string[];
  totalReports: number;
  filteredCount: number;
  onBatchExport: (format: "pdf" | "doc" | "ppt") => void;
  onBatchDelete: () => void;
  onClearSelection: () => void;
}

const REPORT_TYPES: { value: ReportType | "all"; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "prescription", label: "Prescription" },
  { value: "invoice", label: "Invoice" },
  { value: "progress-notes", label: "Progress Notes" },
  { value: "document-chronology", label: "Document Chronology" },
  { value: "patient-reports", label: "Patient Reports" },
];

const STATUS_OPTIONS: {
  value: ProcessedReport["status"] | "all";
  label: string;
  color?: string;
}[] = [
  { value: "all", label: "All Status" },
  {
    value: "completed",
    label: "Completed",
    color: "bg-success text-success-foreground",
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-warning text-warning-foreground",
  },
  {
    value: "failed",
    label: "Failed",
    color: "bg-destructive text-destructive-foreground",
  },
];

export function ReportsFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  selectedReports,
  totalReports,
  filteredCount,
  onBatchExport,
  onBatchDelete,
  onClearSelection,
}: ReportsFiltersProps) {
  const hasActiveFilters =
    searchQuery || statusFilter !== "all" || typeFilter !== "all";
  const hasSelection = selectedReports.length > 0;

  const clearAllFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports by title, type, or file name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              {STATUS_OPTIONS.find((opt) => opt.value === statusFilter)?.label}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {STATUS_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className="flex items-center gap-2"
              >
                {option.color && (
                  <div className={`w-2 h-2 rounded-full ${option.color}`} />
                )}
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              {REPORT_TYPES.find((type) => type.value === typeFilter)?.label}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {REPORT_TYPES.map((type) => (
              <DropdownMenuItem
                key={type.value}
                onClick={() => setTypeFilter(type.value)}
              >
                {type.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active Filters and Batch Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Active Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {hasActiveFilters && (
            <>
              <span className="text-sm text-muted-foreground">Filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: &quot;{searchQuery}&quot;
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Status:{" "}
                  {
                    STATUS_OPTIONS.find((opt) => opt.value === statusFilter)
                      ?.label
                  }
                  <button
                    onClick={() => setStatusFilter("all")}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {typeFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Type:{" "}
                  {
                    REPORT_TYPES.find((type) => type.value === typeFilter)
                      ?.label
                  }
                  <button
                    onClick={() => setTypeFilter("all")}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-auto p-1 text-xs"
              >
                Clear all
              </Button>
            </>
          )}
        </div>

        {/* Results Count and Batch Actions */}
        <div className="flex items-center gap-4">
          {/* Results Count */}
          <span className="text-sm text-muted-foreground">
            {hasActiveFilters ? (
              <>
                Showing {filteredCount} of {totalReports} reports
              </>
            ) : (
              <>{totalReports} reports total</>
            )}
          </span>

          {/* Batch Actions */}
          {hasSelection && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {selectedReports.length} selected
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onBatchExport("pdf")}>
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onBatchExport("doc")}>
                    Export as DOC
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onBatchExport("ppt")}>
                    Export as PPT
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={onBatchDelete}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
