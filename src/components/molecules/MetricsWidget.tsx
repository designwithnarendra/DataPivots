import { WidgetContainer } from "@/components/atoms/WidgetContainer";
import { Badge } from "@/components/ui/badge";

interface MetricItem {
  label: string;
  value: string | number;
  change?: number;
  status?: "positive" | "negative" | "neutral";
  unit?: string;
}

interface MetricsWidgetProps {
  id: string;
  title: string;
  data: Record<string, string | number> | MetricItem[];
  editable?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}

export function MetricsWidget({
  id,
  title,
  data,
  editable = true,
  onEdit,
  onRemove,
}: MetricsWidgetProps) {
  // Convert simple object to MetricItem array if needed
  const metrics: MetricItem[] = Array.isArray(data)
    ? data
    : Object.entries(data).map(([key, value]) => ({
        label: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        value,
      }));

  const formatValue = (value: string | number, unit?: string): string => {
    if (typeof value === "number") {
      // Format large numbers
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      // Format currency
      if (unit === "currency") {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(value);
      }
    }
    return `${value}${unit ? ` ${unit}` : ""}`;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "positive":
        return "bg-success text-success-foreground";
      case "negative":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <WidgetContainer
      id={id}
      title={title}
      editable={editable}
      onEdit={onEdit}
      onRemove={onRemove}
    >
      <div className="grid grid-cols-1 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {metric.label}
              </span>
              {metric.change !== undefined && (
                <Badge
                  variant="outline"
                  className={getStatusColor(metric.status)}
                >
                  {metric.change > 0 ? "+" : ""}
                  {metric.change}%
                </Badge>
              )}
            </div>
            <div className="text-2xl font-bold text-foreground">
              {formatValue(metric.value, metric.unit)}
            </div>
          </div>
        ))}
      </div>
    </WidgetContainer>
  );
}
