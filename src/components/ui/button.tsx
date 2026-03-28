import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border text-sm font-semibold ring-offset-background transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-primary/80 bg-primary text-primary-foreground shadow-[0_18px_30px_-20px_hsl(var(--paper-shadow)/0.9)] hover:-translate-y-0.5 hover:shadow-[0_22px_36px_-22px_hsl(var(--paper-shadow)/0.95)]",
        destructive:
          "border-destructive/80 bg-destructive text-destructive-foreground shadow-[0_18px_30px_-20px_hsl(var(--paper-shadow)/0.8)] hover:-translate-y-0.5 hover:brightness-[1.02]",
        outline:
          "border-foreground/15 bg-[hsl(var(--paper-strong)/0.96)] text-foreground shadow-[0_14px_24px_-20px_hsl(var(--paper-shadow)/0.72)] hover:-translate-y-0.5 hover:border-foreground/24 hover:bg-white dark:bg-[hsl(var(--paper-strong)/0.96)]",
        secondary:
          "border-secondary/35 bg-secondary text-secondary-foreground shadow-[0_18px_30px_-20px_hsl(var(--paper-shadow)/0.8)] hover:-translate-y-0.5 hover:brightness-[1.02]",
        ghost:
          "border-transparent bg-transparent text-foreground/82 hover:bg-foreground/[0.06] hover:text-foreground",
        link: "border-transparent p-0 text-primary underline-offset-4 hover:underline",
        hero:
          "border-foreground/8 bg-foreground text-white shadow-[0_20px_34px_-22px_hsl(var(--paper-shadow)/0.98)] hover:-translate-y-0.5 hover:bg-foreground/95",
        accent:
          "border-secondary/35 bg-secondary text-secondary-foreground shadow-[0_18px_30px_-20px_hsl(var(--paper-shadow)/0.86)] hover:-translate-y-0.5 hover:brightness-[1.02]",
        success:
          "border-success/80 bg-success text-success-foreground shadow-[0_18px_30px_-20px_hsl(var(--paper-shadow)/0.82)] hover:-translate-y-0.5 hover:brightness-[1.02]",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-12 px-6 text-[15px]",
        xl: "h-14 px-8 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
