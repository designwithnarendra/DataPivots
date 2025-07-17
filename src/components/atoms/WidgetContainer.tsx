import { ReactNode, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit3, GripVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface WidgetContainerProps {
  id: string;
  title: string;
  children: ReactNode;
  editable?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
  isDragging?: boolean;
  className?: string;
}

export function WidgetContainer({
  title,
  children,
  editable = true,
  onEdit,
  onRemove,
  isDragging = false,
  className,
}: WidgetContainerProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={cn(
        "group relative transition-all duration-200 h-full",
        "hover:shadow-8dp",
        isDragging && "rotate-2 scale-105 shadow-16dp z-50",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle */}
      <div
        className={cn(
          "absolute top-2 left-2 opacity-0 transition-opacity duration-200 cursor-move z-10",
          (isHovered || isDragging) && "opacity-70 hover:opacity-100",
          "react-grid-draghandle" // This class is used by react-grid-layout
        )}
      >
        <div className="p-1 bg-muted rounded hover:bg-muted-foreground/20">
          <GripVertical className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>

      {/* Widget Actions */}
      <div
        className={cn(
          "absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity duration-200 z-10",
          (isHovered || isDragging) && "opacity-100"
        )}
      >
        {editable && onEdit && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 bg-background/80 hover:bg-background"
            onClick={onEdit}
          >
            <Edit3 className="h-3 w-3" />
          </Button>
        )}
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
            onClick={onRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold font-heading pr-16">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}
