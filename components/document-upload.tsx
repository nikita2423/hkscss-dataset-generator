"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  checkInvalidFiles,
  checkMaxSize,
  getvalidFiles,
} from "@/lib/file/file-process";

export function DocumentUpload({ uploadFiles }: any) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log("Files", files);
    handleFileSelect(files);
    // if (files) {
    //   const fileArray = Array.from(files);
    //   onDrop(fileArray);
    // }
  };

  const handleFileSelect = (selectedFiles) => {
    checkMaxSize(selectedFiles);
    checkInvalidFiles(selectedFiles);

    const validFiles = getvalidFiles(selectedFiles);

    // if (validFiles.length > 0) {
    //   setFiles((prev) => [...prev, ...validFiles]);
    // }
    console.log("Valid Files", validFiles);
    uploadFiles(validFiles);
    // const hasPdfFiles = selectedFiles.filter((file) =>
    //   file.name.endsWith(".pdf")
    // );
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      console.log("On drop Files", acceptedFiles);
      handleFileSelect(acceptedFiles);
      // const pdfFiles = acceptedFiles.filter(
      //   (file) => file.type === "application/pdf"
      // );
      // if (pdfFiles.length === 0) {
      //   toast({
      //     title: "Invalid file type",
      //     description: "Please upload PDF files only.",
      //     variant: "destructive",
      //   });
      //   return;
      // }
      // setIsUploading(true);
      // try {
      //   for (const file of pdfFiles) {
      //     // Simulate upload process
      //     await new Promise((resolve) => setTimeout(resolve, 1000));
      //     // Store file info in localStorage for now
      //     const documents = JSON.parse(
      //       localStorage.getItem("documents") || "[]"
      //     );
      //     const newDoc = {
      //       id: Date.now() + Math.random(),
      //       name: file.name,
      //       size: file.size,
      //       uploadedAt: new Date().toISOString(),
      //       status: "uploaded",
      //       chunks: [],
      //       questions: [],
      //     };
      //     documents.push(newDoc);
      //     localStorage.setItem("documents", JSON.stringify(documents));
      //   }
      //   toast({
      //     title: "Upload successful",
      //     description: `${pdfFiles.length} document(s) uploaded successfully.`,
      //   });
      //   // Trigger a custom event to refresh the document list
      //   window.dispatchEvent(new CustomEvent("documentsUpdated"));
      // } catch (error) {
      //   toast({
      //     title: "Upload failed",
      //     description: "There was an error uploading your documents.",
      //     variant: "destructive",
      //   });
      // } finally {
      //   setIsUploading(false);
      // }
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Documents
        </CardTitle>
        <CardDescription>
          Upload PDF documents to generate Q&A pairs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />

          {isUploading ? (
            <div className="space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground">
                Uploading documents...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
              {isDragActive ? (
                <p className="text-sm text-foreground">
                  Drop the PDF files here...
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-foreground">
                    Drag & drop PDF files here, or click to select
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Support PDF file
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4">
          {/* <Button
            // component="label"
            // variant="contained"
            startIcon={<Upload className="h-4 w-4 mr-2" />}
            // sx={{ mb: 2, mt: 2 }}
            disabled={isUploading}
          > */}
          <label className="w-full">
            Select Files
            <input
              type="file"
              hidden
              accept=".md,.txt,.docx,.pdf,.epub"
              multiple
              onChange={onFileSelect}
              // disabled={!selectedModel?.id || uploading}
            />
          </label>

          {/* </Button> */}
          {/* <Button
            onClick={() =>
              document.querySelector('input[type="file"]')?.click()
            }
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Select Files
              </>
            )}
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}
