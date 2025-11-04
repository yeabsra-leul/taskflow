"use client";

import { useState, useEffect } from "react";
import { User } from "../supabase/models";
import { UseAuthReturn } from "@/types/auth";
import { useSupabase } from "../supabase/SupabaseProvider";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useRouter } from "next/navigation";

export function useAuth(): UseAuthReturn {
  const { supabase } = useSupabase();
  const {activeWorkspace} = useWorkspaceStore()

  if (!supabase) {
    throw new Error("Supabase client is not initialized yet");
  }

  // State
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningUp, setSigningUp] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);
  const [isLoggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUpMode, setIsSignUpMode] = useState(false);


  // Helper functions
  const clearError = () => setError(null);

  const fetchUserProfile = async (userId: string, userEmail: string) => {
    try {
      const [profileResponse] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).single(),
        // supabase
        //   .from("usage_tracking")
        //   .select("boards_created")
        //   .eq("user_id", userId)
        //   .eq("year_month", new Date().toISOString().slice(0, 7))
        //   .maybeSingle(),
      ]);

      if (profileResponse.error) throw profileResponse.error;

      setUser({
        ...profileResponse.data,
        email: userEmail,
      });
    } catch (error) {
      console.error("Critical error fetching user profile:", error);
      await signOut();
    } finally {
      setIsLoading(false);
    }
  };

  const checkCurrentUserPlan = (plan: "free" | "premium" | "enterprise") => {
    let subscriptionPlan: "free" | "premium" | "enterprise" | null = null;

    if (user) {
      subscriptionPlan =
        (user.subscription_plan as "free" | "premium" | "enterprise") || "free";
    }
    
    return subscriptionPlan === plan;
  }

  const updateSessionState = async (newSession: any) => {
    setSession(newSession);
    setIsLoggedIn(!!newSession);

    if (newSession?.user) {
      // setIsLoading(true); // fix later if causes flicker
      await fetchUserProfile(newSession.user.id, newSession.user.email);
    } else {
      setUser(null);
      setIsLoading(false);
    }
  };

  // Auth methods
  const signOut = async () => {
    setLoggingOut(true)
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setIsLoggedIn(false);
      setEmail("");
      setPassword("");
      window.localStorage.removeItem("supabase.auth.token");
    } catch (error: any) {
      setError(error.message);
      console.error("Error signing out:", error);
    }
    finally{
      setLoggingOut(false)
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoggingIn(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        throw new Error(error.message);
      }

      console.log("✅ User logged in:", email);
      router.push("/w")
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/w`,
        },
      });
    } catch (error: any) {
      setError(error.message);
      console.error("Error with Google login:", error);
    }
  };

  const handleSignup = async () => {
    clearError();
    setSigningUp(true); 
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/w`
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setError("Please check your email to confirm your account");
        // Redirect user to the confirmation page on successful signup
        // window.location.assign(`${window.location.origin}/confirm-email`);
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Error signing up:", error);
    } finally {
      setSigningUp(false);
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        await updateSessionState(session);
      } catch (error: any) {
        console.error("Error initializing auth:", error);
        setError(error.message);
        await signOut();
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateSessionState(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    // State
    user,
    session,
    email,
    password,
    isLoggedIn,
    isLoading,
    error,
    isSignUpMode,
    isSigningUp,
    isLoggingIn,
    isLoggingOut,

    // Operations
    signOut,
    handleLogin,
    handleGoogleLogin,
    handleSignup,
    setEmail,
    setPassword,
    setIsSignUpMode,
    clearError,
    checkCurrentUserPlan
  };
}
