import { Badge } from "@/components/ui/badge";
import { ReportType, ReportTypeOption } from "@/types";
import { cn } from "@/lib/utils";

interface ReportTypeChipsProps {
  reportTypes: ReportTypeOption[];
  selectedType?: ReportType;
  onSelect: (type: ReportType) => void;
  disabled?: boolean;
}

export function ReportTypeChips({
  reportTypes,
  selectedType,
  onSelect,
  disabled = false,
}: ReportTypeChipsProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Choose the type of document you want to analyze:
      </p>
      <div className="flex flex-wrap gap-2">
        {reportTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            disabled={disabled}
            className={cn(
              "group relative transition-all duration-200",
              disabled && "pointer-events-none opacity-50"
            )}
          >
            <Badge
              variant={selectedType === type.id ? "default" : "outline"}
              className={cn(
                "cursor-pointer px-4 py-2 text-sm transition-all duration-200",
                "hover:shadow-4dp hover:scale-105",
                selectedType === type.id
                  ? "bg-primary text-primary-foreground shadow-8dp"
                  : "hover:bg-muted hover:border-primary/50"
              )}
            >
              {type.label}
            </Badge>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-card border border-border rounded-lg shadow-8dp opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-64">
              <div className="text-xs text-foreground font-medium mb-1">
                {type.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {type.description}
              </div>
              {/* Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-border"></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
