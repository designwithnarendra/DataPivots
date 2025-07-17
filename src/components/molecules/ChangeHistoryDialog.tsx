"use client";

import { useState } from "react";
import { Widget, WidgetChange } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  History,
  User,
  Clock,
  RotateCcw,
  Plus,
  Edit3,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ChangeHistoryDialogProps {
  widget: Widget;
  changes: WidgetChange[];
  onRevert?: (change: WidgetChange) => void;
  trigger?: React.ReactNode;
}

export function ChangeHistoryDialog({
  widget,
  changes,
  onRevert,
  trigger,
}: ChangeHistoryDialogProps) {
  const [selectedChange, setSelectedChange] = useState<WidgetChange | null>(
    null
  );

  const getChangeIcon = (changeType: WidgetChange["changeType"]) => {
    switch (changeType) {
      case "created":
        return <Plus className="h-4 w-4 text-success" />;
      case "updated":
        return <Edit3 className="h-4 w-4 text-warning" />;
      case "deleted":
        return <Trash2 className="h-4 w-4 text-destructive" />;
    }
  };

  const getChangeColor = (changeType: WidgetChange["changeType"]) => {
    switch (changeType) {
      case "created":
        return "bg-success text-success-foreground";
      case "updated":
        return "bg-warning text-warning-foreground";
      case "deleted":
        return "bg-destructive text-destructive-foreground";
    }
  };

  const formatChangeDescription = (change: WidgetChange) => {
    const action =
      change.changeType === "created"
        ? "Created"
        : change.changeType === "updated"
          ? "Updated"
          : "Deleted";

    let details = "";
    if (change.changeType === "updated" && change.previousData) {
      const titleChanged = change.previousData.title !== change.newData.title;
      const dataChanged =
        JSON.stringify(change.previousData.data) !==
        JSON.stringify(change.newData.data);

      if (titleChanged && dataChanged) {
        details = " (title and data)";
      } else if (titleChanged) {
        details = " (title)";
      } else if (dataChanged) {
        details = " (data)";
      }
    }

    return `${action} widget${details}`;
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="gap-2">
      <History className="h-4 w-4" />
      History
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Change History: {widget.title}
          </DialogTitle>
          <DialogDescription>
            View and manage all changes made to this widget
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-6 h-full overflow-hidden">
          {/* Changes List */}
          <div className="flex-1">
            <h3 className="font-medium mb-3">Recent Changes</h3>
            <ScrollArea className="h-full">
              <div className="space-y-3">
                {changes.length === 0 ? (
                  <Card className="text-center py-8">
                    <CardContent>
                      <History className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        No changes recorded
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  changes.map((change, index) => (
                    <Card
                      key={change.id}
                      className={`cursor-pointer transition-colors ${
                        selectedChange?.id === change.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedChange(change)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {getChangeIcon(change.changeType)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge
                                  className={getChangeColor(change.changeType)}
                                >
                                  v{change.version}
                                </Badge>
                                <span className="text-sm font-medium">
                                  {formatChangeDescription(change)}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDistanceToNow(change.timestamp, {
                                    addSuffix: true,
                                  })}
                                </div>
                                {change.userEmail && (
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {change.userEmail}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {onRevert &&
                              change.changeType !== "deleted" &&
                              index > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onRevert(change);
                                  }}
                                  className="gap-1"
                                >
                                  <RotateCcw className="h-3 w-3" />
                                  Revert
                                </Button>
                              )}
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Change Details */}
          {selectedChange && (
            <div className="w-1/3 border-l pl-6">
              <h3 className="font-medium mb-3">Change Details</h3>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    {getChangeIcon(selectedChange.changeType)}
                    Version {selectedChange.version}
                  </CardTitle>
                  <CardDescription>
                    {formatDistanceToNow(selectedChange.timestamp, {
                      addSuffix: true,
                    })}
                    {selectedChange.userEmail &&
                      ` by ${selectedChange.userEmail}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current Data */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">New State</h4>
                    <div className="bg-muted rounded p-3">
                      <div className="text-sm">
                        <strong>Title:</strong> {selectedChange.newData.title}
                      </div>
                      <div className="text-sm mt-1">
                        <strong>Data:</strong>
                        <pre className="text-xs mt-1 overflow-auto max-h-32">
                          {JSON.stringify(selectedChange.newData.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Previous Data */}
                  {selectedChange.previousData && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Previous State
                      </h4>
                      <div className="bg-muted/50 rounded p-3">
                        <div className="text-sm">
                          <strong>Title:</strong>{" "}
                          {selectedChange.previousData.title}
                        </div>
                        <div className="text-sm mt-1">
                          <strong>Data:</strong>
                          <pre className="text-xs mt-1 overflow-auto max-h-32">
                            {JSON.stringify(
                              selectedChange.previousData.data,
                              null,
                              2
                            )}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Revert Button */}
                  {onRevert && selectedChange.changeType !== "deleted" && (
                    <Button
                      onClick={() => onRevert(selectedChange)}
                      className="w-full gap-2"
                      variant="outline"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Revert to This Version
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
