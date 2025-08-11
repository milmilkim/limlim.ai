import React, { forwardRef } from "react";
import { clsx } from "clsx";

export type ButtonVariant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline:
    "border bg-transparent hover:bg-secondary",
  ghost:
    "bg-transparent hover:bg-secondary",
  destructive:
    "bg-destructive text-white hover:bg-destructive/90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4",
  lg: "h-11 px-5 text-base",
  icon: "h-10 w-10 p-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          // base
          "inline-flex items-center justify-center rounded-md font-medium transition-colors select-none whitespace-nowrap",
          size === "icon" ? "gap-0" : "gap-2",
          "focus:outline-none focus:ring-2 focus:ring-ring",
          "disabled:opacity-50 disabled:pointer-events-none",
          // size & variant
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading && (
          <span className="i-svg-spinners-3-dots-scale text-current" aria-hidden />
        )}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span className={clsx(size === "icon" && "sr-only")}>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
