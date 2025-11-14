"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  Loader2,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/hooks/useAuth";
import { Skeleton } from "./ui/skeleton";
import { useSubscription } from "@/lib/hooks/useSubscription";
import Link from "next/link";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const {
    user: currentUser,
    isLoading,
    session,
    signOut,
    isLoggingOut,
  } = useAuth();
  const { manageSubscription } = useSubscription();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {isLoading ? (
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                {/* Larger, more visible avatar skeleton */}
                <Skeleton className="h-8 w-8 rounded-full bg-primary/20" />

                {/* More prominent text skeletons */}
                <div className="grid flex-1 text-left text-sm leading-tight space-y-2">
                  <Skeleton className="h-5 w-32 bg-primary/30 rounded-md" />
                  <Skeleton className="h-4 w-40 bg-primary/20 rounded-md" />
                </div>

                <ChevronsUpDown className="ml-auto size-5 text-muted-foreground" />
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-full">
                  {currentUser?.avatar_url ? (
                    <AvatarImage
                      src={currentUser?.avatar_url}
                      alt={currentUser?.name ?? ""}
                    />
                  ) : currentUser?.name ? (
                    <AvatarFallback className="rounded-lg">
                      {(currentUser?.email?.slice(0, 1).toUpperCase() ?? "") +
                        (currentUser?.email?.slice(1, 2) ?? "")}
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback className="rounded-lg">
                      {(currentUser?.email?.slice(0, 1).toUpperCase() ?? "") +
                        (currentUser?.email?.slice(1, 2) ?? "")}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {currentUser?.name}
                  </span>
                  <span className="truncate text-xs">{currentUser?.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  {currentUser?.avatar_url ? (
                    <AvatarImage
                      src={currentUser?.avatar_url}
                      alt={currentUser?.name ?? ""}
                    />
                  ) : currentUser?.name ? (
                    <AvatarFallback className="rounded-lg">
                      {(currentUser?.email?.slice(0, 1).toUpperCase() ?? "") +
                        (currentUser?.email?.slice(1, 2) ?? "")}
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback className="rounded-lg">
                      {(currentUser?.email?.slice(0, 1).toUpperCase() ?? "") +
                        (currentUser?.email?.slice(1, 2) ?? "")}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {currentUser?.name ?? "User"}
                  </span>
                  <span className="truncate text-xs">{currentUser?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href="/pricing"
                  className="no-underline cursor-pointer"
                >
                  <Sparkles />
                  Upgrade Plan
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="cursor-pointer">
              {isLoggingOut ? <Loader2 className="animate-spin" /> : <LogOut />}
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
