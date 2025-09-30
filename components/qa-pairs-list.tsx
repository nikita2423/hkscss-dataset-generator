"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Search,
  Eye,
  Edit,
  Check,
  FileText,
  MessageSquare,
  WandSparkles,
  Trash2,
  RefreshCw,
} from "lucide-react";
import {
  API_URL,
  generateDummyDocument,
  ProjectData,
  selectedModel,
} from "@/lib/utils";
import { QAViewModal } from "@/components/modals/qa-view-modal";
import { QAEditModal } from "@/components/modals/qa-edit-modal";
import { QACreateModal } from "@/components/modals/qa-create-modal";
import axios from "axios";
import { toast } from "sonner";
import { useGenerateDataset } from "./useGenerateDataset";

export function QAPairsList({ chunks }: { chunks: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedQA, setSelectedQA] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [questions, setQuestions] = useState<{
    data?: any[];
    total?: number;
    page?: number;
    size?: number;
    totalPages?: number;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  // const [chunks, setChunks] = useState([]);
  const { generateSingleDataset } = useGenerateDataset();
  const [generationInProgress, setGenerationInProgress] = useState(false);
  const [processingQuestions, setProcessingQuestions] = useState<{
    [key: string]: boolean;
  }>({});
  const [tags, setTags] = useState([]);

  const getQuestionList = async (page = currentPage, size = pageSize) => {
    try {
      setLoading(true);
      // 获取问题列表
      const questionsResponse = await axios.get(
        `${API_URL}/api/projects/${ProjectData.id}/questions?page=${page}&size=${size}&status=${selectedStatus}&input=${searchTerm}`
      );
      if (questionsResponse.status !== 200) {
        throw new Error("Failed to fetch questions");
      }
      const questionsData = questionsResponse.data;
      setQuestions({
        ...questionsData,
        totalPages: Math.ceil(questionsData.total / size),
      });

      // 获取标签树 (只fetch once or when needed)
      if (tags.length === 0) {
        const tagsResponse = await axios.get(
          `${API_URL}/api/projects/${ProjectData.id}/tags`
        );
        if (tagsResponse.status === 200) {
          setTags(tagsResponse.data.tags || []);
        }
      }
    } catch (error: any) {
      console.error("Failed to fetch questions", error);
      toast.error(error?.message || "Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  // const getChunksList = async () => {
  //   try {
  //     const chunksResponse = await axios.get(
  //       `http://localhost:1717/api/projects/${ProjectData.id}/chunks`
  //     );
  //     if (chunksResponse.status === 200) {
  //       setChunks(chunksResponse.data.data || []);
  //     }
  //   } catch (error: any) {
  //     console.error("Failed to fetch chunks", error);
  //   }
  // };

  const getRootTags = async () => {};

  useEffect(() => {
    getQuestionList(currentPage, pageSize);
  }, [
    generationInProgress,
    searchTerm,
    currentPage,
    pageSize,
    selectedStatus,
    isEditModalOpen,
  ]);

  // Add a separate effect to refresh data periodically when processing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (Object.values(processingQuestions).some(Boolean)) {
      interval = setInterval(() => {
        getQuestionList();
      }, 1000); // Refresh every 1 second while processing (more aggressive)
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [processingQuestions]);

  // Manual refresh function
  const handleManualRefresh = async () => {
    await getQuestionList(currentPage, pageSize);
    toast.success("Questions refreshed!");
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < (questions.totalPages || 1)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Get dummy data for demonstration
  // const dummyDoc = generateDummyDocument();
  // const allQuestions = dummyDoc.questions;

  // Use server-side filtered questions directly (no client-side filtering needed)
  const filteredQuestions = questions?.data || [];

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

  const approvedCount = questions?.data?.filter(
    (q) => q.status === "approved"
  ).length;
  const pendingCount = questions?.data?.filter(
    (q) => q.status === "pending"
  ).length;
  const totalCount = questions?.total;

  const handleView = (qa: any) => {
    setSelectedQA(qa);
    setIsViewModalOpen(true);
  };

  const handleEdit = (qa: any) => {
    setSelectedQA(qa);
    setIsEditModalOpen(true);
  };

  const handleSaveQA = (updatedQA: any) => {
    // In a real app, this would update the backend
    console.log("[v0] Saving updated Q&A:", updatedQA);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this question? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_URL}/api/projects/${ProjectData.id}/questions/${questionId}`
      );

      if (response.status === 200 || response.status === 204) {
        toast.success("Question deleted successfully");
        getQuestionList(); // Refresh the questions list
      } else {
        toast.error("Failed to delete question");
      }
    } catch (error: any) {
      console.error("Failed to delete question:", error);
      toast.error(
        "Failed to delete question: " + (error?.message || "Unknown error")
      );
    }
  };

  // const handleCreateQuestion = async (questionData: any) => {
  //   try {
  //     const response = await axios.post(
  //       `http://localhost:1717/api/projects/${ProjectData.id}/questions`,
  //       {
  //         question: questionData.question,
  //         chunkId: questionData.chunkId,
  //         label: questionData.label,
  //       }
  //     );

  //     if (response.status === 200 || response.status === 201) {
  //       toast.success("Question created successfully");
  //       getQuestionList(); // Refresh the questions list
  //     } else {
  //       toast.error("Failed to create question");
  //     }
  //   } catch (error: any) {
  //     console.error("Failed to create question:", error);
  //     toast.error(
  //       "Failed to create question: " + (error?.message || "Unknown error")
  //     );
  //   }
  // };

  const handleSubmitQuestion = async (formData: any) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/projects/${ProjectData.id}/questions`,
        {
          question: formData.question,
          chunkId: formData.chunkId,
          label: formData.label,
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Question created successfully");
        getQuestionList(); // Refresh the questions list
      } else {
        toast.error("Failed to create question");
      }
    } catch (error: any) {
      console.error("操作失败:", error);
      toast.error(
        "Failed to create question: " + (error?.message || "Unknown error")
      );
    }
  };

  const handleAutoGenerateDatasets = async () => {
    try {
      if (!selectedModel) {
        toast.error("Select Model first");
        return;
      }

      // 调用创建任务接口
      const response = await axios.post(
        `/api/projects/${ProjectData.id}/tasks`,
        {
          taskType: "answer-generation",
          modelInfo: selectedModel,
          language: "en",
        }
      );

      if (response.data?.code === 0) {
        toast.success("Background task created for generating answers");
      } else {
        toast.error("Failed to create background task");
      }
    } catch (error: any) {
      console.error("创建任务失败:", error);
      toast.error(
        "Failed to create background task: " +
          (error?.message || "Unknown error")
      );
    }
  };

  const handleGenerateDataset = async (
    questionId: string,
    questionInfo: any
  ) => {
    // Set processing state for this specific question
    setProcessingQuestions((prev) => ({
      ...prev,
      [questionId]: true,
    }));

    try {
      const projectId = ProjectData.id;
      setGenerationInProgress(true);

      await generateSingleDataset({ projectId, questionId, questionInfo });

      // Multiple refresh attempts to ensure we get the updated answer
      let retryCount = 0;
      const maxRetries = 10;
      let answerFound = false;

      while (retryCount < maxRetries && !answerFound) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second between retries
        await getQuestionList();

        // Check if the answer is now available
        const updatedQuestions = await axios.get(
          `${API_URL}/api/projects/${ProjectData.id}/questions?page=${currentPage}&size=${pageSize}&status=${selectedStatus}&input=${searchTerm}`
        );

        const updatedQuestion = updatedQuestions.data.data.find(
          (q: any) => q.id === questionId
        );
        if (updatedQuestion?.answers?.length > 0) {
          answerFound = true;
          toast.success("Answer generated successfully!");
        }

        retryCount++;
      }

      if (!answerFound) {
        toast.warning(
          "Answer generation completed, but may take a moment to appear. Please refresh if needed."
        );
      }
    } catch (error: any) {
      console.error("Failed to generate answer:", error);
      toast.error(
        "Failed to generate answer: " + (error?.message || "Unknown error")
      );
    } finally {
      // Reset processing state
      setProcessingQuestions((prev) => ({
        ...prev,
        [questionId]: false,
      }));
      setGenerationInProgress(false);
    }
  };

  // console.log("Filtered Questions", filteredQuestions);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Q&A Pairs</h1>
        <p className="text-muted-foreground">
          View and manage all question-answer pairs across your documents
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Q&A Pairs</p>
                <p className="text-2xl font-semibold">{totalCount}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-semibold text-green-500">
                  {approvedCount}
                </p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-semibold text-yellow-500">
                  {pendingCount}
                </p>
              </div>
              <Eye className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions and answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          variant="outline"
          onClick={handleManualRefresh}
          style={{ cursor: "pointer" }}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>

        <Button
          variant="outline"
          onClick={() => setIsCreateModalOpen(true)}
          style={{ cursor: "pointer" }}
        >
          Create Question
        </Button>

        {/* <Button
          variant="default"
          onClick={handleAutoGenerateDatasets}
          style={{ cursor: "pointer" }}
        >
          <WandSparkles />
          Generate Answers
        </Button> */}

        <Tabs
          value={selectedStatus}
          onValueChange={setSelectedStatus}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Q&A Pairs List */}
      <div className="space-y-4">
        {filteredQuestions?.map((qa) => (
          <Card key={qa.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-relaxed">
                    {qa.question}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    {/* <Badge className={getStatusColor(qa.status)}>
                      {qa.status}
                    </Badge> */}
                    {/* <span
                      className={`text-sm font-medium ${getConfidenceColor(
                        qa.confidence
                      )}`}
                    >
                      {Math.round(qa.confidence * 100)}% confidence
                    </span> */}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateDataset(qa.id, qa.question)}
                    disabled={processingQuestions[qa.id]}
                  >
                    <WandSparkles
                      className={`h-4 w-4 mr-1 ${
                        processingQuestions[qa.id] ? "animate-spin" : ""
                      }`}
                    />
                    {processingQuestions[qa.id] ? "Generating..." : "Answer"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(qa)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {qa?.answers?.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(qa)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteQuestion(qa.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Answer:
                  </h4>
                  <p className="text-sm leading-relaxed">
                    {qa?.answers?.length !== 0
                      ? qa.answers?.[qa.answers?.length - 1]?.answer
                      : "No answer available"}
                  </p>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    <span>Source:</span>
                    {/* <span>•</span> */}
                    <span>From: {qa.chunk.name}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      )}

      {!loading && filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Q&A pairs found</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Upload and process documents to generate Q&A pairs"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && questions.total && questions.total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, questions.total)} of{" "}
              {questions.total} questions
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Items per page:
              </span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="border border-border rounded px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePreviousPage();
                    }}
                    className={
                      currentPage <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {/* Generate page numbers */}
                {Array.from(
                  { length: Math.min(questions.totalPages || 1, 5) },
                  (_, i) => {
                    let pageNum;
                    const totalPages = questions.totalPages || 1;

                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else {
                      if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNum);
                          }}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                )}

                {questions.totalPages &&
                  questions.totalPages > 5 &&
                  currentPage < questions.totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNextPage();
                    }}
                    className={
                      currentPage >= (questions.totalPages || 1)
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}

      <QAViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        qa={selectedQA}
      />

      <QAEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        qa={selectedQA}
        onSave={handleSaveQA}
      />

      <QACreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSubmitQuestion}
        chunks={chunks}
        tags={tags}
      />
    </div>
  );
}
