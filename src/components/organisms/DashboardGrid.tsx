"use client";

import { useEffect, useState } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import { Widget, WidgetChange } from "@/types";
import { WidgetRenderer } from "@/components/molecules/WidgetRenderer";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  widgets: Widget[];
  onLayoutChange?: (layout: Layout[]) => void;
  onWidgetEdit?: (widgetId: string) => void;
  onWidgetRemove?: (widgetId: string) => void;
  onWidgetHistory?: (widgetId: string) => WidgetChange[];
  onRevertWidget?: (widgetId: string, change: WidgetChange) => void;
  editable?: boolean;
}

export function DashboardGrid({
  widgets,
  onLayoutChange,
  onWidgetEdit,
  onWidgetRemove,
  onWidgetHistory,
  onRevertWidget,
  editable = true,
}: DashboardGridProps) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map((widget) => (
          <div key={widget.id} className="h-80">
            <WidgetRenderer
              widget={widget}
              onEdit={onWidgetEdit}
              onRemove={onWidgetRemove}
              onHistory={onWidgetHistory}
              onRevert={onRevertWidget}
            />
          </div>
        ))}
      </div>
    );
  }

  // Convert widgets to grid layout format
  const layouts = {
    lg: widgets.map((widget) => ({
      i: widget.id,
      x: widget.position.x,
      y: widget.position.y,
      w: widget.position.w,
      h: widget.position.h,
      minW: 2,
      minH: 2,
    })),
    md: widgets.map((widget) => ({
      i: widget.id,
      x: widget.position.x % 8, // Adjust for smaller grid
      y: widget.position.y,
      w: Math.min(widget.position.w, 8),
      h: widget.position.h,
      minW: 2,
      minH: 2,
    })),
    sm: widgets.map((widget) => ({
      i: widget.id,
      x: widget.position.x % 6,
      y: widget.position.y,
      w: Math.min(widget.position.w, 6),
      h: widget.position.h,
      minW: 2,
      minH: 2,
    })),
    xs: widgets.map((widget) => ({
      i: widget.id,
      x: 0,
      y: widget.position.y,
      w: 4,
      h: widget.position.h,
      minW: 4,
      minH: 2,
    })),
  };

  const breakpoints = {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
  };

  const cols = {
    lg: 12,
    md: 8,
    sm: 6,
    xs: 4,
  };

  return (
    <div className="w-full">
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={60}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        isDraggable={editable}
        isResizable={editable}
        onLayoutChange={(layout) => {
          if (onLayoutChange) {
            onLayoutChange(layout);
          }
        }}
        draggableHandle=".react-grid-draghandle"
        // Custom styles for responsive behavior
        compactType="vertical"
        preventCollision={false}
      >
        {widgets.map((widget) => (
          <div key={widget.id} className="widget-container">
            <WidgetRenderer
              widget={widget}
              onEdit={onWidgetEdit}
              onRemove={onWidgetRemove}
              onHistory={onWidgetHistory}
              onRevert={onRevertWidget}
            />
          </div>
        ))}
      </ResponsiveGridLayout>

      <style jsx global>{`
        .react-grid-item.react-grid-placeholder {
          background: hsl(var(--primary)) !important;
          border-radius: 8px !important;
          opacity: 0.2 !important;
          transition: all 200ms ease !important;
        }

        .react-grid-item.resizing {
          opacity: 0.8;
          z-index: 3;
        }

        .react-grid-item.react-draggable-dragging {
          transition: none !important;
          z-index: 3;
        }

        .react-grid-item > .react-resizable-handle {
          background: hsl(var(--primary)) !important;
          border-radius: 2px !important;
          opacity: 0 !important;
          transition: opacity 200ms ease !important;
        }

        .react-grid-item:hover > .react-resizable-handle {
          opacity: 0.6 !important;
        }

        .react-grid-item > .react-resizable-handle:hover {
          opacity: 1 !important;
        }

        .react-grid-item > .react-resizable-handle::after {
          border: none !important;
          content: "" !important;
          position: absolute !important;
          right: 1px !important;
          bottom: 1px !important;
          width: 8px !important;
          height: 8px !important;
          background: linear-gradient(
            -45deg,
            transparent 40%,
            hsl(var(--primary-foreground)) 40%,
            hsl(var(--primary-foreground)) 60%,
            transparent 60%
          ) !important;
        }

        .widget-container {
          height: 100%;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
