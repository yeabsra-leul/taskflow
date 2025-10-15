"use client";

import { useUser } from "@clerk/nextjs";
import { useSupabase } from "../supabase/SupabaseProvider";
import { Board, List, ListWithTasks } from "../supabase/models";
import {
  boardDataService,
  boardService,
  taskService,
} from "../services/services";
import { useEffect, useState } from "react";

export function useBoards() {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loadingBoards, setLoadingBoards] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadBoards();
    }
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
        setError("Failed to create board");
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
        board: { ...board, user_id: user?.id as string },
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
    taskData,
  }: {
    listId: string;
    taskData: {
      title: string;
      description?: string;
      assignee?: string;
      due_date?: string;
      priority?: "low" | "medium" | "high";
    };
  }) {
    const newTask = await taskService().createTask({
      supabase: supabase!,
      task: {
        title: taskData.title,
        description: taskData.description || null,
        assignee: taskData.assignee || null,
        due_date: taskData.due_date || null,
        priority: taskData.priority || "medium",
        list_id: listId,
        sort_order: lists.find((list) => list.id === listId)?.tasks.length || 0,
      },
    });

    setLists((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, tasks: [...list.tasks, newTask] } : list
      )
    );
  }

  return { board, lists, loadingBoard, error, loadBoard, createNewTask };
}
