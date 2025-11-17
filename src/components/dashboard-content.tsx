"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useBoards } from "@/lib/hooks/useBoards";
import {
  Archive,
  FolderKanban,
  LayoutGrid,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BoardsListSection from "./boards-list-section";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import FloatingChat from "./floating-chat";

const DashboardContent = () => {
  const { boards, error, loadingBoards } = useBoards();
  const [showToast, setShowToast] = useState(false);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (error) {
      setShowToast(true);
    }
  }, []);

  useEffect(() => {
    if (showToast) {
      toast.error("Error loading boards");
      setShowToast(false);
    }
  }, [showToast]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="py-3">
        {isLoading ? (
          <div className="text-3xl text-gray-800 font-bold dark:text-white">
            {/* "Welcome back 👋" with skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-40 bg-gray-400/50 dark:bg-gray-600/50 rounded-lg animate-pulse" />
              <Skeleton className="h-7 w-7 rounded-full bg-yellow-400/20 animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="text-3xl text-gray-800 font-bold dark:text-white">
            Welcome back 👋 {user?.name}
          </div>
        )}
      </div>
      {/* stat cards */}
      <div className="grid auto-rows-min gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="backdrop-blur-sm border-[0.5] border-gray-200 rounded-md group hover:bg-gray-50/50">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-muted-foreground group-hover:text-gray-800 text-sm font-medium">
              Total Boards
            </CardTitle>
            <LayoutGrid className="text-muted-foreground group-hover:text-gray-800" />
          </CardHeader>
          <CardContent>
            {loadingBoards ? (
              <Skeleton className="h-8 w-full bg-gray-200 dark:bg-gray-600/50 rounded-lg animate-pulse" />
            ) : (
              <div className="text-3xl font-bold">{boards.length}</div>
            )}
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm border-[0.5] border-gray-200 rounded-md group hover:bg-gray-50/50">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-muted-foreground group-hover:text-gray-800 text-sm font-medium">
              Active boards
            </CardTitle>
            <FolderKanban className="text-blue-600 group-hover:text-blue-800" />
          </CardHeader>
          <CardContent>
            {loadingBoards ? (
              <Skeleton className="h-8 w-full bg-gray-200 dark:bg-gray-600/50 rounded-lg animate-pulse" />
            ) : (
              <div className="text-3xl font-bold">{boards.length}</div>
            )}
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm border-[0.5] border-gray-200 rounded-md group hover:bg-gray-50/50">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-muted-foreground group-hover:text-gray-800 text-sm font-medium">
              Archived
            </CardTitle>
            <Archive className="text-amber-600 group-hover:text-amber-700" />
          </CardHeader>
          <CardContent>
            {loadingBoards ? (
              <Skeleton className="h-8 w-full bg-gray-200 dark:bg-gray-600/50 rounded-lg animate-pulse" />
            ) : (
              <div className="text-3xl font-bold">0</div>
            )}
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm border-[0.5] border-gray-200 rounded-md group hover:bg-gray-50/50">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-muted-foreground group-hover:text-gray-800 text-sm font-medium">
              Collaborators
            </CardTitle>
            <Users className="text-green-600 group-hover:text-green-600" />
          </CardHeader>
          <CardContent>
            {loadingBoards ? (
              <Skeleton className="h-8 w-full bg-gray-200 dark:bg-gray-600/50 rounded-lg animate-pulse" />
            ) : (
              <div className="text-3xl font-bold">1</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* boards list section */}
      <BoardsListSection />

      {/* <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}

      {/* ai assistant chatbot */}
      <FloatingChat />
    </div>
  );
};

export default DashboardContent;
