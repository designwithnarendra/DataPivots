import { Widget, WidgetChange } from "@/types";
import { SummaryWidget } from "./SummaryWidget";
import { TableWidget } from "./TableWidget";
import { MetricsWidget } from "./MetricsWidget";
import { ChartWidget } from "./ChartWidget";

interface WidgetRendererProps {
  widget: Widget;
  onEdit?: (widgetId: string) => void;
  onRemove?: (widgetId: string) => void;
  onHistory?: (widgetId: string) => WidgetChange[];
  onRevert?: (widgetId: string, change: WidgetChange) => void;
}

export function WidgetRenderer({
  widget,
  onEdit,
  onRemove,
  onHistory,
  onRevert,
}: WidgetRendererProps) {
  const handleEdit = () => onEdit?.(widget.id);
  const handleRemove = () => onRemove?.(widget.id);
  const handleHistory = onHistory ? () => onHistory(widget.id) : undefined;
  const handleRevert = onRevert
    ? (change: WidgetChange) => onRevert(widget.id, change)
    : undefined;

  switch (widget.type) {
    case "summary":
      return (
        <SummaryWidget
          id={widget.id}
          title={widget.title}
          data={
            widget.data as Record<string, string | number | boolean | undefined>
          }
          editable={widget.editable}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />
      );

    case "table":
      return (
        <TableWidget
          id={widget.id}
          title={widget.title}
          data={
            widget.data as Array<
              Record<string, string | number | boolean | undefined>
            >
          }
          editable={widget.editable}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />
      );

    case "metrics":
      return (
        <MetricsWidget
          id={widget.id}
          title={widget.title}
          data={widget.data as Record<string, string | number>}
          editable={widget.editable}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />
      );

    case "chart":
      // For chart widgets, we need to determine the chart type from the data
      // This is a simplified approach - in a real app, this would be stored in the widget config
      const chartData = widget.data as { type?: string; data: unknown };
      const chartType = chartData.type || "bar"; // Default to bar chart

      return (
        <ChartWidget
          id={widget.id}
          title={widget.title}
          data={
            chartData.data as Array<{
              name: string;
              value: number | string;
              date?: string;
            }>
          }
          chartType={chartType as "bar" | "pie" | "line" | "timeline"}
          editable={widget.editable}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />
      );

    default:
      return (
        <div className="p-4 text-center text-muted-foreground">
          Unknown widget type: {widget.type}
        </div>
      );
  }
}
