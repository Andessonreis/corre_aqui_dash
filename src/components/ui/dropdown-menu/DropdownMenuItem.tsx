import React from "react";

type DropdownMenuItemProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export function DropdownMenuItem({ children, onClick }: DropdownMenuItemProps) {
  return (
    <div
      onClick={onClick}
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
    >
      {children}
    </div>
  );
}
