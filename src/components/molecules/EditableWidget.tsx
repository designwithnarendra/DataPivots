"use client";

import { useState } from "react";
import { Widget } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, X, Plus, Trash2, AlertCircle } from "lucide-react";

interface EditableWidgetProps {
  widget: Widget;
  onSave: (updatedWidget: Widget) => void;
  onCancel: () => void;
}

export function EditableWidget({
  widget,
  onSave,
  onCancel,
}: EditableWidgetProps) {
  const [editedData, setEditedData] = useState(widget.data);
  const [title, setTitle] = useState(widget.title);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const validateData = (): string | null => {
    if (!title.trim()) {
      return "Widget title is required";
    }

    if (widget.type === "table") {
      const tableData = editedData as Array<
        Record<string, string | number | boolean | undefined>
      >;
      if (!Array.isArray(tableData) || tableData.length === 0) {
        return "Table must have at least one row";
      }
    }

    if (widget.type === "metrics") {
      const metricsData = editedData as Record<string, string | number>;
      if (!metricsData || Object.keys(metricsData).length === 0) {
        return "Metrics must have at least one item";
      }
    }

    return null;
  };

  const handleSave = async () => {
    setError(null);

    const validationError = validateData();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    try {
      // Simulate async save operation
      await new Promise((resolve) => setTimeout(resolve, 500));

      onSave({
        ...widget,
        title: title.trim(),
        data: editedData,
      });
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderEditableContent = () => {
    switch (widget.type) {
      case "summary":
        return <SummaryEditor data={editedData} onChange={setEditedData} />;
      case "table":
        return <TableEditor data={editedData} onChange={setEditedData} />;
      case "metrics":
        return <MetricsEditor data={editedData} onChange={setEditedData} />;
      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            Editing not available for this widget type
          </div>
        );
    }
  };

  return (
    <Card className="border-primary shadow-8dp">
      <CardHeader className="bg-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Label htmlFor="widget-title" className="text-sm font-medium">
              Widget Title
            </Label>
            <Input
              id="widget-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {renderEditableContent()}

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onCancel}
            className="gap-2"
            disabled={isSaving}
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2" disabled={isSaving}>
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryEditor({
  data,
  onChange,
}: {
  data: unknown;
  onChange: (newData: unknown) => void;
}) {
  const summaryData = data as Record<
    string,
    string | number | boolean | undefined
  >;

  const updateField = (key: string, value: string | number | boolean) => {
    onChange({
      ...summaryData,
      [key]: value,
    });
  };

  const addField = () => {
    const newKey = `newField${Object.keys(summaryData).length + 1}`;
    onChange({
      ...summaryData,
      [newKey]: "",
    });
  };

  const removeField = (key: string) => {
    const newData = { ...summaryData };
    delete newData[key];
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Summary Fields</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={addField}
          className="gap-2"
        >
          <Plus className="h-3 w-3" />
          Add Field
        </Button>
      </div>

      {Object.entries(summaryData).map(([key, value]) => (
        <div key={key} className="flex gap-2 items-end">
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">Field Name</Label>
            <Input
              value={key}
              onChange={(e) => {
                const newData = { ...summaryData };
                delete newData[key];
                newData[e.target.value] = value;
                onChange(newData);
              }}
              className="h-8"
            />
          </div>
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">Value</Label>
            <Input
              value={String(value || "")}
              onChange={(e) => updateField(key, e.target.value)}
              className="h-8"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeField(key)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}

function TableEditor({
  data,
  onChange,
}: {
  data: unknown;
  onChange: (newData: unknown) => void;
}) {
  const tableData = data as Array<
    Record<string, string | number | boolean | undefined>
  >;

  if (!Array.isArray(tableData) || tableData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No table data to edit
      </div>
    );
  }

  const columns = Object.keys(tableData[0]);

  const updateCell = (
    rowIndex: number,
    column: string,
    value: string | number
  ) => {
    const newData = [...tableData];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [column]: value,
    };
    onChange(newData);
  };

  const addRow = () => {
    const newRow = columns.reduce(
      (row, col) => {
        row[col] = "";
        return row;
      },
      {} as Record<string, string>
    );
    onChange([...tableData, newRow]);
  };

  const removeRow = (index: number) => {
    onChange(tableData.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Table Data</h4>
        <Button variant="outline" size="sm" onClick={addRow} className="gap-2">
          <Plus className="h-3 w-3" />
          Add Row
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="text-left p-3 font-medium text-sm"
                  >
                    {column}
                  </th>
                ))}
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t">
                  {columns.map((column) => (
                    <td key={column} className="p-2">
                      <Input
                        value={String(row[column] || "")}
                        onChange={(e) =>
                          updateCell(rowIndex, column, e.target.value)
                        }
                        className="h-8 border-0 bg-transparent focus:bg-background"
                      />
                    </td>
                  ))}
                  <td className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRow(rowIndex)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricsEditor({
  data,
  onChange,
}: {
  data: unknown;
  onChange: (newData: unknown) => void;
}) {
  const metricsData = data as Record<string, string | number>;

  const updateMetric = (key: string, value: string | number) => {
    onChange({
      ...metricsData,
      [key]: value,
    });
  };

  const addMetric = () => {
    const newKey = `newMetric${Object.keys(metricsData).length + 1}`;
    onChange({
      ...metricsData,
      [newKey]: 0,
    });
  };

  const removeMetric = (key: string) => {
    const newData = { ...metricsData };
    delete newData[key];
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Metrics</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={addMetric}
          className="gap-2"
        >
          <Plus className="h-3 w-3" />
          Add Metric
        </Button>
      </div>

      {Object.entries(metricsData).map(([key, value]) => (
        <div key={key} className="flex gap-2 items-end">
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">Metric Name</Label>
            <Input
              value={key}
              onChange={(e) => {
                const newData = { ...metricsData };
                delete newData[key];
                newData[e.target.value] = value;
                onChange(newData);
              }}
              className="h-8"
            />
          </div>
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">Value</Label>
            <Input
              value={String(value)}
              onChange={(e) => {
                const numValue = parseFloat(e.target.value);
                updateMetric(key, isNaN(numValue) ? e.target.value : numValue);
              }}
              className="h-8"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeMetric(key)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}
