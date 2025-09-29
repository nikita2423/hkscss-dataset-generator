"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StarRating } from "@/components/ui/star-rating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Sparkles, Plus, X } from "lucide-react";
import { ProjectData } from "@/lib/utils";

interface QAEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  qa: {
    id: string;
    question: string;
    answer: string;
    status: string;
    confidence: number;
    chunkId: string;
    model?: string;
    label?: string;
    createdAt?: string;
    textChunk?: string;
    rating?: number;
    customTags?: string[];
    note?: string;
    characterCount?: number;
    tokenCount?: number;
  } | null;
  onSave: (updatedQA: any) => void;
}

export function QAEditModal({ isOpen, onClose, qa, onSave }: QAEditModalProps) {
  const [question, setQuestion] = useState(qa?.question || "");
  const [answer, setAnswer] = useState(qa?.answer || "");
  const [status, setStatus] = useState(qa?.status || "pending");
  const [rating, setRating] = useState(qa?.rating || 0);
  const [customTags, setCustomTags] = useState<string[]>(qa?.customTags || []);
  const [note, setNote] = useState(qa?.note || "");
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAiEditing, setIsAiEditing] = useState(false);

  // const handleSave = async (field, value) => {
  //   try {
  //     const response = await fetch(
  //       `/api/projects/${ProjectData.id}/datasets?id=${datasetId}`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           [field]: value,
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("保存失败");
  //     }

  //     const data = await response.json();
  //     // setCurrentDataset((prev) => ({ ...prev, [field]: value }));

  //     // setSnackbar({
  //     //   open: true,
  //     //   message: "保存成功",
  //     //   severity: "success",
  //     // });

  //     // 重置编辑状态
  //     // if (field === "answer") setEditingAnswer(false);
  //     // if (field === "cot") setEditingCot(false);
  //   } catch (error) {
  //     // setSnackbar({
  //     //   open: true,
  //     //   message: error.message || "保存失败",
  //     //   severity: "error",
  //     // });
  //   }
  // };

  useEffect(() => {
    if (qa) {
      setQuestion(qa.question);
      setAnswer(qa.answer);
      setStatus(qa.status);
      setRating(qa.rating || 0);
      setCustomTags(qa.customTags || []);
      setNote(qa.note || "");
    }
  }, [qa]);

  const handleAiEdit = async () => {
    setIsAiEditing(true);

    // Simulate AI processing
    setTimeout(() => {
      const improvedAnswer =
        answer +
        "\n\n[AI Enhancement] This answer has been enhanced with additional context and clarity to provide a more comprehensive response.";
      setAnswer(improvedAnswer);
      setIsAiEditing(false);
    }, 2000);
  };

  const handleSave = async () => {
    if (!qa) return;

    setIsLoading(true);

    // Simulate save process
    setTimeout(() => {
      onSave({
        ...qa,
        question,
        answer,
        status,
        rating,
        customTags,
        note,
        characterCount: qa.answers?.[0]?.answer?.length || 0,
        tokenCount: Math.ceil(
          qa.answers?.[0]?.answer?.split(" ").length * 0.75
        ), // Rough token estimation
      });
      setIsLoading(false);
      onClose();
    }, 500);
  };

  const addCustomTag = () => {
    if (newTag.trim() && !customTags.includes(newTag.trim())) {
      setCustomTags([...customTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeCustomTag = (tagToRemove: string) => {
    setCustomTags(customTags.filter((tag) => tag !== tagToRemove));
  };

  if (!qa) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle>Edit Q&A Pair</DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 overflow">
          {/* Main Content */}
          <div className="flex-1 space-y-6 overflow pr-2">
            {/* Question */}
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                placeholder="Enter the question..."
              />
            </div>

            {/* Answer with AI Edit */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="answer">Answer</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {qa.answers?.[0]?.answer?.length || 0} Characters
                  </Badge>
                  {/* <Badge variant="outline">
                    {Math.ceil(
                      qa.answers?.[0]?.answer?.split(" ").length * 0.75
                    )}{" "}
                    Tokens
                  </Badge> */}
                  {/* <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAiEdit}
                    disabled={isAiEditing}
                    className="gap-2 bg-transparent"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isAiEditing ? "AI Editing..." : "Edit with AI"}
                  </Button> */}
                  {/* <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 bg-transparent"
                  >
                    <Edit className="h-4 w-4" />
                    Markdown
                  </Button> */}
                </div>
              </div>
              <Textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={8}
                placeholder="Enter the answer..."
                className={isAiEditing ? "opacity-50" : ""}
                value={qa?.answers?.length !== 0 ? qa.answers?.[0]?.answer : ""}
              />
            </div>

            {/* Source Information */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">Source: Chunk {qa.chunk?.name}</Badge>
                {/* <span>•</span>
                <span>Confidence: {Math.round(qa.confidence * 100)}%</span> */}
              </div>
            </div>

            {/* COT Section */}
            {/* <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>COT</Label>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 bg-transparent"
                >
                  <Edit className="h-4 w-4" />
                  Markdown
                </Button>
              </div>
              <Textarea
                placeholder="Chain of thought reasoning..."
                rows={3}
                className="bg-muted/30"
                // value={qa?.answers?.length !== 0 ? qa.answers?.[0]?.answer : ""}
              />
            </div> */}
          </div>

          {/* Metadata Panel */}
          <div className="w-80 space-y-4 overflow-y-auto">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Model */}
                {/* <div>
                  <Badge variant="secondary" className="text-xs">
                    Model: {qa.model || "google/gemini-2.5-flash"}
                  </Badge>
                </div> */}

                {/* Label */}
                <div>
                  <Badge
                    variant="outline"
                    className="text-xs text-blue-400 border-blue-400"
                  >
                    Label: {qa.label || "1.2 Definitions"}
                  </Badge>
                </div>

                {/* Created At */}
                {/* <div>
                  <Badge variant="outline" className="text-xs">
                    Created At: {qa.createdAt || "2025/9/26 10:18:29"}
                  </Badge>
                </div> */}

                {/* Text Chunk */}
                <div>
                  <Badge
                    variant="outline"
                    className="text-xs text-blue-400 border-blue-400"
                  >
                    Text Chunk:{" "}
                    {qa.chunk?.name ||
                      "Cap 459 Consolidated version for the..."}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Dataset Evaluation */}
            {/* <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Dataset Evaluation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Rating
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating
                      rating={rating}
                      onRatingChange={setRating}
                      size="sm"
                    />
                    {rating === 0 && (
                      <span className="text-xs text-muted-foreground">
                        Unrated
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Status */}
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <Label className="text-xs">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Custom Tags */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Custom Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {customTags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs gap-1"
                    >
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeCustomTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addCustomTag()}
                    className="h-8 text-xs"
                  />
                  <Button size="sm" onClick={addCustomTag} className="h-8 px-2">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Note */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  Note
                  <Edit className="h-3 w-3" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="text-xs"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
