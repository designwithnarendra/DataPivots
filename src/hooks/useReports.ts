"use client";

import { useState, useEffect, useCallback } from "react";
import { ProcessedReport, ReportType } from "@/types";
import { MOCK_REPORTS } from "@/data/mock/reports";

const REPORTS_STORAGE_KEY = "datapivots-reports";

export type SortField =
  | "title"
  | "createdAt"
  | "updatedAt"
  | "status"
  | "reportType";
export type SortDirection = "asc" | "desc";

interface UseReportsOptions {
  itemsPerPage?: number;
}

export const useReports = (options: UseReportsOptions = {}) => {
  const { itemsPerPage = 10 } = options;

  const [reports, setReports] = useState<ProcessedReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<ProcessedReport[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    ProcessedReport["status"] | "all"
  >("all");
  const [typeFilter, setTypeFilter] = useState<ReportType | "all">("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load reports from localStorage
  useEffect(() => {
    const storedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (storedReports) {
      try {
        const parsed = JSON.parse(storedReports) as ProcessedReport[];
        // Convert date strings back to Date objects
        const reportsWithDates = parsed.map((report) => ({
          ...report,
          createdAt: new Date(report.createdAt),
          updatedAt: new Date(report.updatedAt),
        }));
        setReports(reportsWithDates);
      } catch (error) {
        console.error("Failed to parse stored reports:", error);
        // Fallback to mock data
        setReports(MOCK_REPORTS);
        localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(MOCK_REPORTS));
      }
    } else {
      // Initialize with mock data
      setReports(MOCK_REPORTS);
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(MOCK_REPORTS));
    }
  }, []);

  // Save reports to localStorage whenever they change
  useEffect(() => {
    if (reports.length > 0) {
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
    }
  }, [reports]);

  // Filter and sort reports
  useEffect(() => {
    let filtered = [...reports];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.reportType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (report.originalFile?.name || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((report) => report.reportType === typeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortField) {
        case "title":
          aValue = a.title;
          bValue = b.title;
          break;
        case "createdAt":
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        case "updatedAt":
          aValue = a.updatedAt;
          bValue = b.updatedAt;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "reportType":
          aValue = a.reportType;
          bValue = b.reportType;
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredReports(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    reports,
    searchQuery,
    statusFilter,
    typeFilter,
    sortField,
    sortDirection,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const addReport = useCallback((newReport: ProcessedReport) => {
    setReports((prev) => [newReport, ...prev]);
  }, []);

  const updateReport = useCallback(
    (reportId: string, updates: Partial<ProcessedReport>) => {
      setReports((prev) =>
        prev.map((report) =>
          report.id === reportId
            ? { ...report, ...updates, updatedAt: new Date() }
            : report
        )
      );
    },
    []
  );

  const deleteReport = useCallback(async (reportId: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setReports((prev) => prev.filter((report) => report.id !== reportId));
      setSelectedReports((prev) => prev.filter((id) => id !== reportId));
    } catch (error) {
      console.error("Failed to delete report:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteMultipleReports = useCallback(async (reportIds: string[]) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setReports((prev) =>
        prev.filter((report) => !reportIds.includes(report.id))
      );
      setSelectedReports([]);
    } catch (error) {
      console.error("Failed to delete reports:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renameReport = useCallback(
    async (reportId: string, newTitle: string) => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 300));
        updateReport(reportId, { title: newTitle });
      } catch (error) {
        console.error("Failed to rename report:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [updateReport]
  );

  const getReportById = useCallback(
    (reportId: string) => {
      return reports.find((report) => report.id === reportId);
    },
    [reports]
  );

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField]
  );

  const handleSelectReport = useCallback((reportId: string) => {
    setSelectedReports((prev) =>
      prev.includes(reportId)
        ? prev.filter((id) => id !== reportId)
        : [...prev, reportId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedReports.length === paginatedReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(paginatedReports.map((report) => report.id));
    }
  }, [selectedReports.length, paginatedReports]);

  const clearSelection = useCallback(() => {
    setSelectedReports([]);
  }, []);

  return {
    // Data
    reports: paginatedReports,
    allReports: reports,
    filteredReportsCount: filteredReports.length,
    totalReports: reports.length,

    // Pagination
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,

    // Filters and search
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,

    // Sorting
    sortField,
    sortDirection,
    handleSort,

    // Selection
    selectedReports,
    handleSelectReport,
    handleSelectAll,
    clearSelection,
    isAllSelected:
      selectedReports.length === paginatedReports.length &&
      paginatedReports.length > 0,

    // Actions
    addReport,
    updateReport,
    deleteReport,
    deleteMultipleReports,
    renameReport,
    getReportById,

    // Loading state
    isLoading,
  };
};
