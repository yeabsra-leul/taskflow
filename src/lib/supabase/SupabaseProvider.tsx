"use client";

import React, { ReactNode, useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type SupabaseContext = {
  supabase: SupabaseClient | null;
  isLoaded: boolean;
};

const Context = createContext<SupabaseContext>({
  supabase: null,
  isLoaded: false,
});

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isLoaded, setLoaded] = useState<boolean>(false);

  const { session } = useSession();

  useEffect(() => {
    if (!session) {
      setSupabase(null);
      setLoaded(true);
      return;
    }

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        accessToken: () => session.getToken(),
      }
    );

    setSupabase(client);
    setLoaded(true);

    console.log("isloaded", isLoaded);
  }, [session]);
  return (
    <Context.Provider value={{ supabase, isLoaded }}>
      {isLoaded ? (
        children
      ) : (
        <div className="min-h-screen w-full flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </Context.Provider>
  );
};

export function useSupabase() {
  const context = useContext(Context);

  if (context === undefined) {
    throw Error("Please access useSupabase only inside the provider");
  }

  return context;
}
