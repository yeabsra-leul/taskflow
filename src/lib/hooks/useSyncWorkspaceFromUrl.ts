'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { useWorkspaces } from './useWorkspaces'

export function useSyncWorkspaceFromUrl() {
  const { workspaces, isLoadingWorkspaces } = useWorkspaces()
  const pathname = usePathname()
  const { setActiveWorkspace } = useWorkspaceStore()

  console.log('useSyncWorkspaceFromUrl', { pathname })

  useEffect(() => {
    if (isLoadingWorkspaces || !pathname.startsWith('/w/')) return

    const slug = pathname.split('/')[2]
    const found = workspaces.find(w => w.slug === slug)
    if (found) setActiveWorkspace(found)
  }, [pathname, workspaces, isLoadingWorkspaces, setActiveWorkspace])
}