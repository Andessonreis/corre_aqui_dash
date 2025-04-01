import React from "react";
import { useDropdown } from "./DropdownMenu";

type DropdownMenuTriggerProps = {
  children: React.ReactNode;
  asChild?: boolean; 
};

export function DropdownMenuTrigger({ children, asChild }: DropdownMenuTriggerProps) {
  const { toggle } = useDropdown();

  if (asChild) {
    return <span onClick={toggle}>{children}</span>; 
  }

  return (
    <button onClick={toggle} className="px-4 py-2 bg-blue-600 text-white rounded">
      {children}
    </button>
  );
}
