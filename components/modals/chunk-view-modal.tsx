"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare } from "lucide-react";

interface ChunkViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  chunk: {
    id: string;
    text: string;
    wordCount: number;
    questionCount: number;
    size: number;
    content: string;
    fileName: string;
    Questions: any[];
  } | null;
}

export function ChunkViewModal({
  isOpen,
  onClose,
  chunk,
}: ChunkViewModalProps) {
  if (!chunk) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Text Chunk Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Chunk Stats */}
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {chunk.size} words
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {chunk.Questions?.length} questions
            </Badge>
          </div>

          {/* Chunk Text */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Content
            </h3>
            <div className="p-4 bg-muted/50 rounded-lg max-h-96 overflow-y-auto">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {chunk.content}
              </p>
            </div>
          </div>

          {/* Source Information */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{chunk?.fileName}</span>
              {/* <span>•</span>
              <span>Chunk ID: {chunk.id}</span> */}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
