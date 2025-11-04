"use client";

import * as React from "react";
import {
  Building,
  Building2,
  ChevronsUpDown,
  GalleryVerticalEnd,
  Plus,
  Settings,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useWorkspaces } from "@/lib/hooks/useWorkspaces";
import { useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";

function WorkspaceButtonSkeleton() {
  return (
    <div className="flex items-center gap-3 w-full">
      <Skeleton className="size-8 rounded-lg bg-gray-200" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-6 w-40 bg-gray-200" />
      </div>
      <Skeleton className="h-6 w-6 ml-auto bg-gray-200" />
    </div>
  );
}

export function WorkspaceSwitcher() {
  const { isMobile } = useSidebar();
  const { workspaces, isLoadingWorkspaces } = useWorkspaces();
  const [activeWorkspace, setActiveWorkspace] = React.useState(workspaces[0]);

  useEffect(() => {
    setActiveWorkspace(workspaces[0]);
    console.log("activeWorkspace", activeWorkspace);
  }, [workspaces]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {isLoadingWorkspaces ? (
              <WorkspaceButtonSkeleton />
            ) : workspaces.length === 0 ? (
              // NO WORKSPACES
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-default"
                disabled
              >
                <div className="bg-sidebar-muted text-sidebar-muted-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-sidebar-muted-foreground">
                    No workspace
                  </span>
                </div>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {activeWorkspace?.name || "Select workspace"}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Workspaces
            </DropdownMenuLabel>
            {workspaces.map((workspace, index) => (
              <DropdownMenuItem
                key={workspace.name}
                onClick={() => setActiveWorkspace(workspace)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Building2 className="size-3.5 shrink-0" />
                </div>
                {workspace.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2 cursor-pointer" asChild>
              <Link href={`/w`}>
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Settings className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Manage workspaces
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
