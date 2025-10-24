"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "./ui/loading-spinner";

const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/signup", "/confirm-email"];
const DEFAULT_AUTHENTICATED_ROUTE = "/dashboard";
const DEFAULT_PUBLIC_ROUTE = "/";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Still loading auth state
    if (isLoading) {
      setShouldRender(false);
      return;
    }

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    // CASE 1: Logged in + public route → redirect, don't render
    if (isLoggedIn && isPublicRoute) {
      router.replace(DEFAULT_AUTHENTICATED_ROUTE);
      setShouldRender(false); // Prevents flash
      return;
    }

    // CASE 2: Not logged in + protected route → redirect
    if (!isLoggedIn && !isPublicRoute) {
      router.replace(DEFAULT_PUBLIC_ROUTE);
      setShouldRender(false);
      return;
    }

    // CASE 3: User belongs here → allow render
    setShouldRender(true);
  }, [isLoggedIn, isLoading, pathname, router]);

  // Show loading while deciding
  if (isLoading || !shouldRender) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  // Safe to render page
  return <>{children}</>;
}