export interface Board {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  color: string;
  description: string | null;
  user_id: string;
}

export interface List {
  id: string;
  created_at: string;
  title: string;
  sort_order: number;
  board_id: string;
  user_id: string;
}

export type ListWithTasks = List & { tasks: Task[] };

export interface Task {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: "low" | "medium" | "high";
  sort_order: number;
  assignee: string | null;
  list_id: string;
}
