import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 ring-accent disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-accent text-[var(--accent-foreground)] hover:opacity-90",
        outline: "border border-border bg-transparent hover:border-accent hover:text-accent",
        ghost: "hover:bg-muted",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        link: "underline-offset-4 hover:underline text-accent",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
);
Button.displayName = "Button";

export { buttonVariants };
