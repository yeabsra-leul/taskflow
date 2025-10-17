"use client";

import { useBoard } from "@/lib/hooks/useBoards";
import { ListWithTasks, Task } from "@/lib/supabase/models";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { Loader2, Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { DroppableList, SortableTask, TaskOverlay } from "./dnd-helper-component";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

const priorityColors = {
  low: "bg-blue-500/10 text-blue-700 border-blue-200",
  medium: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  high: "bg-red-500/10 text-red-700 border-red-200",
};

const BoardDetail = ({ boardId }: { boardId: string }) => {
  const {
    board,
    error,
    loadingBoard,
    lists,
    createNewTask,
    setLists,
    moveTask,
    createNewList,
  } = useBoard({
    boardId,
  });
  const [isCreateTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [isCreateListDialogOpen, setCreateListDialogOpen] = useState(false);
  const [isCreatingTask, setCreatingTask] = useState(false);
  const [isCreatingList, setCreatingList] = useState(false);
  const [title, setTitle] = useState("");
  const [newListTitle, setNewListTitle] = useState("");
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // sensors for better dnd detections
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  //handle create task
  const handleCreateTask = async ({
    taskData,
  }: {
    taskData: {
      title: string;
      description?: string;
      assignee?: string;
      due_date?: string;
      priority?: "low" | "medium" | "high";
    };
  }) => {
    const targetList = lists[0];
    if (!targetList) {
      throw new Error("No list available to add task");
    }

    try {
      await createNewTask({ listId: targetList.id, taskData });
      setCreateTaskDialogOpen(false);
    } catch (error) {
      toast.error("Error creating task");
    } finally {
      setCreatingTask(false);
    }
  };

  //task form submit handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreatingTask(true);

    const formData = new FormData(e.currentTarget);
    const taskData = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      assignee: (formData.get("assignee") as string) || undefined,
      due_date: (formData.get("dueDate") as string) || undefined,
      priority:
        (formData.get("priority") as "low" | "medium" | "high") || "medium",
    };

    if (taskData.title.trim()) {
      await handleCreateTask({ taskData });
    }
  };

  //handler for when a users start dragging a car
  function handleDragStart(event: DragStartEvent) {
    const taskId = event.active.id as string;
    const task = lists
      .flatMap((list) => list.tasks)
      .find((task) => task.id === taskId);

    if (task) {
      setActiveTask(task);
    }
  }

  //handler for when users drag the card over another card
  function handleDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceList = lists.find((list) =>
      list.tasks.some((task) => task.id === activeId)
    );

    const targetList = lists.find((list) =>
      list.tasks.some((task) => task.id === overId)
    );

    if (!sourceList || !targetList) return;

    //moving cards only inside a column
    if (sourceList.id === targetList.id) {
      const activeIndex = sourceList.tasks.findIndex(
        (task) => task.id === activeId
      );

      const overIndex = targetList.tasks.findIndex(
        (task) => task.id === overId
      );

      // if user drag the card on another card
      if (activeIndex !== overIndex) {
        setLists((prev: ListWithTasks[]) => {
          const newLists = [...prev];
          const list = newLists.find((col) => col.id === sourceList.id);

          //swap the positions of the cards
          if (list) {
            const tasks = [...list.tasks];
            const [removed] = tasks.splice(activeIndex, 1);
            tasks.splice(overIndex, 0, removed);
            list.tasks = tasks;
          }
          return newLists;
        });
      }
    } else {
      //move between columns
      setLists((prev: ListWithTasks[]) => {
        const newLists = [...prev];

        const source = newLists.find((list) =>
          list.tasks.some((t) => t.id === activeId)
        );
        const target =
          newLists.find((list) => list.tasks.some((t) => t.id === overId)) ??
          newLists.find((list) => list.id === targetList?.id);

        if (!source || !target) return prev;

        const activeIndex = source.tasks.findIndex(
          (task) => task.id === activeId
        );
        const overIndex = target.tasks.findIndex((task) => task.id === overId);

        if (activeIndex === -1) return prev;

        const [movedTask] = source.tasks.splice(activeIndex, 1);
        if (!movedTask) return prev;

        target.tasks.splice(
          overIndex >= 0 ? overIndex : target.tasks.length,
          0,
          movedTask
        );

        return newLists;
      });
    }
  }

  //handler for when the card is released
  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const targetList = lists.find((list) => list.id === overId);

    //if moving card to another list
    if (targetList) {
      const sourceList = lists.find((list) =>
        list.tasks.some((task) => task.id === taskId)
      );

      if (sourceList && sourceList.id !== targetList.id) {
        await moveTask({
          taskId,
          toListId: targetList.id,
          newOrder: targetList.tasks.length,
        });
      }
    } else {
      //move cards inside the same list
      const sourceList = lists.find((list) =>
        list.tasks.some((task) => task.id === taskId)
      );

      const targetList = lists.find((list) =>
        list.tasks.some((task) => task.id === overId)
      );

      if (sourceList && targetList) {
        const oldIndex = sourceList.tasks.findIndex(
          (task) => task.id === taskId
        );

        const newIndex = targetList.tasks.findIndex(
          (task) => task.id === overId
        );

        if (oldIndex !== newIndex) {
          await moveTask({
            taskId,
            toListId: targetList.id,
            newOrder: newIndex,
          });
        }
      }
    }
  }

  // create new list handler
  async function handleCreateList(e: FormEvent) {
    e.preventDefault();
    setCreatingList(true);

    if (!newListTitle.trim()) {
      return;
    }
    try {
      await createNewList({ listTitle: newListTitle });
      setCreateListDialogOpen(false);
    } catch (error) {
      toast.error("Error creating list");
    } finally {
      setCreatingList(false);
    }
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      {/* contents */}
      <main className="container mx-auto w-full py-4 px-3 sm:px-5 sm:py-6">
        <div className="flex justify-between">
          {/* stats */}
          <div>
            <span>Total tasks: </span>
            {lists.reduce((acc, list) => acc + list.tasks.length, 0)}
          </div>

          <Button
            onClick={() => setCreateTaskDialogOpen(true)}
            className="cursor-pointer"
          >
            <Plus />
            Add Task
          </Button>
        </div>

        {/* task categories */}
        <DndContext
          // sensors={}
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="w-full overflow-x-auto lg:px-2 lg:-mx-2">
            <div className="pt-4 flex flex-col lg:flex-row lg:space-x-6 lg:overflow-x-auto lg:pb-6 lg:px-2 lg:-mx-2 lg:[&::-webkit-scrollbar]:h-2 lg:[&::-webkit-scrollbar-track]:bg-gray-100 lg:[&::-webkit-scrollbar-thumb]:bg-gray-300 lg:[&::-webkit-scrollbar-thumb]:rounded-full space-y-4 lg:space-y-0">
              {lists.map((list, key) => (
                <DroppableList
                  key={key}
                  list={list}
                  onCreateTask={() => setCreateTaskDialogOpen(true)}
                >
                  <SortableContext
                    items={list.tasks.map((task) => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {list.tasks.map((task, key) => (
                        <SortableTask key={key} task={task} />
                      ))}
                    </div>
                  </SortableContext>
                </DroppableList>
              ))}
              {/* add new list */}
              <div className="w-full lg:flex-shrink-0 lg:w-80">
                <Button
                  variant="outline"
                  className="cursor-pointer w-full h-full min-h-[200px] border-dashed border-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setCreateListDialogOpen(true)}
                >
                  <Plus />
                  Add another list
                </Button>
              </div>

              <DragOverlay>
                {activeTask && <TaskOverlay task={activeTask} />}
              </DragOverlay>
            </div>
          </div>
        </DndContext>
      </main>

      {/* create task dialog */}
      <Dialog
        open={isCreateTaskDialogOpen}
        onOpenChange={setCreateTaskDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Add a new task to your board</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6 py-4">
              {/* title input */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Task title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Bug fix"
                  value={title}
                  onChange={(e) => setTitle(e.currentTarget.value)}
                  name="title"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose of this task..."
                  name="description"
                  className="w-full min-h-[100px] resize-none"
                />
              </div>
              <div className="flex flex-wrap gap-x-6">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="assignee" className="text-sm font-medium">
                    Assignee
                  </Label>
                  <Input
                    id="assignee"
                    placeholder="Who should do this"
                    name="assignee"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-sm font-medium">
                    Priority
                  </Label>
                  <Select name="priority">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Priorities</SelectLabel>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-sm font-medium">
                  Due date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  name="dueDate"
                  className="w-full"
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setCreateTaskDialogOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreatingTask || !title.trim()}
                className="cursor-pointer"
              >
                {isCreatingTask && <Loader2 className="animate-spin" />}
                Create Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* create new list dialog */}
      <Dialog
        open={isCreateListDialogOpen}
        onOpenChange={setCreateListDialogOpen}
      >
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Create New List</DialogTitle>
            <p className="text-sm text-gray-600">
              Add new list to organize your tasks
            </p>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreateList}>
            <div className="space-y-2">
              <Label>List Title</Label>
              <Input
                id="columnTitle"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="Enter list title..."
                required
              />
            </div>
            <div className="space-x-2 flex justify-end">
              <Button
                type="button"
                onClick={() => setCreateListDialogOpen(false)}
                variant="outline"
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={!newListTitle || isCreatingList}
              >
                {isCreatingList && <Loader2 className="animate-spin" />}
                Create List
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoardDetail;
