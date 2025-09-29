"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Download, FileText, Database, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QAItem {
  id: string
  chunkId: number
  chunkText: string
  question: string
  answer: string
  status: string
  isApproved: boolean
  documentName: string
}

interface Document {
  id: number
  name: string
  questions: QAItem[]
}

export function DatasetExport() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [exportFormat, setExportFormat] = useState<string>("json")
  const [includeMetadata, setIncludeMetadata] = useState(true)
  const [onlyApproved, setOnlyApproved] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadDocuments = () => {
      const stored = localStorage.getItem("documents")
      if (stored) {
        const docs = JSON.parse(stored).filter((doc: any) => doc.status === "completed")
        setDocuments(docs)
        setSelectedDocuments(docs.map((doc: any) => doc.id))
      }
    }

    loadDocuments()

    const handleDocumentsUpdated = () => {
      loadDocuments()
    }

    window.addEventListener("documentsUpdated", handleDocumentsUpdated)
    return () => window.removeEventListener("documentsUpdated", handleDocumentsUpdated)
  }, [])

  const getFilteredQuestions = (): QAItem[] => {
    const selectedDocs = documents.filter((doc) => selectedDocuments.includes(doc.id))
    const allQuestions = selectedDocs.flatMap((doc) =>
      (doc.questions || []).map((q) => ({ ...q, documentName: doc.name })),
    )

    return onlyApproved ? allQuestions.filter((q) => q.isApproved) : allQuestions
  }

  const handleDocumentToggle = (docId: number, checked: boolean) => {
    if (checked) {
      setSelectedDocuments([...selectedDocuments, docId])
    } else {
      setSelectedDocuments(selectedDocuments.filter((id) => id !== docId))
    }
  }

  const handleSelectAll = () => {
    setSelectedDocuments(documents.map((doc) => doc.id))
  }

  const handleDeselectAll = () => {
    setSelectedDocuments([])
  }

  const exportAsJSON = (questions: QAItem[]) => {
    const dataset = {
      metadata: includeMetadata
        ? {
            exportDate: new Date().toISOString(),
            totalQuestions: questions.length,
            documents: selectedDocuments.length,
            format: "json",
            onlyApproved,
          }
        : undefined,
      data: questions.map((q) => ({
        id: q.id,
        question: q.question,
        answer: q.answer,
        ...(includeMetadata && {
          chunkId: q.chunkId,
          documentName: q.documentName,
          status: q.status,
          isApproved: q.isApproved,
        }),
      })),
    }

    const blob = new Blob([JSON.stringify(dataset, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `qa-dataset-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportAsCSV = (questions: QAItem[]) => {
    const headers = ["question", "answer"]
    if (includeMetadata) {
      headers.push("document_name", "chunk_id", "status", "is_approved")
    }

    const csvContent = [
      headers.join(","),
      ...questions.map((q) => {
        const row = [`"${q.question.replace(/"/g, '""')}"`, `"${q.answer.replace(/"/g, '""')}"`]
        if (includeMetadata) {
          row.push(`"${q.documentName}"`, q.chunkId.toString(), q.status, q.isApproved.toString())
        }
        return row.join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `qa-dataset-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportAsJSONL = (questions: QAItem[]) => {
    const jsonlContent = questions
      .map((q) => {
        const item = {
          question: q.question,
          answer: q.answer,
          ...(includeMetadata && {
            chunkId: q.chunkId,
            documentName: q.documentName,
            status: q.status,
            isApproved: q.isApproved,
          }),
        }
        return JSON.stringify(item)
      })
      .join("\n")

    const blob = new Blob([jsonlContent], { type: "application/jsonl" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `qa-dataset-${new Date().toISOString().split("T")[0]}.jsonl`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExport = () => {
    const questions = getFilteredQuestions()

    if (questions.length === 0) {
      toast({
        title: "No data to export",
        description: "Please select documents with approved Q&A pairs.",
        variant: "destructive",
      })
      return
    }

    try {
      switch (exportFormat) {
        case "json":
          exportAsJSON(questions)
          break
        case "csv":
          exportAsCSV(questions)
          break
        case "jsonl":
          exportAsJSONL(questions)
          break
        default:
          throw new Error("Unsupported format")
      }

      toast({
        title: "Export successful",
        description: `Exported ${questions.length} Q&A pairs as ${exportFormat.toUpperCase()}.`,
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting the dataset.",
        variant: "destructive",
      })
    }
  }

  const filteredQuestions = getFilteredQuestions()
  const totalApproved = documents.reduce(
    (sum, doc) => sum + (doc.questions?.filter((q) => q.isApproved)?.length || 0),
    0,
  )
  const totalQuestions = documents.reduce((sum, doc) => sum + (doc.questions?.length || 0), 0)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">Dataset Export</h1>
        <p className="text-muted-foreground">Export your approved Q&A pairs as training datasets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Statistics */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Q&A Pairs</CardTitle>
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalQuestions}</div>
                <p className="text-xs text-muted-foreground">Across all documents</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{totalApproved}</div>
                <p className="text-xs text-muted-foreground">Ready for export</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Selected</CardTitle>
                <Database className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{filteredQuestions.length}</div>
                <p className="text-xs text-muted-foreground">Will be exported</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Document Selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Select Documents</CardTitle>
            <CardDescription>Choose which documents to include in your dataset</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleSelectAll}>
                Select All
              </Button>
              <Button size="sm" variant="outline" onClick={handleDeselectAll}>
                Deselect All
              </Button>
            </div>

            <Separator />

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {documents.map((doc) => {
                const approvedCount = doc.questions?.filter((q) => q.isApproved)?.length || 0
                const totalCount = doc.questions?.length || 0

                return (
                  <div key={doc.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                    <Checkbox
                      id={`doc-${doc.id}`}
                      checked={selectedDocuments.includes(doc.id)}
                      onCheckedChange={(checked) => handleDocumentToggle(doc.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`doc-${doc.id}`} className="text-sm font-medium cursor-pointer">
                        {doc.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {approvedCount} approved of {totalCount} total Q&A pairs
                      </p>
                    </div>
                    <Badge variant={approvedCount > 0 ? "default" : "secondary"}>{approvedCount} approved</Badge>
                  </div>
                )
              })}
            </div>

            {documents.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No completed documents available</p>
                <p className="text-sm">Process some documents first</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
            <CardDescription>Configure your dataset export</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="format">Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="jsonl">JSONL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="approved-only"
                  checked={onlyApproved}
                  onCheckedChange={(checked) => setOnlyApproved(checked as boolean)}
                />
                <Label htmlFor="approved-only" className="text-sm">
                  Only approved Q&A pairs
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-metadata"
                  checked={includeMetadata}
                  onCheckedChange={(checked) => setIncludeMetadata(checked as boolean)}
                />
                <Label htmlFor="include-metadata" className="text-sm">
                  Include metadata
                </Label>
              </div>
            </div>

            <Separator />

            <Button onClick={handleExport} className="w-full" disabled={filteredQuestions.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export Dataset ({filteredQuestions.length} items)
            </Button>

            {filteredQuestions.length === 0 && (
              <p className="text-xs text-muted-foreground text-center">No items to export with current selection</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
