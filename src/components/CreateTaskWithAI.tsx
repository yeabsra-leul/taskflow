"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, SparkleIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useBoard } from "@/lib/hooks/useBoards";
import { Task } from "@/lib/supabase/models";

export default function CreateTaskWithAI({
  list_id,
  board_id,
  workspace_id,
  sort_order,
  onCreate
}: {
  list_id: string;
  board_id: string;
  workspace_id: string;
  sort_order: number;
  onCreate?: (newTask: Task) => void;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleCreate = async () => {
    if (!input.trim() || !user) return;

    setLoading(true);
    try {
      const res = await fetch("/api/ai/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          userId: user.user_id,
          sort_order,
          list_id,
          board_id,
          workspace_id,
        }),
      });

      console.log("ai res", res);

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");

      const newTask = json.task;
      
      
      // refresh tasks list
      onCreate && onCreate(newTask);

      setInput("");
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to create task with ai");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700" size={"sm"}>
          Create with AI
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Task with AI</DialogTitle>
          <DialogDescription>
            Describe what must be done. Be more detailed for better results.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="task-description">Task description</Label>
            <Textarea
              id="task-description"
              placeholder="e.g. Schedule team standup every Monday at 10am"
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleCreate}
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Thinking…
              </>
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
