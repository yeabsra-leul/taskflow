"use client"

import React, { ReactNode, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeModeToggle } from "./theme-mode-toggle";
import { useBoard } from "@/lib/hooks/useBoards";
import { useParams } from "next/navigation";

interface SideBarProps {
  children: ReactNode;
}
const SideBarWrapper = ({ children }: SideBarProps) => {
  const params = useParams<{ id:string }>()
  const boardId = params.id
  const { board} = useBoard({boardId});
  // const [boardData, setboardData] = useState(board);
  
  // console.log("board from sidebar",board)
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 justify-between pr-4">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Boards
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{board?.title ?? "Loading..."}</BreadcrumbPage>
                  </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          {/* theme toggler */}
          <ThemeModeToggle />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SideBarWrapper;
