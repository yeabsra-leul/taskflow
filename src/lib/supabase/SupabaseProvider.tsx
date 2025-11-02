"use client";

import React, { ReactNode, useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { createClient, SupabaseClient, Session } from "@supabase/supabase-js";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSyncWorkspaceFromUrl } from "../hooks/useSyncWorkspaceFromUrl";
import { RouteGuard } from "@/components/RouteGuard";

type SupabaseContextType = {
  supabase: SupabaseClient | null;
  session: Session | null;
  isLoaded: boolean;
};

const Context = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [supabase] = useState(() =>
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    )
  );

  const [session, setSession] = useState<Session | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoaded(true);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <Context.Provider value={{ supabase, session, isLoaded }}>
      {isLoaded ? (
        children
      ) : (
        <div className="min-h-screen w-full flex items-center justify-center">
          {/* <LoadingSpinner text="Loading..."/> */}
        </div>
      )}
    </Context.Provider>
  );
};

export function useSupabase() {
  const context = useContext(Context);
  if (!context)
    throw new Error("useSupabase must be used within SupabaseProvider");
  return context;
}

//sync workspace from url and guard routes
export function SyncWorkspaceAndGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  useSyncWorkspaceFromUrl();

  return <RouteGuard>{children}</RouteGuard>;
}
