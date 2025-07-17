"use client";

import { useState, useCallback } from "react";
import { Widget, WidgetChange } from "@/types";
import { useAuth } from "./useAuth";

export function useChangeTracking() {
  const { user } = useAuth();
  const [changes, setChanges] = useState<WidgetChange[]>([]);

  const trackChange = useCallback(
    (
      widget: Widget,
      changeType: "created" | "updated" | "deleted",
      previousData?: { title: string; data: unknown }
    ) => {
      const change: WidgetChange = {
        id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        widgetId: widget.id,
        version: (widget.version || 0) + 1,
        timestamp: new Date(),
        changeType,
        previousData,
        newData: {
          title: widget.title,
          data: widget.data,
        },
        userEmail: user?.email,
      };

      setChanges((prev) => [...prev, change]);
      return change;
    },
    [user?.email]
  );

  const getWidgetHistory = useCallback(
    (widgetId: string) => {
      return changes
        .filter((change) => change.widgetId === widgetId)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    },
    [changes]
  );

  const getLatestVersion = useCallback(
    (widgetId: string): number => {
      const widgetChanges = getWidgetHistory(widgetId);
      return widgetChanges.length > 0 ? widgetChanges[0].version : 0;
    },
    [getWidgetHistory]
  );

  const revertToVersion = useCallback(
    (widgetId: string, version: number): Widget | null => {
      const change = changes.find(
        (c) => c.widgetId === widgetId && c.version === version
      );
      if (!change) return null;

      // Create a new widget based on the historical data
      return {
        id: widgetId,
        type: "summary", // This would need to be stored in change history in a real app
        title: change.newData.title,
        data: change.newData.data,
        position: { x: 0, y: 0, w: 4, h: 3 }, // Default position
        editable: true,
        version: change.version,
        lastModified: change.timestamp,
      };
    },
    [changes]
  );

  const clearHistory = useCallback((widgetId?: string) => {
    if (widgetId) {
      setChanges((prev) =>
        prev.filter((change) => change.widgetId !== widgetId)
      );
    } else {
      setChanges([]);
    }
  }, []);

  const getRecentChanges = useCallback(
    (limit = 10) => {
      return changes
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);
    },
    [changes]
  );

  const getChangeStats = useCallback(() => {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: changes.length,
      last24h: changes.filter((c) => c.timestamp >= last24h).length,
      lastWeek: changes.filter((c) => c.timestamp >= lastWeek).length,
      byType: {
        created: changes.filter((c) => c.changeType === "created").length,
        updated: changes.filter((c) => c.changeType === "updated").length,
        deleted: changes.filter((c) => c.changeType === "deleted").length,
      },
    };
  }, [changes]);

  return {
    changes,
    trackChange,
    getWidgetHistory,
    getLatestVersion,
    revertToVersion,
    clearHistory,
    getRecentChanges,
    getChangeStats,
  };
}
