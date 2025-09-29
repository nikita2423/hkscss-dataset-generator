"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Play, Eye, Trash2, Loader2, Plus, Info } from "lucide-react";
import { formatBytes, generateDummyDocument } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { DocumentViewModal } from "@/components/modals/document-view-modal";

interface Document {
  id: number;
  name: string;
  size: number;
  uploadedAt: string;
  status: "uploaded" | "processing" | "completed";
  chunks: any[];
  questions: any[];
}

interface DocumentListProps {
  onViewQA?: (document: Document) => void;
  documentList: any;
}

export function DocumentList({ onViewQA, documentList }: DocumentListProps) {
  // const [documents, setDocuments] = useState<Document[]>([]);
  const [processingDocs, setProcessingDocs] = useState<Set<number>>(new Set());
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { toast } = useToast();

  // useEffect(() => {
  //   const loadDocuments = () => {
  //     const stored = localStorage.getItem("documents");
  //     if (stored) {
  //       const docs = JSON.parse(stored);
  //       setDocuments(docs);
  //     } else {
  //       const dummyDoc = generateDummyDocument();
  //       setDocuments([dummyDoc]);
  //       localStorage.setItem("documents", JSON.stringify([dummyDoc]));
  //     }
  //   };

  //   loadDocuments();

  //   const handleDocumentsUpdated = () => {
  //     loadDocuments();
  //   };

  //   window.addEventListener("documentsUpdated", handleDocumentsUpdated);
  //   return () =>
  //     window.removeEventListener("documentsUpdated", handleDocumentsUpdated);
  // }, []);

  // const addDummyDocument = () => {
  //   const dummyDoc = generateDummyDocument();
  //   const updatedDocs = [...documents, dummyDoc];
  //   setDocuments(updatedDocs);
  //   localStorage.setItem("documents", JSON.stringify(updatedDocs));

  //   toast({
  //     title: "Demo document added",
  //     description:
  //       "Added a sample processed document with chunks and Q&A pairs.",
  //   });
  // };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsViewModalOpen(true);
  };

  const handleViewQAFromModal = () => {
    setIsViewModalOpen(false);
    if (selectedDocument && onViewQA) {
      onViewQA(selectedDocument);
    }
  };

  const handleProcess = async (docId: number) => {
    setProcessingDocs((prev) => new Set(prev).add(docId));

    // Update status to processing
    const updatedDocs = documents.map((doc) =>
      doc.id === docId ? { ...doc, status: "processing" as const } : doc
    );
    setDocuments(updatedDocs);
    localStorage.setItem("documents", JSON.stringify(updatedDocs));

    try {
      // Simulate document content extraction (in real app, this would extract PDF text)
      const sampleContent = `This is a sample document content for processing. 

In this document, we explore various concepts related to artificial intelligence and machine learning. The field of AI has evolved significantly over the past decades, with breakthrough developments in neural networks, deep learning, and natural language processing.

Machine learning algorithms can be categorized into three main types: supervised learning, unsupervised learning, and reinforcement learning. Each category serves different purposes and is suitable for different types of problems.

Supervised learning involves training models on labeled data, where the correct answers are provided during training. This approach is commonly used for classification and regression tasks.

Unsupervised learning, on the other hand, works with unlabeled data to discover hidden patterns and structures. Common techniques include clustering, dimensionality reduction, and association rule learning.

Reinforcement learning is inspired by behavioral psychology and involves an agent learning to make decisions by interacting with an environment and receiving rewards or penalties for its actions.

The applications of these technologies are vast and continue to expand across industries including healthcare, finance, transportation, and entertainment.`;

      const response = await fetch("/api/process-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: docId,
          documentName: documents.find((d) => d.id === docId)?.name,
          documentContent: sampleContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Processing failed");
      }

      const result = await response.json();

      // Update document with results
      const finalDocs = documents.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              status: "completed" as const,
              chunks: result.results.reduce((acc: any[], qa: any) => {
                const existingChunk = acc.find((c) => c.id === qa.chunkId);
                if (!existingChunk) {
                  acc.push({
                    id: qa.chunkId,
                    text: qa.chunkText,
                    wordCount: qa.chunkText.split(" ").length,
                  });
                }
                return acc;
              }, []),
              questions: result.results,
            }
          : doc
      );

      setDocuments(finalDocs);
      localStorage.setItem("documents", JSON.stringify(finalDocs));

      toast({
        title: "Processing completed",
        description: `Generated ${result.chunks} chunks and ${result.questions} Q&A pairs.`,
      });

      window.dispatchEvent(new CustomEvent("documentsUpdated"));
    } catch (error) {
      console.error("Processing error:", error);
      toast({
        title: "Processing failed",
        description: "There was an error processing the document.",
        variant: "destructive",
      });

      // Revert status
      const revertedDocs = documents.map((doc) =>
        doc.id === docId ? { ...doc, status: "uploaded" as const } : doc
      );
      setDocuments(revertedDocs);
      localStorage.setItem("documents", JSON.stringify(revertedDocs));
    } finally {
      setProcessingDocs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(docId);
        return newSet;
      });
    }
  };

  const handleDelete = (docId: number) => {
    // const updatedDocs = documents.filter((doc) => doc.id !== docId);
    // setDocuments(updatedDocs);
    // localStorage.setItem("documents", JSON.stringify(updatedDocs));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploaded":
        return "secondary";
      case "processing":
        return "default";
      case "completed":
        return "default";
      default:
        return "secondary";
    }
  };

  const handleViewQA = (doc: Document) => {
    if (onViewQA) {
      onViewQA(doc);
    } else {
      // Default behavior - could navigate to Q&A management
      console.log("View Q&A for document:", doc.name);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </CardTitle>
          <CardDescription className="flex items-center justify-between">
            <span>
              Manage your uploaded documents and their Q&A generation status
            </span>
            {/* <Button size="sm" variant="outline" onClick={addDummyDocument}>
              <Plus className="h-4 w-4 mr-1" />
              Add Demo Doc
            </Button> */}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documentList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents uploaded yet</p>
              <p className="text-sm">Upload PDF files to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documentList.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium text-foreground">
                        {doc.fileName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatBytes(doc.size)} •{" "}
                        {new Date(doc.createAt).toLocaleDateString()}
                      </p>
                      {/* {doc.status === "completed" && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {doc.chunks.length} chunks • {doc.questions.length}{" "}
                          Q&A pairs
                        </p>
                      )} */}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(doc.status)}>
                      {doc.status === "processing" &&
                      processingDocs.has(doc.id) ? (
                        <div className="flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          processing
                        </div>
                      ) : (
                        doc.status
                      )}
                    </Badge>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDocument(doc)}
                    >
                      <Info className="h-4 w-4 mr-1" />
                      Details
                    </Button>

                    {/* {doc.status === "uploaded" && (
                      <Button
                        size="sm"
                        onClick={() => handleProcess(doc.id)}
                        disabled={processingDocs.has(doc.id)}
                      >
                        {processingDocs.has(doc.id) ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Processing
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Process
                          </>
                        )}
                      </Button>
                    )} */}

                    {doc.status === "completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewQA(doc)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Q&A
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(doc.id)}
                      disabled={processingDocs.has(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <DocumentViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        document={selectedDocument}
        onViewQA={handleViewQAFromModal}
      />
    </>
  );
}
