"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Calendar,
  Check,
  Clock,
  Funnel,
  Grid3X3,
  List,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useBoards } from "@/lib/hooks/useBoards";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { colorOptions } from "@/lib/constants";
import { toast } from "sonner";
import { LoadingSpinner } from "./ui/loading-spinner";
import Link from "next/link";

const BoardsListSection = () => {
  const [viewMode, setviewMode] = useState<"grid" | "list">("grid");
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isCreatingBoard, setCreatingBoard] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    color: "blue-500",
  });
  const { createBoard, boards, error, loadingBoards } = useBoards();
  console.log("boards", boards);

  const handleCreateBoard = async () => {
    setCreatingBoard(true);
    try {
      await createBoard({ board: formData });
      setFormData({
        title: "",
        description: "",
        color: "blue-500",
      });
      setCreateDialogOpen(false);
    } catch (error) {
      toast.error("Error creating board");
    } finally {
      setCreatingBoard(false);
    }
  };
  return (
    <div className="mt-6">
      {/* headers */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:justify-between">
          <div>
            <div className="text-xl font-bold">Your Boards</div>
            <div className="text-sm font-medium text-muted-foreground">
              Manage your projects and tasks
            </div>
          </div>

          <div className="flex flex-col items-stretch sm:flex-row sm:items-center space-x-3 space-y-3 sm:space-y-0">
            {/* view mode toggle */}
            <Card className="p-1 rounded-md flex-1">
              <CardContent className="flex items-center space-x-2 p-0">
                <Button
                  size="sm"
                  variant={viewMode == "list" ? "ghost" : "default"}
                  onClick={() => setviewMode("grid")}
                >
                  <Grid3X3 />
                </Button>
                <Button
                  variant={viewMode == "grid" ? "ghost" : "default"}
                  size="sm"
                  onClick={() => setviewMode("list")}
                >
                  <List />
                </Button>
              </CardContent>
            </Card>

            {/* filters */}
            <Button
              variant="secondary"
              className="cursor-pointer border border-gray-100 flex-1"
            >
              <Funnel className="h-4 w-4" />
              Filters
            </Button>

            {/* create button */}
            <Button
              className="cursor-pointer"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus />
              Create Board
            </Button>
          </div>
        </div>

        {/* search */}
        <div className="relative">
          <Search className="absolute h-4 w-4 text-muted-foreground left-2 top-1/2 -translate-y-1/2" />
          <Input
            className="rounded-md bg-gray-50 max-w-full sm:max-w-xl font-medium text-xs placeholder:text-muted-foreground/50 pl-8"
            placeholder="Search boards..."
          />
        </div>
      </div>
      {loadingBoards ? (
        <div className="w-full h-full flex justify-center">
          <LoadingSpinner text="Loading your boards..." />
        </div>
      ) : viewMode == "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {boards.map((board) => (
            <Link key={board.id} href={`/boards/${board.id}`}>

            <Card
              className="group overflow-hidden relative border-border hover:border-foreground/20 transition-all duration-200 hover:shadow-md cursor-pointer rounded-md"
            >
              {/* color */}
              <div
                className={`h-[5] w-full absolute top-0 left-0 rounded-t-md`}
                style={{ backgroundColor: board.color }}
              />

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {board.title}
                  </CardTitle>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    New
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {board.description}
                </p>

                <div className="flex flex-col gap-2 pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      Created {format(board.created_at, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      Updated{" "}
                      {formatDistanceToNow(parseISO(board.updated_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}

          {/* create new button */}
          <Card
            className="group relative overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-all duration-200 cursor-pointer bg-muted/20 hover:bg-muted/40 rounded-md"
            onClick={() => setCreateDialogOpen(true)}
          >
            <CardContent className="flex flex-col items-center justify-center h-full space-y-2">
              <div className="h-16 w-16 rounded-full bg-gray-200 group-hover:bg-gray-300 flex items-center justify-center transition-colors">
                <Plus className="h-8 w-8" />
              </div>
              <h3 className="text-md font-medium">Create New Board</h3>
              <p className="text-sm">
                Start a new project and organize your tasks
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4 mt-8">
          {boards.map((board) => (
            <Link key={board.id} href={`/boards/${board.id}`}>
              <Card
                className="group relative overflow-hidden border-border hover:border-foreground/20 transition-all duration-200 hover:shadow-md cursor-pointer rounded-md py-3"
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-[5] bg-${board.color}`}
                  style={{ backgroundColor: board.color }}
                />

                <CardContent className="p-6 pl-8">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-foreground">
                          {board.title}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {board.description}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground shrink-0">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Created {format(board.created_at, "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          Updated{" "}
                          {formatDistanceToNow(parseISO(board.updated_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* create new button */}
          <Card
            className="group relative overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-all duration-200 cursor-pointer bg-muted/20 hover:bg-muted/40 rounded-md mt-4 py-6"
            onClick={() => setCreateDialogOpen(true)}
          >
            <CardContent className="flex items-center h-full space-x-4">
              <div className="h-14 w-14 rounded-full bg-gray-200 group-hover:bg-gray-300 flex items-center justify-center transition-colors">
                <Plus className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-md font-medium">Create New Board</h3>
                <p className="text-sm">
                  Start a new project and organize your tasks
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* create board dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Board</DialogTitle>
            <DialogDescription>
              Set up a new board to organize your tasks and collaborate with
              your team.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* title input */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Board title
              </Label>
              <Input
                id="title"
                placeholder="e.g. Website Redesign"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what this board is for..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full min-h-[100px] resize-none"
              />
            </div>
          </div>

          {/* board color selector */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Board Color</Label>
            <div className="flex rounded-xl overflow-hidden shadow-lg border border-border">
              {colorOptions.map((color, index) => (
                <button
                  key={color.hex}
                  onClick={() => setFormData({ ...formData, color: color.hex })}
                  className="group relative flex-1 focus:outline-none focus:z-10 cursor-pointer"
                  title={color.name}
                >
                  <div
                    className={`relative h-24 transition-all duration-200
                        ${index === 0 && "rounded-l-md"}
                        ${index === colorOptions.length - 1 && "rounded-r-md"}
                      `}
                    style={{ backgroundColor: color.hex }}
                  >
                    {formData.color === color.hex && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-6 w-6 rounded-full bg-white shadow-lg flex items-center justify-center animate-in zoom-in-50 duration-100">
                          <Check className="h-3 w-3 text-gray-700 stroke-[3]" />
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/0 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <span className="text-xs font-medium text-foreground bg-background px-2 py-1 rounded shadow-sm whitespace-nowrap">
                        {color.name}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Select a theme color for your board
            </p>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateBoard}
              disabled={!formData.title.trim()}
              className="cursor-pointer"
            >
              {isCreatingBoard && <Loader2 className="animate-spin" />}
              Create Board
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoardsListSection;
