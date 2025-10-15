"use client";

import { useBoards } from "@/lib/hooks/useBoards";
import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "./ui/loading-spinner";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  LayoutGrid,
  FolderKanban,
  Archive,
  Users,
  Grid3X3,
  List,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";
import BoardsListSection from "./boards-list-section";

const DashboardContent = () => {
  const { createBoard, boards, error, loadingBoards } = useBoards();
  const [showToast, setShowToast] = useState(false);
  const { user } = useClerk();

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
        <div className="text-3xl text-gray-800 font-bold dark:text-white">
          Welcome back 👋 {user?.firstName ?? "user"}
        </div>
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
            <div className="text-3xl font-bold">12</div>
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
            <div className="text-3xl font-bold">7</div>
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
            <div className="text-3xl font-bold">12</div>
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
            <div className="text-3xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      {/* boards list section */}
      <BoardsListSection/>

      {/* <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}
    </div>
  );
};

export default DashboardContent;
