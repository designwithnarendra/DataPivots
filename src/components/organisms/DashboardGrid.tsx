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

  // Function to get minimum dimensions based on widget type
  const getMinDimensions = (widget: Widget) => {
    switch (widget.type) {
      case "chart":
        // Charts need minimum space to be readable
        return { minW: 4, minH: 5 };
      case "table":
        // Tables need width for columns and height for rows
        return { minW: 4, minH: 4 };
      case "metrics":
        // Metrics can be smaller but need decent space for numbers
        return { minW: 2, minH: 3 };
      case "summary":
        // Summary widgets need space for text
        return { minW: 3, minH: 4 };
      default:
        return { minW: 2, minH: 3 };
    }
  };

  // Convert widgets to grid layout format
  const layouts = {
    lg: widgets.map((widget) => {
      const { minW, minH } = getMinDimensions(widget);
      return {
        i: widget.id,
        x: widget.position.x,
        y: widget.position.y,
        w: Math.max(widget.position.w, minW),
        h: Math.max(widget.position.h, minH),
        minW,
        minH,
      };
    }),
    md: widgets.map((widget) => {
      const { minW, minH } = getMinDimensions(widget);
      return {
        i: widget.id,
        x: widget.position.x % 8, // Adjust for smaller grid
        y: widget.position.y,
        w: Math.max(Math.min(widget.position.w, 8), minW),
        h: Math.max(widget.position.h, minH),
        minW,
        minH,
      };
    }),
    sm: widgets.map((widget) => {
      const { minW, minH } = getMinDimensions(widget);
      return {
        i: widget.id,
        x: widget.position.x % 6,
        y: widget.position.y,
        w: Math.max(Math.min(widget.position.w, 6), minW),
        h: Math.max(widget.position.h, minH),
        minW,
        minH,
      };
    }),
    xs: widgets.map((widget) => {
      const { minW, minH } = getMinDimensions(widget);
      return {
        i: widget.id,
        x: 0,
        y: widget.position.y,
        w: Math.max(4, minW),
        h: Math.max(widget.position.h, minH),
        minW: Math.max(4, minW),
        minH,
      };
    }),
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
        resizeHandles={["se", "sw", "ne", "nw", "s", "n", "e", "w"]}
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

        /* Bottom-right corner handle (main resize handle) */
        .react-grid-item
          > .react-resizable-handle.react-resizable-handle-se::after {
          border: none !important;
          content: "⋰" !important;
          position: absolute !important;
          right: 1px !important;
          bottom: 1px !important;
          width: 12px !important;
          height: 12px !important;
          background: hsl(var(--background)) !important;
          color: hsl(var(--primary)) !important;
          font-size: 12px !important;
          line-height: 12px !important;
          text-align: center !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 2px !important;
        }

        /* Edge handles - horizontal */
        .react-grid-item > .react-resizable-handle.react-resizable-handle-s,
        .react-grid-item > .react-resizable-handle.react-resizable-handle-n {
          background: hsl(var(--primary) / 0.5) !important;
          border-radius: 2px !important;
          height: 4px !important;
        }

        /* Edge handles - vertical */
        .react-grid-item > .react-resizable-handle.react-resizable-handle-e,
        .react-grid-item > .react-resizable-handle.react-resizable-handle-w {
          background: hsl(var(--primary) / 0.5) !important;
          border-radius: 2px !important;
          width: 4px !important;
        }

        /* Corner handles */
        .react-grid-item > .react-resizable-handle.react-resizable-handle-sw,
        .react-grid-item > .react-resizable-handle.react-resizable-handle-ne,
        .react-grid-item > .react-resizable-handle.react-resizable-handle-nw {
          background: hsl(var(--primary) / 0.6) !important;
          border-radius: 50% !important;
          width: 8px !important;
          height: 8px !important;
        }

        .widget-container {
          height: 100%;
          overflow: hidden;
          padding: 12px;
        }
      `}</style>
    </div>
  );
}
