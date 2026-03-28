import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring/35 focus:ring-offset-0",
  {
    variants: {
      variant: {
        default: "border-primary/20 bg-primary text-primary-foreground shadow-[0_12px_20px_-16px_hsl(var(--paper-shadow)/0.8)]",
        secondary: "border-secondary/30 bg-secondary/85 text-secondary-foreground",
        destructive: "border-destructive/20 bg-destructive text-destructive-foreground",
        outline: "border-foreground/14 bg-[hsl(var(--paper-strong)/0.95)] text-foreground",
        success: "border-success/20 bg-success text-success-foreground",
        theater: "border-violet-300/40 bg-violet-100 text-violet-800 dark:border-violet-400/20 dark:bg-violet-500/15 dark:text-violet-100",
        presentation: "border-sky-300/40 bg-sky-100 text-sky-800 dark:border-sky-400/20 dark:bg-sky-500/15 dark:text-sky-100",
        lecture: "border-emerald-300/40 bg-emerald-100 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/15 dark:text-emerald-100",
        fair: "border-amber-300/40 bg-amber-100 text-amber-800 dark:border-amber-400/20 dark:bg-amber-500/15 dark:text-amber-100",
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
