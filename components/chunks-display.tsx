"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hash, MessageSquare, Eye } from "lucide-react";

interface Chunk {
  id: string;
  name: string;
  text: string;
  wordCount: number;
  questionCount?: number;
}

interface ChunksDisplayProps {
  chunks: Chunk[];
  onViewChunkQA?: (chunkId: string) => void;
}

export function ChunksDisplay({ chunks, onViewChunkQA }: ChunksDisplayProps) {
  const totalWords = chunks.reduce((sum, chunk) => sum + chunk.wordCount, 0);
  const totalQuestions = chunks.reduce(
    (sum, chunk) => sum + (chunk.questionCount || 0),
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5" />
          Text Chunks
        </CardTitle>
        <CardDescription>
          {chunks.length} chunks • {totalWords} total words • {totalQuestions}{" "}
          questions generated
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chunks.map((chunk, index) => (
            <div
              key={chunk.id}
              className="border border-border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {chunk.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {chunk.wordCount} words
                  </span>
                  {chunk.questionCount && (
                    <Badge variant="secondary" className="text-xs">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {chunk.questionCount} Q&A
                    </Badge>
                  )}
                </div>
                {onViewChunkQA && chunk.questionCount && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewChunkQA(chunk.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Q&A
                  </Button>
                )}
              </div>

              <div className="text-sm text-foreground leading-relaxed">
                <p className="line-clamp-4">{chunk.text}</p>
                {chunk.text.length > 200 && (
                  <Button variant="link" className="p-0 h-auto text-xs mt-1">
                    Show more
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
