"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Check, X, RefreshCw, ArrowLeft, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateText } from "ai";
import { ChunksDisplay } from "@/components/chunks-display";

interface QAItem {
  id: string;
  chunkId: string;
  chunkText: string;
  question: string;
  answer: string;
  status: "generated" | "edited" | "approved" | "rejected" | "pending";
  isApproved?: boolean;
  confidence?: number;
}

interface Chunk {
  id: string;
  text: string;
  wordCount: number;
  questionCount?: number;
}

interface Document {
  id: number;
  name: string;
  questions: QAItem[];
  chunks: Chunk[];
}

interface QAManagementProps {
  document: Document;
  onBack: () => void;
}

export function QAManagement({ document, onBack }: QAManagementProps) {
  const [questions, setQuestions] = useState<QAItem[]>(
    document.questions || []
  );
  const [selectedQuestion, setSelectedQuestion] = useState<QAItem | null>(null);
  const [editingQuestion, setEditingQuestion] = useState("");
  const [editingAnswer, setEditingAnswer] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [selectedChunkId, setSelectedChunkId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setQuestions(document.questions || []);
  }, [document]);

  const chunksWithQuestionCounts = document.chunks.map((chunk) => ({
    ...chunk,
    questionCount: questions.filter((q) => q.chunkId === chunk.id).length,
  }));

  const handleViewChunkQA = (chunkId: string) => {
    setSelectedChunkId(chunkId);
  };

  const handleEdit = (qa: QAItem) => {
    setSelectedQuestion(qa);
    setEditingQuestion(qa.question);
    setEditingAnswer(qa.answer);
    setCustomPrompt("");
  };

  const handleSave = () => {
    if (!selectedQuestion) return;

    const updatedQuestions = questions.map((q) =>
      q.id === selectedQuestion.id
        ? {
            ...q,
            question: editingQuestion,
            answer: editingAnswer,
            status: "edited" as const,
          }
        : q
    );

    setQuestions(updatedQuestions);
    updateDocumentInStorage(updatedQuestions);
    setSelectedQuestion(null);

    toast({
      title: "Q&A Updated",
      description: "Question and answer have been saved successfully.",
    });
  };

  const handleApprove = (qaId: string) => {
    const updatedQuestions = questions.map((q) =>
      q.id === qaId
        ? { ...q, isApproved: true, status: "approved" as const }
        : q
    );

    setQuestions(updatedQuestions);
    updateDocumentInStorage(updatedQuestions);

    toast({
      title: "Q&A Approved",
      description: "Question and answer approved for dataset.",
    });
  };

  const handleReject = (qaId: string) => {
    const updatedQuestions = questions.map((q) =>
      q.id === qaId
        ? { ...q, isApproved: false, status: "rejected" as const }
        : q
    );

    setQuestions(updatedQuestions);
    updateDocumentInStorage(updatedQuestions);

    toast({
      title: "Q&A Rejected",
      description: "Question and answer marked as rejected.",
    });
  };

  const handleRegenerate = async (qa: QAItem, useCustomPrompt = false) => {
    setIsRegenerating(true);

    try {
      let newAnswer = qa.answer;

      if (useCustomPrompt && customPrompt.trim()) {
        // Use custom prompt for regeneration
        const { text } = await generateText({
          model: "openai/gpt-4o-mini",
          prompt: `Based on the following text chunk and custom instructions, provide an improved answer to the question.

Text chunk:
${qa.chunkText}

Question: ${qa.question}

Custom instructions: ${customPrompt}

Provide a clear, factual answer:`,
          temperature: 0.3,
          maxTokens: 200,
        });
        newAnswer = text.trim();
      } else {
        // Standard regeneration
        const { text } = await generateText({
          model: "openai/gpt-4o-mini",
          prompt: `Based on the following text chunk, provide a comprehensive and accurate answer to the question. The answer should be directly based on the information in the text and be complete but concise.

Text chunk:
${qa.chunkText}

Question: ${qa.question}

Provide a clear, factual answer based solely on the information in the text chunk:`,
          temperature: 0.5,
          maxTokens: 200,
        });
        newAnswer = text.trim();
      }

      const updatedQuestions = questions.map((q) =>
        q.id === qa.id
          ? { ...q, answer: newAnswer, status: "edited" as const }
          : q
      );

      setQuestions(updatedQuestions);
      updateDocumentInStorage(updatedQuestions);
      setEditingAnswer(newAnswer);

      toast({
        title: "Answer Regenerated",
        description: "New answer generated successfully.",
      });
    } catch (error) {
      console.error("Regeneration error:", error);
      toast({
        title: "Regeneration Failed",
        description: "Failed to regenerate answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const updateDocumentInStorage = (updatedQuestions: QAItem[]) => {
    const documents = JSON.parse(localStorage.getItem("documents") || "[]");
    const updatedDocs = documents.map((doc: any) =>
      doc.id === document.id ? { ...doc, questions: updatedQuestions } : doc
    );
    localStorage.setItem("documents", JSON.stringify(updatedDocs));
    window.dispatchEvent(new CustomEvent("documentsUpdated"));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "generated":
        return "secondary";
      case "edited":
        return "default";
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const approvedCount = questions.filter(
    (q) => q.isApproved || q.status === "approved"
  ).length;
  const totalCount = questions.length;

  const filteredQuestions = selectedChunkId
    ? questions.filter((q) => q.chunkId === selectedChunkId)
    : questions;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Documents
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              {document.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {document.chunks.length} chunks • {approvedCount} of {totalCount}{" "}
              Q&A pairs approved
            </p>
          </div>
        </div>
        {selectedChunkId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedChunkId(null)}
          >
            Show All Q&A
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ChunksDisplay
            chunks={chunksWithQuestionCounts}
            onViewChunkQA={handleViewChunkQA}
          />
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">
                  All ({selectedChunkId ? filteredQuestions.length : totalCount}
                  )
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved (
                  {selectedChunkId
                    ? filteredQuestions.filter(
                        (q) => q.isApproved || q.status === "approved"
                      ).length
                    : approvedCount}
                  )
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending (
                  {selectedChunkId
                    ? filteredQuestions.filter(
                        (q) => !q.isApproved && q.status !== "approved"
                      ).length
                    : totalCount - approvedCount}
                  )
                </TabsTrigger>
              </TabsList>
              {selectedChunkId && (
                <Badge variant="outline" className="ml-2">
                  <Hash className="h-3 w-3 mr-1" />
                  Chunk{" "}
                  {document.chunks.findIndex((c) => c.id === selectedChunkId) +
                    1}
                </Badge>
              )}
            </div>

            <TabsContent value="all" className="space-y-4">
              {filteredQuestions.map((qa) => (
                <QACard
                  key={qa.id}
                  qa={qa}
                  onEdit={handleEdit}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onRegenerate={handleRegenerate}
                  getStatusColor={getStatusColor}
                />
              ))}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              {filteredQuestions
                .filter((q) => q.isApproved || q.status === "approved")
                .map((qa) => (
                  <QACard
                    key={qa.id}
                    qa={qa}
                    onEdit={handleEdit}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onRegenerate={handleRegenerate}
                    getStatusColor={getStatusColor}
                  />
                ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {filteredQuestions
                .filter((q) => !q.isApproved && q.status !== "approved")
                .map((qa) => (
                  <QACard
                    key={qa.id}
                    qa={qa}
                    onEdit={handleEdit}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onRegenerate={handleRegenerate}
                    getStatusColor={getStatusColor}
                  />
                ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!selectedQuestion}
        onOpenChange={() => setSelectedQuestion(null)}
      >
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Q&A Pair</DialogTitle>
            <DialogDescription>
              Modify the question and answer, or use a custom prompt to
              regenerate the answer.
            </DialogDescription>
          </DialogHeader>

          {selectedQuestion && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="chunk">
                  Source Text (Chunk{" "}
                  {document.chunks.findIndex(
                    (c) => c.id === selectedQuestion.chunkId
                  ) + 1}
                  )
                </Label>
                <Textarea
                  id="chunk"
                  value={selectedQuestion.chunkText}
                  readOnly
                  className="min-h-[100px] bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  value={editingQuestion}
                  onChange={(e) => setEditingQuestion(e.target.value)}
                  placeholder="Enter the question..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  value={editingAnswer}
                  onChange={(e) => setEditingAnswer(e.target.value)}
                  placeholder="Enter the answer..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">
                  Custom Regeneration Prompt (Optional)
                </Label>
                <Textarea
                  id="prompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Enter custom instructions for regenerating the answer..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleRegenerate(selectedQuestion, false)}
                    disabled={isRegenerating}
                  >
                    {isRegenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate Answer
                      </>
                    )}
                  </Button>

                  {customPrompt.trim() && (
                    <Button
                      variant="outline"
                      onClick={() => handleRegenerate(selectedQuestion, true)}
                      disabled={isRegenerating}
                    >
                      Use Custom Prompt
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedQuestion(null)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface QACardProps {
  qa: QAItem;
  onEdit: (qa: QAItem) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRegenerate: (qa: QAItem) => void;
  getStatusColor: (status: string) => string;
}

function QACard({
  qa,
  onEdit,
  onApprove,
  onReject,
  onRegenerate,
  getStatusColor,
}: QACardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Chunk {qa.chunkId}</Badge>
              <Badge variant={getStatusColor(qa.status)}>{qa.status}</Badge>
              {(qa.isApproved || qa.status === "approved") && (
                <Badge variant="default">Approved</Badge>
              )}
              {/* {qa.confidence && (
                <Badge variant="secondary" className="text-xs">
                  {Math.round(qa.confidence * 100)}% confidence
                </Badge>
              )} */}
            </div>
            <CardTitle className="text-lg">{qa.question}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(qa)}>
              <Edit className="h-4 w-4" />
            </Button>
            {!(qa.isApproved || qa.status === "approved") ? (
              <Button size="sm" onClick={() => onApprove(qa.id)}>
                <Check className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReject(qa.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Answer:
            </h4>
            <p className="text-sm text-foreground leading-relaxed">
              {qa.answer}
            </p>
          </div>

          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              View source text
            </summary>
            <div className="mt-2 p-3 bg-muted rounded-md text-xs">
              {qa.chunkText}
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
}
