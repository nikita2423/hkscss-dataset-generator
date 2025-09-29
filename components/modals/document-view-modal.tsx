"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  MessageSquare,
  FileStack,
  Calendar,
  HardDrive,
} from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface DocumentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: number;
    name: string;
    size: number;
    uploadedAt: string;
    status: "uploaded" | "processing" | "completed";
    chunks: any[];
    questions: any[];
  } | null;
  onViewQA?: () => void;
}

export function DocumentViewModal({
  isOpen,
  onClose,
  document,
  onViewQA,
}: DocumentViewModalProps) {
  if (!document) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploaded":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "processing":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{document.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(document.status)}>
                  {document.status}
                </Badge>
              </div>
            </div>

            {/* Document Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <HardDrive className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">File Size</p>
                  <p className="font-medium">{formatBytes(document.size)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Uploaded</p>
                  <p className="font-medium">
                    {new Date(document.createAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Processing Results */}
          {document.status === "completed" && (
            <div className="space-y-4">
              <h4 className="font-medium">Processing Results</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
                  <FileStack className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Text Chunks</p>
                    <p className="text-xl font-semibold">
                      {document.chunks.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
                  <MessageSquare className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Q&A Pairs</p>
                    <p className="text-xl font-semibold">
                      {document.questions.length}
                    </p>
                  </div>
                </div>
              </div>

              {onViewQA && (
                <Button onClick={onViewQA} className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View Q&A Management
                </Button>
              )}
            </div>
          )}

          {/* Status Information */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  document.status === "completed"
                    ? "bg-green-500"
                    : document.status === "processing"
                    ? "bg-yellow-500"
                    : "bg-blue-500"
                }`}
              />
              <span className="text-sm font-medium">
                {document.status === "completed"
                  ? "Processing Complete"
                  : document.status === "processing"
                  ? "Currently Processing"
                  : "Ready for Processing"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {document.status === "completed"
                ? "Document has been successfully processed and Q&A pairs have been generated."
                : document.status === "processing"
                ? "Document is currently being processed. This may take a few minutes."
                : "Document is uploaded and ready to be processed for Q&A generation."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
