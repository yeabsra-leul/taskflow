import { LoaderIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function LoadingSpinner({ className,text }: {className?:string,text?:string}) {
  return (
    <div className="flex items-center space-x-1">
      <LoaderIcon
        role="status"
        aria-label="Loading"
        className={cn("size-5 animate-spin", className)}
      />
      <span>{text??"Loading"}</span>
    </div>
  );
}

export { LoadingSpinner };
