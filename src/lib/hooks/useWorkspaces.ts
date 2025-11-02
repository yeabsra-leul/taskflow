"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useSupabase } from "../supabase/SupabaseProvider";
import { Workspace } from "../supabase/models";
import { workspaceService } from "../services/services";

export function useWorkspaces() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && supabase) {
      loadWorkspaces();
      console.log("workkkkk",workspaces)
    }
  }, [user, supabase]);

  async function loadWorkspaces() {
    if (!user || !supabase) return;

    try {
      const data = await workspaceService().getWorkspaces({
        supabase,
        userId: user.user_id,
      });
      setWorkspaces(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  }

  async function createWorkspace({
    name,
    slug,
  }: {
    name: string;
    slug: string;
  }) {
    if (!user || !supabase) throw new Error("User not authenticated");

    try {
      const newWorkspace = await workspaceService().createWorkspace({
        supabase,
        workspace: {
          name,
          slug,
          created_by: user.user_id,
        },
      });

      setWorkspaces((prev) => [newWorkspace, ...prev]);
      return newWorkspace;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create workspace";
      setError(message);
      throw new Error(message);
    }
  }

  return {
    workspaces,
    isLoadingWorkspaces:loading,
    error,
    createWorkspace,
    refresh: loadWorkspaces,
  };
}