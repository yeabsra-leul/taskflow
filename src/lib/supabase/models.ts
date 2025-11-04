import { Database } from "@/lib/supabase/database.types";

export interface Board {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  color: string;
  description: string | null;
  user_id: string;
  workspace_id:string
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
  board_id: string;
  workspace_id: string;
}

// Database Models
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// Extended User type that includes additional fields not in the database
export type User = Profile & {
  email: string;
  boards_created: number;
};

// supabase/models.ts
export interface Workspace {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  slug: string;
  created_by: string;
  color:string;
}