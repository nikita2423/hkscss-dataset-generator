"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DocumentUpload } from "@/components/document-upload";
import { DocumentList } from "@/components/document-list";
import { DashboardStats } from "@/components/dashboard-stats";
import { QAManagement } from "@/components/qa-management";
import { DatasetExport } from "@/components/dataset-export";
import { QAPairsList } from "@/components/qa-pairs-list";
import { ChunksList } from "@/components/chunks-list";
import { Sidebar } from "@/components/sidebar";
import { Settings } from "lucide-react";
import axios from "axios";
import { getContent } from "@/lib/file/file-process";
import { API_URL, ProjectData } from "@/lib/utils";
import useFileProcessing from "./useFileProcessing";
import useChunks from "@/components/useChunks";
import useFileProcessingStatus from "./useFileProcessingStatus";

interface Document {
  id: number;
  name: string;
  size: number;
  uploadedAt: string;
  status: "uploaded" | "processing" | "completed";
  chunks: any[];
  questions: any[];
}

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );

  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [polling, setPolling] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [prevTaskCount, setPrevTaskCount] = useState(0);
  const { setTaskFileProcessing, setTask } = useFileProcessingStatus();

  const {
    fileProcessing,
    progress: pdfProgress,
    handleFileProcessing,
  } = useFileProcessing(ProjectData.id);

  const {
    chunks,
    tocData,
    loading,
    fetchChunks,
    handleDeleteChunk,
    handleEditChunk,
    updateChunks,
    setLoading,
  } = useChunks(ProjectData.id, "all");

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${API_URL}/api/projects/${ProjectData.id}/files?page=1&pageSize=10`,
      headers: {
        // withCredentials: "true",
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data.data));
        if (response?.data?.data?.length) {
          setSelectedDocuments(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    fetchChunks("all");
  }, [fetchChunks]);

  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/projects/${ProjectData.id}/files?page=1&pageSize=10`,
        {
          headers: {
            // withCredentials: "true",
          },
        }
      );
      if (response?.data?.data?.length) {
        setSelectedDocuments(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  const handleViewQA = (document: Document) => {
    setSelectedDocument(document);
    setActiveSection("qa-management");
  };

  const handleBackFromQA = () => {
    setSelectedDocument(null);
    setActiveSection("documents");
  };

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated");
      if (authStatus === "true") {
        setIsAuthenticated(true);
      } else {
        router.push("/login");
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);
  const projectId = ProjectData.id;

  const fetchPendingTasks = async () => {
    const projectId = ProjectData.id;
    if (!projectId) return;

    try {
      const response = await axios.get(
        `${API_URL}/api/projects/${projectId}/tasks/list?status=0`
      );
      if (response.data?.code === 0) {
        const tasks = response.data.data || [];
        setTasks(tasks);
        // 检查是否有文件处理任务正在进行
        const hasActiveFileTask = tasks.some(
          (task: any) =>
            task.projectId === projectId && task.taskType === "file-processing"
        );
        setTaskFileProcessing(hasActiveFileTask);
        //存在文件处理任务，将任务信息传递给共享状态
        if (hasActiveFileTask) {
          const activeTask = tasks.find(
            (task: any) =>
              task.projectId === projectId &&
              task.taskType === "file-processing"
          );
          // 解析任务详情信息
          const detailInfo = JSON.parse(activeTask.detail);
          setTask(detailInfo);
        }
      }
    } catch (error) {
      console.error("获取任务列表失败:", error);
    }
  };
  useEffect(() => {
    if (ProjectData.id) {
      fetchPendingTasks();

      // 启动轮询
      const intervalId = setInterval(() => {
        fetchPendingTasks();
      }, 10000); // 每10秒轮询一次

      setPolling(true);

      return () => {
        clearInterval(intervalId);
        setPolling(false);
      };
    }
  }, [ProjectData.id]);

  // Add effect to refresh chunks when file processing tasks complete
  useEffect(() => {
    const currentTaskCount = tasks.length;
    const hasActiveFileTask = tasks.some(
      (task: any) =>
        task.projectId === ProjectData.id && task.taskType === "file-processing"
    );

    // If task count decreased (task completed) and no active file tasks, refresh chunks
    if (
      prevTaskCount > 0 &&
      currentTaskCount < prevTaskCount &&
      !hasActiveFileTask
    ) {
      console.log("File processing task completed, refreshing chunks...");
      setTimeout(() => {
        fetchChunks("all");
        fetchUploadedFiles();
      }, 2000); // Wait 2 seconds for backend to finish processing
    }

    setPrevTaskCount(currentTaskCount);
  }, [tasks, prevTaskCount, fetchChunks]);

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;

    // 如果是第一次上传，直接走默认逻辑
    if (selectedDocuments.length === 0) {
      handleStartUpload("rebuild", files);
      return;
    } else {
      handleStartUpload("revise", files);
    }

    // 否则打开领域树操作选择对话框
    // setDomainTreeAction("upload");
    // setPendingAction({ type: "upload" });
    // setDomainTreeActionOpen(true);
  };

  const uploadFile = async ({
    file,
    projectId,
    fileContent,
    fileName,
  }: any) => {
    try {
      const url = `${API_URL}/api/projects/${projectId}/files`;

      const response = await axios.post(
        url,
        file.name.endsWith(".docx")
          ? new TextEncoder().encode(fileContent) // send encoded buffer for docx
          : fileContent, // otherwise send as-is (Blob, ArrayBuffer, etc.)
        {
          headers: {
            "Content-Type": "application/octet-stream",
            "x-file-name": encodeURIComponent(fileName),
          },
          // if you later enable cookies/credentials in your API:
          // withCredentials: true,
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Upload failed:", error);
      throw new Error("Upload Failed");
    }
  };

  const handleUploadSuccess = async (
    fileNames: any[],
    pdfFiles: File[],
    domainTreeAction: string
  ) => {
    try {
      await handleFileProcessing(fileNames, "default", "", domainTreeAction);
      // location.reload();
    } catch (error) {
      console.error("File upload failed" + error || "");
    }
  };

  const handleStartUpload = async (
    domainTreeActionType = "rebuild",
    files: File[]
  ) => {
    // setUploading(true);
    console.log("Starting upload for files:", files, domainTreeActionType);
    try {
      const uploadedFileInfos = [];
      for (const file of files) {
        const { fileContent, fileName } = await getContent(file);
        console.log("Uploading file:", fileName);
        console.log("Uploading file Content:", fileContent);

        const data = await uploadFile({
          file,
          projectId: ProjectData.id,
          fileContent,
          fileName,
        });
        uploadedFileInfos.push({
          fileName: data.fileName,
          fileId: data.fileId,
        });
      }
      // toast.success(t("textSplit.uploadSuccess", { count: files.length }));
      // setFiles([]);
      // setCurrentPage(1);
      await fetchUploadedFiles();
      await handleUploadSuccess(uploadedFileInfos, files, domainTreeActionType);
      // if (onUploadSuccess) {
      //   await onUploadSuccess(
      //     uploadedFileInfos,
      //     pdfFiles,
      //     domainTreeActionType
      //   );
      // }
    } catch (err) {
      // toast.error(err.message || t("textSplit.uploadFailed"));
    } finally {
      // setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const renderContent = () => {
    if (activeSection === "qa-management" && selectedDocument) {
      return (
        <QAManagement document={selectedDocument} onBack={handleBackFromQA} />
      );
    }

    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-foreground">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Overview of your document processing and Q&A generation
              </p>
            </div>
            <DashboardStats />
            <DocumentUpload uploadFiles={uploadFiles} />
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <DocumentList
                onViewQA={handleViewQA}
                documentList={selectedDocuments}
              />
              {/* <div className="space-y-6">
                <DocumentUpload />
              </div> */}
            </div>
          </div>
        );

      // case "documents":
      //   return (
      //     <div className="space-y-8">
      //       <div className="space-y-2">
      //         <h1 className="text-3xl font-semibold text-foreground">
      //           Documents
      //         </h1>
      //         <p className="text-muted-foreground">
      //           Manage your uploaded documents and processing status
      //         </p>
      //       </div>
      //       <DocumentList onViewQA={handleViewQA} />
      //     </div>
      //   );

      // case "upload":
      //   return (
      //     <div className="space-y-8">
      //       <div className="space-y-2">
      //         <h1 className="text-3xl font-semibold text-foreground">
      //           Upload Documents
      //         </h1>
      //         <p className="text-muted-foreground">
      //           Upload PDF documents to generate Q&A pairs
      //         </p>
      //       </div>
      //       <div className="max-w-2xl">
      //         <DocumentUpload />
      //       </div>
      //     </div>
      //   );

      case "qa-pairs":
        return <QAPairsList chunks={chunks} />;

      case "chunks":
        return (
          <ChunksList chunks={chunks} onRefresh={() => fetchChunks("all")} />
        );

      case "dataset":
        return <DatasetExport />;

      case "settings":
        return (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-foreground">
                Settings
              </h1>
              <p className="text-muted-foreground">
                Configure your CMS preferences
              </p>
            </div>
            <div className="text-center py-12 text-muted-foreground">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Settings panel coming soon</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        tasks={tasks}
      />
      <main className="flex-1 p-8 h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
}
