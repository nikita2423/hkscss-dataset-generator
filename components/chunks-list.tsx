"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  FileText,
  MessageSquare,
  Eye,
  WandSparkles,
  RefreshCw,
} from "lucide-react";
import { generateDummyDocument, ProjectData, selectedModel } from "@/lib/utils";
import { ChunkViewModal } from "@/components/modals/chunk-view-modal";
import { toast } from "sonner";
import axios from "axios";
import useChunks from "./useChunks";

export function ChunksList({
  chunks,
  onRefresh,
}: {
  chunks: any[];
  onRefresh?: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChunk, setSelectedChunk] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Get dummy data for demonstration
  const dummyDoc = generateDummyDocument();
  const allChunks = chunks;

  const filteredChunks = allChunks.filter((chunk) =>
    chunk.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalWords = allChunks.reduce((sum, chunk) => sum + chunk.size, 0);
  const totalQuestions = allChunks.reduce(
    (sum, chunk) => sum + chunk.Questions?.length,
    0
  );

  const handleViewChunk = (chunk: any) => {
    setSelectedChunk(chunk);
    setIsViewModalOpen(true);
  };

  const handleCreateAutoQuestionTask = async () => {
    if (!ProjectData.id || !selectedModel?.id) {
      toast.error("Select Model first");
      return;
    }

    console.log("Selected Model", selectedModel);
    // toast.success("Creating background task...");

    try {
      // 调用创建任务接口
      const response = await axios.post(
        `http://localhost:1717/api/projects/${ProjectData.id}/tasks`,
        {
          taskType: "question-generation",
          modelInfo: selectedModel,
          language: "en",
          detail: "批量生成问题任务",
        }
      );

      if (response.data?.code === 0) {
        toast.success(
          "Background task created, system will auto process text chunks without generated questions"
        );
      } else {
        toast.error("Task creation failed" + response.data?.message);
      }
    } catch (error: any) {
      console.error("创建自动提取问题任务失败:", error);
      toast.error(
        "Task creation failed: " + (error?.message || "Unknown error")
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Text Chunks</h1>
        <p className="text-muted-foreground">
          View all text chunks extracted from your processed documents
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Chunks</p>
                <p className="text-2xl font-semibold">{allChunks.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Words</p>
                <p className="text-2xl font-semibold">
                  {totalWords.toLocaleString()}
                </p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Generated Questions
                </p>
                <p className="text-2xl font-semibold">{totalQuestions}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search within chunks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {onRefresh && (
          <Button
            variant="outline"
            onClick={onRefresh}
            style={{ cursor: "pointer" }}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        )}
        <Button
          variant="default"
          onClick={handleCreateAutoQuestionTask}
          style={{ cursor: "pointer" }}
        >
          <WandSparkles />
          Generate Questions
        </Button>
      </div>

      {/* Chunks List */}
      <div className="space-y-4">
        {filteredChunks.map((chunk, index) => (
          <Card key={chunk.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg">{chunk.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{chunk.size} words</Badge>
                    <Badge variant="outline">
                      {chunk.Questions?.length} questions
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewChunk(chunk)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {chunk.content}
                  </p>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    <span>{chunk?.fileName}</span>
                    {/* <span>•</span>
                    <span>Chunk ID: {chunk.id}</span> */}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredChunks.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No chunks found</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Upload and process documents to generate text chunks"}
          </p>
        </div>
      )}

      <ChunkViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        chunk={selectedChunk}
      />
    </div>
  );
}
