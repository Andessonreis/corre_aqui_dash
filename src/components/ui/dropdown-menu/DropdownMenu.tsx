import React, { createContext, useContext, useState, ReactNode } from "react";

type DropdownContextType = {
  isOpen: boolean;
  toggle: () => void;
};

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export function DropdownMenu({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <DropdownContext.Provider value={{ isOpen, toggle }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

export function useDropdown() {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("useDropdown must be used within a DropdownMenu");
  return context;
}
