import React from "react";
import { useDropdown } from "./DropdownMenu";

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: string; 
}

export function DropdownMenuContent({ children, align = "start" }: DropdownMenuContentProps) {
  const { isOpen } = useDropdown();
  return (
    isOpen && (
      <div className={`absolute mt-2 w-48 bg-white shadow-lg border rounded ${align === "start" ? "left-0" : "right-0"}`}>
        {children}
      </div>
    )
  );
}
