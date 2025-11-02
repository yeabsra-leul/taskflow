// components/ui/pricing-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function PricingSkeleton() {
  return (
    <Card className="h-full border-2 flex flex-col">
      <CardContent className="p-8 flex flex-col h-full space-y-6">
        {/* Title */}
        <Skeleton className="h-8 w-28" />
        {/* Description */}
        <Skeleton className="h-5 w-36" />

        {/* Price */}
        <div className="flex items-end gap-2">
          <Skeleton className="h-12 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Button */}
        <Skeleton className="h-10 w-full" />

        {/* Feature list */}
        <div className="space-y-3 flex-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-5 w-5 rounded-full mt-0.5" />
              <Skeleton className="h-5 w-48" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}