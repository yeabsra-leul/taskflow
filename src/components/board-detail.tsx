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
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Filter,
  Loader2,
  MoreVertical,
  OctagonAlert,
  Plus,
  Search,
  User,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { DroppableList, SortableTask, TaskOverlay } from "./dnd-helpers";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

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
    updateList,
    deleteList,
  } = useBoard({
    boardId,
  });
  const [isCreateTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [isCreateListDialogOpen, setCreateListDialogOpen] = useState(false);
  const [isEditListDialogOpen, setEditListDialogOpen] = useState(false);
  const [isDeleteListDialogOpen, setDeleteListDialogOpen] = useState(false);
  const [isCreatingTask, setCreatingTask] = useState(false);
  const [isCreatingList, setCreatingList] = useState(false);
  const [isUpdatingList, setUpdatingList] = useState(false);
  const [isDeletingList, setDeletingList] = useState(false);
  const [listToUpdate, setListToUpdate] = useState<ListWithTasks | null>(null);
  const [listToDelete, setListToDelete] = useState<ListWithTasks | null>(null);
  const [title, setTitle] = useState("");
  const [newListTitle, setNewListTitle] = useState("");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priority: [] as string[],
    assignee: null as string | null,
    dueDate: null as string | null,
  });

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

  //update list
  async function handleUpdateList(e: FormEvent) {
    e.preventDefault();
    setUpdatingList(true);
    if (!newListTitle.trim()) {
      return;
    }
    try {
      await updateList({
        updatedTitle: newListTitle,
        listId: listToUpdate?.id as string,
      });
      setEditListDialogOpen(false);
    } catch (error) {
      toast.error("Error updating list");
    } finally {
      setUpdatingList(false);
    }
  }

  // delete list from board
  async function handleDeleteList() {
    setDeletingList(true);
    if (!listToDelete) {
      return;
    }

    try {
      await deleteList({
        listId: listToDelete?.id as string,
      });
      setDeleteListDialogOpen(false);
      toast.success("List deleted successfully");
    } catch (error) {
      toast.error("Error deleting list");
    } finally {
      setDeletingList(false);
    }
  }

  // filter tasks
  function handleFilterChange(
    type: "priority" | "assignee" | "dueDate",
    value: string | string[] | null
  ) {
    setFilters((prev) => ({ ...prev, [type]: value }));
  }

  // count filters selected
  function getFiltersCount() {
    return Object.values(filters).reduce(
      (count, value) =>
        count + (Array.isArray(value) ? value?.length : value != null ? 1 : 0),
      0
    );
  }

  const filteredLists = lists.map((list) => ({
    ...list,
    tasks: (list.tasks).filter((task) => {

      console.log("tasks",list.tasks)
      console.log("task",task)
      //by priority
      if (
        filters.priority.length > 0 &&
        !filters.priority.includes(task.priority)
      ) {
        return false;
      }

      // by due date
      if (filters.dueDate && task.due_date) {
        const filterDate = new Date(filters.dueDate).toDateString();
        const taskDate = new Date(task.due_date).toDateString();
        if (filterDate !== taskDate) {
          return false;
        }
      }

      return true;
    }),
  }));

  return (
    <div className="flex-1 min-h-screen">
      {/* contents */}
      <main className="container mx-auto w-full py-2 px-3 sm:px-5 sm:py-4">
        {/* board info */}
        <div className="flex justify-between mb-8">
          <div>
            <div className="text-2xl font-semibold text-gray-700">
              {board?.title}
            </div>
            <div className="text-xs text-gray-500">{board?.description}</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-sm cursor-pointer"
            >
              <User className="h-4 w-4 mr-2" />
              Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="cursor-pointer"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  Edit board
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Archive board
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                >
                  Delete board
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:justify-between">
          {/* Filters */}
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tasks..." className="pl-9" />
            </div>
            <Button
              variant="outline"
              size="sm"
              className={`relative cursor-pointer space-x-1 ${
                getFiltersCount() > 0 &&
                "bg-blue-100/80 border border-blue-200/80 hover:bg-blue-100"
              }`}
              onClick={() => setFilterOpen(true)}
            >
              <Filter className="h-3 w-3 mr-2" />
              <span className="text-xs">Filters</span>
              {getFiltersCount() > 0 && (
                <Badge
                  variant="secondary"
                  className={`h-5 w-5 text-xs flex-shrink-0 rounded-full, ${
                    getFiltersCount() > 0 &&
                    "bg-blue-100/80 border border-blue-200/80"
                  }`}
                >
                  {getFiltersCount()}
                </Badge>
              )}
            </Button>
          </div>

          <Button
            onClick={() => setCreateTaskDialogOpen(true)}
            className="cursor-pointer max-w-[540px]"
            size={"sm"}
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
              {filteredLists.map((list, key) => (
                <DroppableList
                  key={key}
                  list={list}
                  onCreateTask={() => setCreateTaskDialogOpen(true)}
                  onEditList={(list) => {
                    setEditListDialogOpen(true);
                    setListToUpdate(list);
                    setNewListTitle(list.title);
                  }}
                  onDeleteList={(list) => {
                    setDeleteListDialogOpen(true);
                    setListToDelete(list);
                  }}
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
        open={isCreateListDialogOpen || isEditListDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditListDialogOpen(false);
            setCreateListDialogOpen(false);
            setNewListTitle("");
          }
        }}
      >
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditListDialogOpen ? "Update " : "Create New "}
              List
            </DialogTitle>
            <p className="text-sm text-gray-600">
              {isEditListDialogOpen
                ? "Update the detail of your list"
                : "Add new list to organize your tasks"}
            </p>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) =>
              isEditListDialogOpen ? handleUpdateList(e) : handleCreateList(e)
            }
          >
            <div className="space-y-2">
              <Label>List Title</Label>
              <Input
                type="text"
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
                onClick={() => {
                  setCreateListDialogOpen(false);
                  setEditListDialogOpen(false);
                  setNewListTitle("");
                }}
                variant="outline"
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={!newListTitle || isCreatingList || isUpdatingList}
              >
                {(isCreatingList || isUpdatingList) && (
                  <Loader2 className="animate-spin" />
                )}
                {isEditListDialogOpen ? "Update List" : "Create List"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* delete list confirmation dialog */}
      <Dialog
        open={isDeleteListDialogOpen}
        onOpenChange={setDeleteListDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>Delete list</span>{" "}
              <OctagonAlert className="h-5 w-5 text-red-600" />
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this list? This action cannot be
              undone. All tasks inside the list will be permanently removed.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteListDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              variant="destructive"
              onClick={handleDeleteList}
            >
              {isDeletingList && <Loader2 className="animate-spin" />}
              Delete List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* fitlers dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>Filter Tasks</span>
            </DialogTitle>
            <DialogDescription>
              Filter tasks by priority, assignee or due date
            </DialogDescription>
          </DialogHeader>

          {/* filters */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium">
                Priority
              </Label>
              <div className="space-x-2">
                {["low", "medium", "high"].map((priority, key) => (
                  <Button
                    key={key}
                    size="sm"
                    className="capitalize rounded-sm text-xs cursor-pointer"
                    variant={
                      filters.priority.includes(priority)
                        ? "default"
                        : "outline"
                    }
                    onClick={() => {
                      const newPriorities = filters.priority.includes(priority)
                        ? filters.priority.filter((pr) => pr !== priority)
                        : [...filters.priority, priority];
                      handleFilterChange("priority", newPriorities);
                    }}
                  >
                    {priority}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium">
                Due date
              </Label>
              <Input
                type="date"
                value={filters.dueDate || ""}
                onChange={(e) =>
                  handleFilterChange("dueDate", e.currentTarget.value)
                }
                className="w-full"
              />
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-between w-full">
            <Button
              variant="outline"
              onClick={() =>
                setFilters({
                  priority: [] as string[],
                  assignee: null as string | null,
                  dueDate: null as string | null,
                })
              }
              className="cursor-pointer"
            >
              Reset
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => setFilterOpen(false)}
            >
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoardDetail;
