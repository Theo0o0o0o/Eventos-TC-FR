import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.01em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-0",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-sm shadow-primary/20",
        secondary: "border-secondary/30 bg-secondary/18 text-secondary-foreground backdrop-blur-md hover:bg-secondary/24",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow-sm shadow-destructive/20",
        outline: "border-white/55 bg-white/45 text-foreground backdrop-blur-md dark:border-white/12 dark:bg-white/5",
        success: "border-transparent bg-success text-success-foreground shadow-sm shadow-success/20",
        theater: "border-violet-300/50 bg-violet-100/80 text-violet-700 backdrop-blur-md dark:border-violet-400/20 dark:bg-violet-500/15 dark:text-violet-200",
        presentation: "border-sky-300/50 bg-sky-100/80 text-sky-700 backdrop-blur-md dark:border-sky-400/20 dark:bg-sky-500/15 dark:text-sky-200",
        lecture: "border-emerald-300/50 bg-emerald-100/80 text-emerald-700 backdrop-blur-md dark:border-emerald-400/20 dark:bg-emerald-500/15 dark:text-emerald-200",
        fair: "border-amber-300/50 bg-amber-100/85 text-amber-700 backdrop-blur-md dark:border-amber-400/20 dark:bg-amber-500/15 dark:text-amber-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
