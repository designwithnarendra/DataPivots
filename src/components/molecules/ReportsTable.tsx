"use client";

import { useState } from "react";
import { ProcessedReport } from "@/types";
import { SortField, SortDirection } from "@/hooks/useReports";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Edit3,
  Trash2,
  Download,
  Calendar,
  FileText,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportsTableProps {
  reports: ProcessedReport[];
  selectedReports: string[];
  isAllSelected: boolean;
  sortField: SortField;
  sortDirection: SortDirection;
  isLoading: boolean;
  onSelectReport: (reportId: string) => void;
  onSelectAll: () => void;
  onSort: (field: SortField) => void;
  onView: (report: ProcessedReport) => void;
  onRename: (reportId: string, newTitle: string) => void;
  onDelete: (reportId: string) => void;
  onExport: (reportId: string, format: "pdf" | "doc" | "ppt") => void;
}

export function ReportsTable({
  reports,
  selectedReports,
  isAllSelected,
  sortField,
  sortDirection,
  isLoading,
  onSelectReport,
  onSelectAll,
  onSort,
  onView,
  onRename,
  onDelete,
  onExport,
}: ReportsTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const getStatusColor = (status: ProcessedReport["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleStartEdit = (report: ProcessedReport) => {
    setEditingId(report.id);
    setEditingTitle(report.title);
  };

  const handleSaveEdit = () => {
    if (editingId && editingTitle.trim()) {
      onRename(editingId, editingTitle.trim());
    }
    setEditingId(null);
    setEditingTitle("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Reports Found</h3>
        <p className="text-muted-foreground">
          Start analyzing documents to see your reports here.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={onSelectAll}
              aria-label="Select all reports"
            />
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 font-semibold"
              onClick={() => onSort("title")}
            >
              Report Title
              {getSortIcon("title")}
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 font-semibold"
              onClick={() => onSort("reportType")}
            >
              Type
              {getSortIcon("reportType")}
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 font-semibold"
              onClick={() => onSort("status")}
            >
              Status
              {getSortIcon("status")}
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 font-semibold"
              onClick={() => onSort("createdAt")}
            >
              Created
              {getSortIcon("createdAt")}
            </Button>
          </TableHead>
          <TableHead>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 font-semibold"
              onClick={() => onSort("updatedAt")}
            >
              Updated
              {getSortIcon("updatedAt")}
            </Button>
          </TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <TableRow
            key={report.id}
            className={cn(
              "cursor-pointer transition-colors hover:bg-muted/50 clickable-row",
              selectedReports.includes(report.id) && "bg-muted/50"
            )}
            onClick={() => onView(report)}
            role="button"
            tabIndex={0}
          >
            <TableCell onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={selectedReports.includes(report.id)}
                onCheckedChange={() => onSelectReport(report.id)}
                aria-label={`Select ${report.title}`}
              />
            </TableCell>
            <TableCell>
              {editingId === report.id ? (
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-8"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={handleSaveEdit}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="font-medium">{report.title}</div>
                  {report.originalFile && (
                    <div className="text-xs text-muted-foreground">
                      {report.originalFile.name}
                    </div>
                  )}
                </div>
              )}
            </TableCell>
            <TableCell className="font-medium">
              {formatReportType(report.reportType)}
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(report.status)}>
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(report.createdAt)}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(report.updatedAt)}
              </div>
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={isLoading}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleStartEdit(report)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {report.status === "completed" && (
                    <>
                      <DropdownMenuItem
                        onClick={() => onExport(report.id, "pdf")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export as PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onExport(report.id, "doc")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export as DOC
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onExport(report.id, "ppt")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export as PPT
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={() => onDelete(report.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
