// src/store/workspaceStore.ts
import { Workspace } from '@/lib/supabase/models'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type State = {
  activeWorkspace: Workspace | null
  setActiveWorkspace: (ws: Workspace | null) => void
  clear: () => void
}

export const useWorkspaceStore = create<State>()(
  persist(
    (set) => ({
      activeWorkspace: null,
      setActiveWorkspace: (ws) => set({ activeWorkspace: ws }),
      clear: () => set({ activeWorkspace: null }),
    }),
    {
      name: 'active-workspace', // saved in localStorage
    }
  )
)