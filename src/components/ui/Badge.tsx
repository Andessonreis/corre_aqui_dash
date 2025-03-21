import React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  variant?: "default" | "secondary" | "outline"
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  className = "", 
  variant = "default",
  ...props 
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-primary-100 text-primary-800",
        variant === "secondary" && "bg-gray-100 text-gray-800",
        variant === "outline" && "border border-gray-200 text-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}