import { WidgetContainer } from "@/components/atoms/WidgetContainer";

interface SummaryData {
  [key: string]: string | number | boolean | undefined;
}

interface SummaryWidgetProps {
  id: string;
  title: string;
  data: SummaryData;
  editable?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}

export function SummaryWidget({
  id,
  title,
  data,
  editable = true,
  onEdit,
  onRemove,
}: SummaryWidgetProps) {
  const formatValue = (
    value: string | number | boolean | undefined
  ): string => {
    if (value === undefined || value === null) return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
  };

  const formatKey = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <WidgetContainer
      id={id}
      title={title}
      editable={editable}
      onEdit={onEdit}
      onRemove={onRemove}
    >
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between items-start gap-4">
            <span className="text-sm font-medium text-muted-foreground flex-shrink-0">
              {formatKey(key)}:
            </span>
            <span className="text-sm text-foreground text-right break-words">
              {formatValue(value)}
            </span>
          </div>
        ))}
      </div>
    </WidgetContainer>
  );
}
