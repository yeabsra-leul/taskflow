"use client";

import { Badge } from "@/components/ui/badge";
import { Crown, Star, Sparkles } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PlanBadgeProps {
  plan: "free" | "premium" | "enterprise";
}

export function PlanBadge({ plan }: PlanBadgeProps) {
  const planStyles = {
    free: {
      icon: <Star className="w-3.5 h-3.5 text-blue-500" />,
      label: "Free Plan",
      description: "Limited to 1 workspace and 2 boards with basic features.",
      className: "bg-blue-50 text-blue-700 border border-blue-200",
    },
    premium: {
      icon: <Crown className="w-3.5 h-3.5 text-yellow-500" />,
      label: "Premium Plan",
      description: "Access up to 5 workspaces and advanced collaboration tools.",
      className:
        "bg-yellow-50 text-yellow-700 border border-yellow-200 shadow-sm",
    },
    enterprise: {
      icon: <Sparkles className="w-3.5 h-3.5 text-purple-500" />,
      label: "Enterprise",
      description: "Unlimited workspaces and advanced features.",
      className:
        "bg-purple-50 text-purple-700 border border-purple-200 shadow-sm",
    },
  };

  const style = planStyles[plan] ?? planStyles.free;

  return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.className}`}
          >
            {style.icon}
            {style.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[220px] text-sm bg-foreground text-background">
          {style.description}
        </TooltipContent>
      </Tooltip>
  );
}