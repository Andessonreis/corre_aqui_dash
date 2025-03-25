"use client";

import { useState, useEffect } from "react";
import { LifeBuoy, Cog, Menu, X } from "lucide-react";
import { Profile } from "./Profile";
import { Navigation } from "./Navigation";
import { NavItem } from "./Navigation/NavItem";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Button } from "../ui/Button";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    if (isDesktop) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isDesktop]);

  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      className={`
        fixed inset-0 z-20 flex flex-col gap-6 border-b bg-white/80 backdrop-blur-md
        dark:bg-zinc-900/80 lg:sticky lg:inset-y-0 lg:h-screen lg:w-72 lg:border-r
        border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-in-out
        ${isOpen ? "h-screen" : "h-20 lg:h-screen"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 lg:px-6 lg:pt-6">
        <h1 className={`text-xl font-extrabold text-cyan-300 ${!isOpen && "lg:opacity-100"}`}>
          Dashboard
        </h1>
        <Button
          variant="ghost"
          className="lg:hidden transition-transform duration-200 hover:scale-110"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-cyan-300" />
          ) : (
            <Menu className="h-6 w-6 text-cyan-300" />
          )}
        </Button>
      </div>

      {/* Collapsible Content */}
      <Collapsible.Content
        forceMount
        className="flex-1 flex flex-col overflow-y-auto px-4 lg:px-6"
      >
        {/* Navigation */}
        <Navigation />

        {/* Footer */}
        <div className="mt-auto space-y-4 pb-6">
          <nav className="flex flex-col gap-2">
            <NavItem
              icon={Cog}
              title="Configuração"
              variant="ghost"
              className="hover:bg-cyan-500/20 transition-all"
              href="/dashboard/settings"
            />
            <NavItem
              icon={LifeBuoy}
              title="Suporte"
              variant="ghost"
              className="hover:bg-cyan-500/20 transition-all"
            />
          </nav>

          {/* Separator */}
          <div className="h-px bg-cyan-400/30 mx-2" />

          {/* Profile */}
          <Profile />
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}