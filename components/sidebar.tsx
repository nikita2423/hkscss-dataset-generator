"use client";

import {
  FileText,
  Database,
  Settings,
  Upload,
  BarChart3,
  MessageSquare,
  FileStack,
  LogOut,
  Loader2,
  CircleCheckBigIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const navigation = [
  { name: "Dashboard", icon: BarChart3, id: "dashboard" },
  // { name: "Documents", icon: FileText, id: "documents" },
  // { name: "Upload", icon: Upload, id: "upload" },
  { name: "Q&A Pairs", icon: MessageSquare, id: "qa-pairs" },
  { name: "Text Chunks", icon: FileStack, id: "chunks" },
  { name: "Dataset", icon: Database, id: "dataset" },
  { name: "Settings", icon: Settings, id: "settings" },
];

interface SidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  tasks: any[];
}

export function Sidebar({
  activeSection = "dashboard",
  onSectionChange,
  tasks,
}: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    document.cookie =
      "isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  const getPendingTasksLoader = () => {
    const pendingTasks = tasks.filter((task) => task.status === 0);

    if (pendingTasks.length > 0) {
      return pendingTasks.length;
    }

    return 0;
  };

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-sidebar-foreground">
          CMS Admin
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Document Q&A System
        </p>
      </div>

      <nav className="px-4 space-y-1 flex-1">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => onSectionChange?.(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors text-left",
              activeSection === item.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {getPendingTasksLoader() > 0 ? getPendingTasksLoader() : null}
          Background Tasks
        </Button>
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
