"use client";

import { useSupabase } from "../supabase/SupabaseProvider";
import { Board, List, ListWithTasks, Task } from "../supabase/models";
import {
  boardDataService,
  boardService,
  listService,
  taskService,
} from "../services/services";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useWorkspaceStore } from "@/store/workspaceStore";

export function useBoards() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const {activeWorkspace} = useWorkspaceStore()
  const [boards, setBoards] = useState<Board[]>([]);
  const [loadingBoards, setLoadingBoards] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadBoards();
    }
    console.log("suppppp",supabase)
  }, [user, supabase]);

  async function loadBoards() {
    if (!user) return;
    try {
      const boardsData = await boardService().getBoards({
        supabase: supabase!,
      });
      setBoards(boardsData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to load board");
      }
    } finally {
      setLoadingBoards(false);
    }
  }

  async function createBoard({
    board,
  }: {
    board: {
      title: string;
      color: string;
      description: string | null;
    };
  }) {
    if (!user) throw new Error("User is not authenticated");
    try {
      const newBoard = await boardDataService().createBoardWithList({
        supabase: supabase!,
        board: { ...board, user_id: user?.user_id as string, workspace_id:activeWorkspace?.id ?? "" }
      });

      setBoards((prev) => [newBoard, ...prev]);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create board");
      }
    }
  }

  return { createBoard, boards, loadingBoards, error };
}

export function useBoard({ boardId }: { boardId: string }) {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const [board, setBoard] = useState<Board | null>(null);
  const [lists, setLists] = useState<ListWithTasks[]>([]);
  const [loadingBoard, setLoadingBoard] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (boardId) {
      loadBoard();
    }
  }, [boardId, supabase]);

  async function loadBoard() {
    if (!boardId) throw new Error("Board not found");

    try {
      const { board, listWithTasks } =
        await boardDataService().getBoardWithList({
          supabase: supabase!,
          boardId,
        });
      setBoard(board);
      console.log("boardFromData", board);
      setLists(listWithTasks);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to fetch board");
      }
    } finally {
      setLoadingBoard(false);
    }
  }

  async function createNewTask({
    listId,
    boardId,
    taskData,
  }: {
    listId: string;
    boardId: string;
    taskData: {
      title: string;
      description?: string;
      assignee?: string;
      due_date?: string;
      priority?: "low" | "medium" | "high";
    };
  }) {
    try {
      const newTask = await taskService().createTask({
        supabase: supabase!,
        task: {
          title: taskData.title,
          description: taskData.description || null,
          assignee: taskData.assignee || null,
          due_date: taskData.due_date || null,
          priority: taskData.priority || "medium",
          list_id: listId,
          board_id: boardId,
          sort_order:
            lists.find((list) => list.id === listId)?.tasks.length || 0,
        },
      });

      setLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? { ...list, tasks: [...list.tasks, newTask] }
            : list
        )
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create the task"
      );
    }
  }

  async function moveTask({
    taskId,
    toListId,
    newOrder,
  }: {
    taskId: string;
    toListId: string;
    newOrder: number;
  }) {
    try {
      await taskService().moveTask({
        supabase: supabase!,
        taskId,
        toListId,
        newOrder,
      });

      setLists((prev) => {
        const newLists = [...prev];

        // Find and remove task from the old list
        let taskToMove: Task | null = null;
        for (const list of newLists) {
          const taskIndex = list.tasks.findIndex((task) => task.id === taskId);
          if (taskIndex !== -1) {
            taskToMove = list.tasks[taskIndex];
            list.tasks.splice(taskIndex, 1);
            break;
          }
        }

        if (taskToMove) {
          // Add task to new list
          const targetList = newLists.find((list) => list.id === toListId);
          if (targetList) {
            targetList.tasks.splice(newOrder, 0, taskToMove);
          }
        }

        return newLists;
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to move the task"
      );
    }
  }

  async function createNewList({ listTitle }: { listTitle: string }) {
    if (!board || !user) {
      throw new Error("Board not found");
    }

    try {
      const newList = {
        title: listTitle,
        board_id: board.id,
        user_id: user.user_id,
        sort_order: lists.length,
      };
      const createdList = await listService().createList({
        supabase: supabase!,
        list: newList,
      });
      setLists((prev) => [...prev, { ...createdList, tasks: [] }]);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create the list"
      );
    }
  }

  async function updateList({
    updatedTitle,
    listId,
  }: {
    updatedTitle: string;
    listId: string;
  }) {
    if (!board || !user) {
      throw new Error("Board not found");
    }

    try {
      const updatedList = await listService().updateList({
        supabase: supabase!,
        listId,
        updatedTitle,
      });
      setLists((prev) =>
        prev.map((list) =>
          list.id === listId ? { ...list, title: updatedTitle } : list
        )
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update the list"
      );
    }
  }

  async function deleteList({
    listId,
  }: {
    listId: string;
  }) {
    if (!board || !user) {
      throw new Error("Board not found");
    }

    try {
      await listService().deleteList({
        supabase: supabase!,
        listId,
      });
      setLists((prev) =>
        prev.filter((list)=>list.id !== listId)
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete the list"
      );
    }
  }

  return {
    board,
    lists,
    loadingBoard,
    error,
    loadBoard,
    createNewTask,
    setLists,
    moveTask,
    createNewList,
    updateList,
    deleteList
  };
}
