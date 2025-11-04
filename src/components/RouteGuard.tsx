"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "./ui/loading-spinner";
import { useWorkspaces } from "@/lib/hooks/useWorkspaces";

const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/signup", "/confirm-email"];
const DEFAULT_PUBLIC_ROUTE = "/";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading: isLoadingUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { workspaces, isLoadingWorkspaces } = useWorkspaces();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    // Wait for user auth to finish
    if (isLoadingUser) {
      setShouldRender(false);
      return;
    }
    //Public routes
    if (isPublicRoute) {
      if (isLoggedIn) {
        // Redirect logged-in user from public route
        if (isLoadingWorkspaces) return; // Wait only if we need workspace info

        router.replace(`/w`);
        setShouldRender(false);
      } else {
        setShouldRender(true);
      }
      return;
    }

    // Protected routes
    if (!isLoggedIn) {
      router.replace(DEFAULT_PUBLIC_ROUTE);
      setShouldRender(false);
      return;
    }

    // Authenticated + not a public route → render
    if (!isLoadingWorkspaces) {
      setShouldRender(true);
    }
  }, [isLoggedIn, isLoadingUser, pathname, router, isLoadingWorkspaces, workspaces]);

  if (isLoadingUser || !shouldRender) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  return <>{children}</>;
}
