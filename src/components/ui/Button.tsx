import { Slot } from "@radix-ui/react-slot";
import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "ghost" | "primary" | "outline" | "secondary";
  size?: "sm" | "md" | "lg"; 
}

export function Button({ 
  asChild, 
  variant = "primary", 
  size = "md",
  className, 
  ...props 
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  const baseStyles = "rounded-lg font-semibold outline-none shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 active:opacity-80";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    ghost: "rounded-md bg-transparent text-blue-600 hover:text-blue-800 shadow-none dark:hover:bg-white/5", 
    outline: "border border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800",
  };

  return (
    <Component
      {...props}
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    />
  );
}