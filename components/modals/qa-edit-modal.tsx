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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { StarRating } from "@/components/ui/star-rating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Sparkles, Plus, X, Check, ChevronDown } from "lucide-react";
import { API_URL, ProjectData } from "@/lib/utils";
import { toast } from "sonner";

interface QAEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  qa: {
    id: string;
    question: string;
    answer?: string;
    answers?: Array<{
      id?: string;
      answer: string;
      tags?: string;
    }>;
    status: string;
    confidence: number;
    chunkId: string;
    chunk?: { name: string };
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
  const [answer, setAnswer] = useState(
    qa?.answers?.[0]?.answer || qa?.answer || ""
  );
  const [status, setStatus] = useState(qa?.status || "pending");
  const [rating, setRating] = useState(qa?.rating || 0);
  const [customTags, setCustomTags] = useState<string[]>(qa?.customTags || []);
  const [note, setNote] = useState(qa?.note || "");
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAiEditing, setIsAiEditing] = useState(false);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Predefined tags that can be selected from dropdown
  const predefinedTags = [
    "Legal",
    "Technical",
    "Business",
    "Academic",
    "General",
    "Important",
    "Complex",
    "Simple",
    "Review Required",
    "Verified",
    "Draft",
    "Final",
  ];

  useEffect(() => {
    const projectId = ProjectData.id;
    const fetchAvailableTags = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/projects/${projectId}/datasets/tags`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Available Tags", data.tags);
          setAvailableTags(data.tags || []);
        }
      } catch (error) {
        console.error("获取可用标签失败:", error);
      }
    };

    if (projectId) {
      fetchAvailableTags();
    }
  }, []);

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

  const parseDatasetTags = (tagsString: string) => {
    try {
      return JSON.parse(tagsString || "[]");
    } catch (e) {
      return [];
    }
  };

  useEffect(() => {
    if (qa) {
      setQuestion(qa.question);
      setAnswer(qa.answers?.[qa.answers?.length - 1]?.answer || "");
      setStatus("pending");
      // setRating(qa.rating || 0);
      console.log(
        "qa.answers?.[qa.answers?.length - 1]?.answer?.tags",
        qa.answers?.[qa.answers?.length - 1]?.tags
      );
      setCustomTags(
        parseDatasetTags(qa.answers?.[qa.answers?.length - 1]?.tags || "[]") ||
          []
      );
      setNote(qa.note || "");
    }
  }, [qa]);

  console.log("Custom Tags", customTags);

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
        characterCount: answer.length || 0,
        tokenCount: Math.ceil(answer.split(" ").length * 0.75), // Rough token estimation
      });
      setIsLoading(false);
      onClose();
    }, 500);
  };

  const addCustomTag = () => {
    console.log("Add Custom Tags", newTag, customTags);
    if (newTag.trim() && !customTags.includes(newTag.trim())) {
      // setCustomTags([...customTags, newTag.trim()]);
      updateMetadata({ tags: [...customTags, newTag.trim()] });
      setNewTag("");
      setTagDropdownOpen(false);
    }
  };

  const selectPredefinedTag = (tag: string) => {
    console.log("Selecting tag:", tag, "Current tags:", customTags);
    if (!customTags.includes(tag)) {
      const newTags = [...customTags, tag];
      setCustomTags(newTags);
      updateMetadata({ tags: newTags });
    }
    setTagDropdownOpen(false);
    setNewTag("");
  };

  const removeCustomTag = (tagToRemove: string) => {
    const newTags = customTags.filter((tag) => tag !== tagToRemove);
    setCustomTags(newTags);
    updateMetadata({ tags: newTags });
  };

  // Filter predefined tags to exclude already selected ones
  const availablePredefinedTags = availableTags.filter(
    (tag) =>
      !customTags.includes(tag) &&
      tag.toLowerCase().includes(newTag.toLowerCase())
  );

  const updateMetadata = async (updates: any) => {
    const dataset = qa?.answers?.[qa.answers.length - 1];
    // if (loading) return;

    // 立即更新本地状态，提升响应速度
    // if (updates.score !== undefined) {
    //   setLocalScore(updates.score);
    // }
    if (updates.tags !== undefined) {
      setCustomTags(updates.tags);
    }
    // if (updates.note !== undefined) {
    //   setLocalNote(updates.note);
    // }

    // setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/projects/${ProjectData.id}/datasets/${dataset?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        throw new Error("更新失败");
      }

      const result = await response.json();

      // 显示成功提示

      toast.success("Dataset metadata updated");

      // 如果有父组件的更新回调，调用它
      // if (onUpdate) {
      //   onUpdate(result.dataset);
      // }
    } catch (error) {
      console.error("更新数据集元数据失败:", error);
      // 显示错误提示
      toast.error("Failed to update dataset metadata");

      // // 出错时恢复本地状态
      // if (updates.score !== undefined) {
      //   setLocalScore(dataset.score || 0);
      // }
      // if (updates.tags !== undefined) {
      //   setLocalTags(parseDatasetTags(dataset.tags));
      // }
      // if (updates.note !== undefined) {
      //   setLocalNote(dataset.note || "");
      // }
    } finally {
    }
  };

  console.log("availablePredefinedTags", availablePredefinedTags);

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
                    {(qa?.answers?.[0]?.answer || qa?.answer || "").length}{" "}
                    Characters
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
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={() => {
                    updateMetadata({ answer: answer });
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Answer"}
                </Button>
              </div>
            </div>
            {/* Source Information */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">
                  Source: Chunk {qa.chunk?.name || qa.chunkId}
                </Badge>
                {/* <span>•</span>
                <span>Confidence: {Math.round(qa.confidence * 100)}%</span> */}
              </div>
            </div>{" "}
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
                      qa.chunkId ||
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
                  <Popover
                    open={tagDropdownOpen}
                    onOpenChange={setTagDropdownOpen}
                  >
                    <PopoverTrigger asChild>
                      <div className="relative flex-1">
                        <Input
                          placeholder="Add or search tags..."
                          value={newTag}
                          onChange={(e) => {
                            setNewTag(e.target.value);
                            setTagDropdownOpen(true);
                          }}
                          onFocus={() => setTagDropdownOpen(true)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && addCustomTag()
                          }
                          className="h-8 text-xs pr-8"
                        />
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-0" align="start">
                      <div className="max-h-60 overflow-y-auto">
                        {availablePredefinedTags.length > 0 && (
                          <div>
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b">
                              Suggested Tags
                            </div>
                            {availablePredefinedTags.map((tag) => (
                              <div
                                key={tag}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log("Clicking on tag:", tag);
                                  selectPredefinedTag(tag);
                                }}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log("Mouse down on tag:", tag);
                                  selectPredefinedTag(tag);
                                }}
                                className="flex items-center px-2 py-1.5 text-xs hover:bg-accent cursor-pointer transition-colors"
                              >
                                <Check className="mr-2 h-3 w-3 opacity-0" />
                                <span>{tag}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {newTag.trim() &&
                          !availableTags.includes(newTag.trim()) && (
                            <div>
                              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b border-t">
                                Create New
                              </div>
                              <div
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log(
                                    "Creating new tag:",
                                    newTag.trim()
                                  );
                                  addCustomTag();
                                }}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  console.log(
                                    "Mouse down - Creating new tag:",
                                    newTag.trim()
                                  );
                                  addCustomTag();
                                }}
                                className="flex items-center px-2 py-1.5 text-xs hover:bg-accent cursor-pointer transition-colors"
                              >
                                <Plus className="mr-2 h-3 w-3" />
                                <span>Create "{newTag.trim()}"</span>
                              </div>
                            </div>
                          )}
                        {availablePredefinedTags.length === 0 &&
                          !newTag.trim() && (
                            <div className="px-2 py-4 text-xs text-center text-muted-foreground">
                              No tags available
                            </div>
                          )}
                      </div>
                    </PopoverContent>
                  </Popover>
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
        {/* 
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
