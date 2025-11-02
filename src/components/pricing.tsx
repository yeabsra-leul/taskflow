"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, ChevronLeft } from "lucide-react";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";
import { useSubscription } from "@/lib/hooks/useSubscription";
import { useAuth } from "@/lib/hooks/useAuth";
import { PricingSkeleton } from "./ui/pricing-skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface Props {
  subscriptionPlan: "free" | "premium" | "enterprise" | null;
}

export default function PricingClient() {
  const { user, isLoading: authLoading, checkCurrentUserPlan } = useAuth();

  const supabase = useSupabase();
  const { manageSubscription } = useSubscription();
  const router = useRouter();
  const [loading, setLoading] = useState<"premium" | "enterprise" | null>(null);

  const handleUpgrade = async (plan: "premium" | "enterprise") => {
    setLoading(plan);
    try {
      const session = supabase.session;
      if (!session) {
        router.push("/signin");
        return;
      }
      await manageSubscription(session.access_token, plan);
    } catch (error) {
      console.error("Upgrade failed:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-10 px-6 bg-muted/30">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="group flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span className="text-sm font-medium">Back</span>
        </Button>
      </div>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Choose the perfect plan for your team. Always flexible to scale.
          </p>
        </motion.div>

        {authLoading ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {/* Three skeletons */}
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <PricingSkeleton />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div
            // variants={containerVariants}
            // initial="hidden"
            // whileInView="visible"
            // viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {/* Free Plan */}
            <motion.div variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 flex flex-col">
                <CardContent className="p-8 flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-2">Free</h3>
                  <p className="text-muted-foreground mb-6">
                    Perfect for individuals
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                  <Button
                    className="w-full mb-8 bg-transparent"
                    variant="outline"
                    disabled
                  >
                    Current Plan
                  </Button>
                  <div className="space-y-4 flex-1">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">1 workspace</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">3 boards per workspace</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Basic features</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Community support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Premium Plan (Recommended) */}
            <motion.div variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 border-primary flex flex-col relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Recommended
                  </Badge>
                </div>
                {checkCurrentUserPlan("premium") && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-primary text-primary-foreground p-1 rounded-full text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                )}
                <CardContent className="p-8 flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-2">Premium</h3>
                  <p className="text-muted-foreground mb-6">
                    For growing teams
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$20</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                  <Button
                    className="w-full mb-8 cursor-pointer"
                    onClick={() => handleUpgrade("premium")}
                    variant={
                      checkCurrentUserPlan("premium") ? "default" : "outline"
                    }
                    disabled={loading === "premium"}
                  >
                    {checkCurrentUserPlan("premium")
                      ? "Manage Plan"
                      : loading === "premium"
                      ? "Loading..."
                      : "Upgrade Now"}{" "}
                    {checkCurrentUserPlan("premium") ? null : (
                      <ArrowRight className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                  <div className="space-y-4 flex-1">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">5 workspaces</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Unlimited boards</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Priority support</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Advanced analytics</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Team collaboration</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 flex flex-col relative">
                {checkCurrentUserPlan("enterprise") && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-primary text-primary-foreground p-1 rounded-full text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                )}
                <CardContent className="p-8 flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                  <p className="text-muted-foreground mb-6">
                    For large organizations
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$50</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                  <Button
                    className="w-full mb-8 cursor-pointer"
                    variant={
                      checkCurrentUserPlan("enterprise") ? "default" : "outline"
                    }
                    onClick={() => handleUpgrade("enterprise")}
                    disabled={loading === "enterprise"}
                  >
                    {checkCurrentUserPlan("enterprise")
                      ? "Manage Plan"
                      : loading === "enterprise"
                      ? "Loading..."
                      : "Upgrade Now"}
                    {checkCurrentUserPlan("enterprise") ? null : (
                      <ArrowRight className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                  <div className="space-y-4 flex-1">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Unlimited workspaces</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Unlimited boards</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">SSO & audit logs</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Dedicated support</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Custom integrations</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
