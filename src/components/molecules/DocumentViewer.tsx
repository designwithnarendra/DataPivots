"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ZoomIn, ZoomOut, RotateCw, Download, FileText } from "lucide-react";

interface DocumentViewerProps {
  fileName: string;
  fileUrl: string;
  fileType: string;
}

export function DocumentViewer({
  fileName,
  fileUrl,
  fileType,
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const isPDF = fileType === "application/pdf";
  const isImage = fileType.startsWith("image/");

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Original Document
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground w-12 text-center">
              {zoom}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleRotate}>
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={fileUrl} download={fileName}>
                <Download className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{fileName}</p>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full overflow-auto bg-muted/20 p-4">
          <div
            className="max-w-full mx-auto bg-white shadow-8dp rounded-lg overflow-hidden"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: "center center",
              transition: "transform 0.2s ease-in-out",
            }}
          >
            {isPDF ? (
              <div className="w-full h-[800px] flex items-center justify-center bg-white">
                <div className="text-center space-y-4">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="font-semibold text-lg">PDF Document</h3>
                    <p className="text-sm text-muted-foreground">{fileName}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      PDF viewing is simulated in this demo
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href={fileUrl} download={fileName}>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </a>
                  </Button>
                </div>
              </div>
            ) : isImage ? (
              <div className="p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fileUrl}
                  alt={fileName}
                  className="max-w-full h-auto"
                  style={{ maxHeight: "600px" }}
                />
              </div>
            ) : (
              <div className="w-full h-[400px] flex items-center justify-center bg-white">
                <div className="text-center space-y-4">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
                  <div>
                    <h3 className="font-semibold text-lg">Document Preview</h3>
                    <p className="text-sm text-muted-foreground">{fileName}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      File type: {fileType}
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href={fileUrl} download={fileName}>
                      <Download className="h-4 w-4 mr-2" />
                      Download File
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
