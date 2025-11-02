import { useState } from "react";

export function useSubscription() {
  const [error, setError] = useState<string | null>(null);

  const manageSubscription = async (
    accessToken: string,
    plan: 'premium' | 'enterprise'
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-stripe-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ plan }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      window.location.href = data.url;
    } catch (error: any) {
      console.error("Error managing subscription:", error);
      setError(error.message);
      throw error;
    }
  };

  return { manageSubscription, error };
}