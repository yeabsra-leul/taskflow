import { ListWithTasks } from "./../supabase/models";
import { Board, List, Task } from "../supabase/models";
import { SupabaseClient } from "@supabase/supabase-js";

export function boardService() {
  const createBoard = async ({
    supabase,
    board,
  }: {
    supabase: SupabaseClient;
    board: Omit<Board, "id" | "updated_at" | "created_at">;
  }): Promise<Board> => {
    const { data, error } = await supabase
      .from("boards")
      .insert(board)
      .select();
    if (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to create board");
    }
    return data[0];
  };

  const getBoards = async ({
    supabase,
  }: {
    supabase: SupabaseClient;
  }): Promise<Board[]> => {
    const { data, error } = await supabase
      .from("boards")
      .select()
      .order("updated_at", { ascending: false });
    if (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to fetch boards");
    }
    return data;
  };

  const getBoard = async ({
    supabase,
    boardId,
  }: {
    supabase: SupabaseClient;
    boardId: string;
  }): Promise<Board> => {
    const { data, error } = await supabase
      .from("boards")
      .select()
      .eq("id", boardId)
      .single();
    if (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to fetch board");
    }
    return data;
  };

  return { createBoard, getBoards, getBoard };
}

// list service
export function listService() {
  const createList = async ({
    supabase,
    list,
  }: {
    supabase: SupabaseClient;
    list: Omit<List, "id" | "created_at">;
  }): Promise<List> => {
    const { data, error } = await supabase.from("lists").insert(list).select();

    if (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to create list");
    }

    return data[0];
  };

  const updateList = async ({
    supabase,
    listId,
    updatedTitle,
  }: {
    supabase: SupabaseClient;
    listId: string;
    updatedTitle: string;
  }): Promise<List> => {
    const { data, error } = await supabase
      .from("lists")
      .update({ title: updatedTitle })
      .eq("id", listId)
      .select()
      .single();
    if (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to update list");
    }
    return data[0];
  };

  const deleteList = async ({
    supabase,
    listId,
  }: {
    supabase: SupabaseClient;
    listId: string;
  }): Promise<List> => {
    const { data, error } = await supabase
      .from("lists")
      .delete()
      .eq("id", listId)
      .select()
      .single();
    if (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to delete list");
    }
    return data[0];
  };

  const getLists = async ({
    supabase,
    boardId,
  }: {
    supabase: SupabaseClient;
    boardId: string;
  }): Promise<List[]> => {
    const { data, error } = await supabase
      .from("lists")
      .select()
      .eq("board_id", boardId)
      .order("sort_order", { ascending: true });

    if (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to fetch lists");
    }
    return data;
  };

  return { createList, getLists, updateList, deleteList };
}

//task service
export function taskService() {
  const createTask = async ({
    supabase,
    task,
  }: {
    supabase: SupabaseClient;
    task: Omit<Task, "id" | "updated_at" | "created_at">;
  }): Promise<Task> => {
    const { data, error } = await supabase
      .from("tasks")
      .insert(task)
      .select()
    if (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to create task");
    }
    return data[0];
  };

  const getTaskByBoardId = async ({
    supabase,
    boardId,
  }: {
    supabase: SupabaseClient;
    boardId: string;
  }): Promise<Task[]> => {
    const { data, error } = await supabase
      .from("tasks")
      .select(`*, lists!inner(board_id)`)
      .eq("lists.board_id", boardId)
      .order("sort_order", { ascending: true });
    if (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to get board tasks");
    }
    return data || [];
  };

  const moveTask = async ({
    supabase,
    taskId,
    toListId,
    newOrder,
  }: {
    supabase: SupabaseClient;
    taskId: string;
    toListId: string;
    newOrder: number;
  }): Promise<Task> => {
    const { data, error } = await supabase
      .from("tasks")
      .update({ list_id: toListId, sort_order: newOrder })
      .eq("id", taskId)
      .select()
      .single();
    if (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to move task");
    }
    return data[0];
  };

  return { createTask, getTaskByBoardId, moveTask };
}

// board + column + task services
export function boardDataService() {
  const createBoardWithList = async ({
    supabase,
    board,
  }: {
    supabase: SupabaseClient;
    board: Omit<Board, "id" | "updated_at" | "created_at">;
  }): Promise<Board> => {
    const createdBoard = await boardService().createBoard({ supabase, board });

    const lists = [
      {
        title: "Todo",
        sort_order: 0,
        board_id: createdBoard.id,
        user_id: createdBoard.user_id,
      },
      {
        title: "InProgress",
        sort_order: 1,
        board_id: createdBoard.id,
        user_id: createdBoard.user_id,
      },
      {
        title: "Review",
        sort_order: 2,
        board_id: createdBoard.id,
        user_id: createdBoard.user_id,
      },
      {
        title: "Done",
        sort_order: 3,
        board_id: createdBoard.id,
        user_id: createdBoard.user_id,
      },
    ];

    Promise.all(
      lists.map(async (list) => {
        await listService().createList({ supabase, list });
      })
    );

    return createdBoard;
  };

  const getBoardWithList = async ({
    supabase,
    boardId,
  }: {
    supabase: SupabaseClient;
    boardId: string;
  }) => {
    const [board, lists] = await Promise.all([
      boardService().getBoard({ supabase, boardId }),
      listService().getLists({ supabase, boardId }),
    ]);

    if (!board) {
      throw new Error("Board not found");
    }

    const tasks = await taskService().getTaskByBoardId({ supabase, boardId });

    const listWithTasks = lists.map((list) => ({
      ...list,
      tasks: tasks.filter((task) => task.list_id === list.id),
    }));

    return {
      board,
      listWithTasks,
    };
  };

  return { createBoardWithList, getBoardWithList };
}
