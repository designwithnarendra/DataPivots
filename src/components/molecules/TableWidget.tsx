import { WidgetContainer } from "@/components/atoms/WidgetContainer";

interface TableRow {
  [key: string]: string | number | boolean | undefined;
}

interface TableWidgetProps {
  id: string;
  title: string;
  data: TableRow[];
  editable?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}

export function TableWidget({
  id,
  title,
  data,
  editable = true,
  onEdit,
  onRemove,
}: TableWidgetProps) {
  if (!data || data.length === 0) {
    return (
      <WidgetContainer
        id={id}
        title={title}
        editable={editable}
        onEdit={onEdit}
        onRemove={onRemove}
      >
        <div className="text-center py-8 text-muted-foreground">
          No data available
        </div>
      </WidgetContainer>
    );
  }

  const columns = Object.keys(data[0]);

  const formatValue = (
    value: string | number | boolean | undefined
  ): string => {
    if (value === undefined || value === null) return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
  };

  const formatColumnName = (column: string): string => {
    return column
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
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns.map((column) => (
                <th
                  key={column}
                  className="text-left p-2 font-medium text-muted-foreground"
                >
                  {formatColumnName(column)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="border-b border-border/50 hover:bg-muted/50 transition-colors"
              >
                {columns.map((column) => (
                  <td key={column} className="p-2 text-foreground">
                    {formatValue(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetContainer>
  );
}
