"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare, CheckCircle, Clock } from "lucide-react";

interface Stats {
  totalDocuments: number;
  totalQuestions: number;
  approvedQuestions: number;
  processingDocuments: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalDocuments: 0,
    totalQuestions: 0,
    approvedQuestions: 0,
    processingDocuments: 0,
  });

  useEffect(() => {
    const updateStats = () => {
      const documents = JSON.parse(localStorage.getItem("documents") || "[]");

      const totalDocuments = documents.length;
      const totalQuestions = documents.reduce(
        (sum: number, doc: any) => sum + (doc.questions?.length || 0),
        0
      );
      const approvedQuestions = documents.reduce(
        (sum: number, doc: any) =>
          sum + (doc.questions?.filter((q: any) => q.isApproved)?.length || 0),
        0
      );
      const processingDocuments = documents.filter(
        (doc: any) => doc.status === "processing"
      ).length;

      setStats({
        totalDocuments,
        totalQuestions,
        approvedQuestions,
        processingDocuments,
      });
    };

    updateStats();

    const handleDocumentsUpdated = () => {
      updateStats();
    };

    window.addEventListener("documentsUpdated", handleDocumentsUpdated);
    return () =>
      window.removeEventListener("documentsUpdated", handleDocumentsUpdated);
  }, []);

  const statCards = [
    {
      title: "Total Documents",
      value: stats.totalDocuments,
      description: "Documents uploaded",
      icon: FileText,
      color: "text-blue-500",
    },
    {
      title: "Q&A Pairs",
      value: stats.totalQuestions,
      description: "Generated questions",
      icon: MessageSquare,
      color: "text-green-500",
    },
    {
      title: "Approved",
      value: stats.approvedQuestions,
      description: "Ready for dataset",
      icon: CheckCircle,
      color: "text-emerald-500",
    },
    {
      title: "Pending",
      value: stats.processingDocuments,
      description: "Currently pending",
      icon: Clock,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
