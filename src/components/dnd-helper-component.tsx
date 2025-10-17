"use client";

import { ListWithTasks, Task } from "@/lib/supabase/models";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { Calendar, MoreHorizontal, Plus, User } from "lucide-react";
import { ReactNode } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const priorityColors = {
  low: "bg-blue-500/10 text-blue-700 border-blue-200",
  medium: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  high: "bg-red-500/10 text-red-700 border-red-200",
};

//droppable list to drop tasks to
function DroppableList({
  list,
  children,
  onCreateTask,
  onEditCategory,
}: {
  list: ListWithTasks;
  children: ReactNode;
  onCreateTask?: () => void;
  onEditCategory?: (category: ListWithTasks) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: list.id });

  return (
    <div
      ref={setNodeRef}
      className={`w-full lg:flex-shrink-0 lg:w-80 ${
        isOver ? "bg-blue-50 rounded-lg" : ""
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-sm border ${
          isOver ? "ring-2 ring-blue-300" : ""
        }`}
      >
        {/* category header */}
        <div className="p-3 sm:p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                {list.title}
              </h3>
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                {list.tasks.length}
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="flex-shrink-0 cursor-pointer"
                >
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent>
                  <DropdownMenuItem className="cursor-pointer">
                    Edit List
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer"
                  >
                    Delete List
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
          </div>
        </div>

        {/* content */}
        <div className="p-2">
          {children}
          <Button
            variant="ghost"
            className="cursor-pointer w-full text-gray-500 hover:text-gray-700 mt-2"
            onClick={onCreateTask}
          >
            <Plus />
            Add card
          </Button>
        </div>
      </div>
    </div>
  );
}

// Sortable task card
function SortableTask({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <Card
      className="mb-3 rounded-md cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
      ref={setNodeRef}
      style={styles}
      {...listeners}
      {...attributes}
    >
      <CardContent className="p-4">
        <h4 className="font-medium mb-2 text-sm">{task?.title}</h4>
        {task.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          {["Design", "UI"].map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs rounded-sm bg-gray-100"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {task.assignee && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{task.assignee}</span>
              </div>
            )}
            {task.due_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(task.due_date, "MMM d, yyyy")}</span>
              </div>
            )}
          </div>
          <Badge
            variant="outline"
            className={`text-xs ${priorityColors[task.priority]} rounded-sm`}
          >
            {task.priority}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

//task overlay
function TaskOverlay({ task }: { task: Task }) {
  return (
    <Card className="mb-3 rounded-md cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <h4 className="font-medium mb-2 text-sm">{task?.title}</h4>
        {task.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          {["Design", "UI"].map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs rounded-sm bg-gray-100"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {task.assignee && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{task.assignee}</span>
              </div>
            )}
            {task.due_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(task.due_date, "MMM d, yyyy")}</span>
              </div>
            )}
          </div>
          <Badge
            variant="outline"
            className={`text-xs ${priorityColors[task.priority]} rounded-sm`}
          >
            {task.priority}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export { SortableTask, TaskOverlay, DroppableList };
