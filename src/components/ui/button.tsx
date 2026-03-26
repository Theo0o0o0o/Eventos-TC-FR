import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-transparent text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary bg-[image:var(--gradient-primary)] text-primary-foreground shadow-lg shadow-primary/20 hover:-translate-y-px hover:brightness-105 hover:shadow-xl",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md shadow-destructive/20 hover:-translate-y-px hover:bg-destructive/92 hover:shadow-lg",
        outline:
          "glass-field text-foreground hover:-translate-y-px hover:bg-white/80 dark:hover:bg-white/10",
        secondary:
          "bg-secondary/92 text-secondary-foreground shadow-md shadow-secondary/20 hover:-translate-y-px hover:bg-secondary hover:shadow-lg",
        ghost:
          "text-foreground/85 hover:bg-white/45 hover:text-foreground dark:hover:bg-white/10",
        link: "text-primary underline-offset-4 hover:underline",
        hero:
          "bg-primary bg-[image:var(--gradient-hero)] text-primary-foreground shadow-glow hover:-translate-y-px hover:brightness-105 hover:shadow-glow-lg font-semibold",
        accent:
          "bg-accent bg-[image:var(--gradient-accent)] text-accent-foreground shadow-lg shadow-secondary/25 hover:-translate-y-px hover:brightness-105 hover:shadow-xl font-semibold",
        success:
          "bg-success text-success-foreground shadow-md shadow-success/20 hover:-translate-y-px hover:bg-success/92 hover:shadow-lg",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-[1.1rem] px-10 text-lg",
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
