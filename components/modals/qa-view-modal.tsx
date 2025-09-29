"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface QAViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  qa: {
    id: string;
    question: string;
    answer: string;
    status: string;
    confidence: number;
    chunkId: string;
  } | null;
}

export function QAViewModal({ isOpen, onClose, qa }: QAViewModalProps) {
  if (!qa) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-500";
    if (confidence >= 0.8) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Q&A Pair Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Confidence */}
          <div className="flex items-center gap-3">
            {/* <Badge className={getStatusColor(qa.status)}>{qa.status}</Badge> */}
            {/* <span
              className={`text-sm font-medium ${getConfidenceColor(
                qa.confidence
              )}`}
            >
              {Math.round(qa.confidence * 100)}% confidence
            </span> */}
          </div>

          {/* Question */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Question
            </h3>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm leading-relaxed">{qa.question}</p>
            </div>
          </div>

          {/* Answer */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Answer
            </h3>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm leading-relaxed">
                {qa?.answers?.length !== 0
                  ? qa.answers?.[qa.answers?.length - 1]?.answer
                  : "No answer available"}
              </p>
            </div>
          </div>

          {/* Source Information */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Source:</span>
              {/* <span>•</span> */}
              <span>From: {qa.chunk?.name ? qa.chunk?.name : "N/A"}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
