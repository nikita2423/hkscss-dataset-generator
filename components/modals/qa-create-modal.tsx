"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";
import { ProjectData } from "@/lib/utils";

interface QACreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (question: any) => void;
  chunks?: any[];
  tags: any[];
}

export function QACreateModal({
  isOpen,
  onClose,
  onSave,
  chunks = [],
  tags = [],
}: QACreateModalProps) {
  const [formData, setFormData] = useState({
    question: "",
    chunkId: "",
    tag: "",
  });

  const flattenTags = (tags, prefix = "") => {
    let flatTags = [];
    const traverse = (node) => {
      flatTags.push({
        id: node.label, // 使用标签名作为 id
        label: node.label, // 直接使用原始标签名
        originalLabel: node.label,
      });
      if (node.child && node.child.length > 0) {
        node.child.forEach((child) => traverse(child));
      }
    };
    console.log("tags", tags);
    tags.forEach((tag) => traverse(tag));
    flatTags.push({
      id: "other",
      label: "Uncategorized",
      originalLabel: "other",
    });
    return flatTags;
  };

  const flattenedTags = useMemo(() => flattenTags(tags), [tags]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    if (!formData.chunkId) {
      toast.error("Please select a text chunk");
      return;
    }

    // Create the question object
    const newQuestion = {
      //   id: Date.now().toString(),
      question: formData.question.trim(),
      chunkId: formData.chunkId,
      label: formData.tag,
      //   status: "pending",
      //   confidence: 1.0,
      //   answers: [],
      //   chunk: chunks.find((c) => c.id === formData.chunkId) || {
      //     name: "Unknown chunk",
      //   },
    };

    console.log("newQuestion", newQuestion);

    onSave(newQuestion);
    handleClose();
    toast.success("Question created successfully");
  };

  const handleClose = () => {
    setFormData({
      question: "",
      chunkId: "",
      tag: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Question</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question Content</Label>
            <Textarea
              id="question"
              placeholder="Enter your question here..."
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chunk">Select Text Chunk</Label>
            <Select
              value={formData.chunkId}
              onValueChange={(value) =>
                setFormData({ ...formData, chunkId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Text Chunk" />
              </SelectTrigger>
              <SelectContent>
                {chunks.map((chunk) => (
                  <SelectItem key={chunk.id} value={chunk.id}>
                    {chunk.name || `Chunk ${chunk.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag">Select Tag</Label>
            <Select
              value={formData.tag}
              onValueChange={(value) =>
                setFormData({ ...formData, tag: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Tag" />
              </SelectTrigger>
              <SelectContent>
                {flattenedTags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.label}
                  </SelectItem>
                ))}
                {/* <SelectItem value="general">General</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="academic">Academic</SelectItem> */}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
