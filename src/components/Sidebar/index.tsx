"use client";

import { Navigation } from "./Navigation";
import { NavItem } from "./Navigation/NavItem";
import { SidebarHeader } from "./Navigation/header";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Profile } from "./Profile";

import * as Collapsible from "@radix-ui/react-collapsible";
import { LifeBuoy, Cog, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// InfoBox Component
function InfoBox() {
  return (
    <div className="mx-4 mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
      <h3 className="text-lg font-semibold text-red-700">Aumente seu alcance!</h3>
      <p className="text-sm text-gray-600 mt-1">Adicione novas ofertas para atrair mais clientes à sua loja.</p>
    </div>
  );
}

// Main Sidebar 
export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [notificationCount, setNotificationCount] = useState(3);
  const pathname = usePathname();
  const [activePathname, setActivePathname] = useState(pathname);

  useEffect(() => {
    setActivePathname(pathname);
  }, [pathname]);

  useEffect(() => {
    setIsOpen(isDesktop);
  }, [isDesktop]);

  const handleNavItemClick = (newPath: string) => {
    setActivePathname(newPath);
  };

  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      className={`
        fixed inset-0 z-20 h-screen flex flex-col 
        lg:relative lg:w-80 lg:min-w-80
        transition-all duration-500 ease-in-out
        bg-white border-r border-gray-200 lg:sticky lg:inset-y-0 
        ${isOpen ? "translate-x-0 shadow-2xl lg:shadow-none" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* Mobile Overlay */}
      {!isDesktop && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[-1] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Header */}
      <SidebarHeader
        isDesktop={isDesktop}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        notificationCount={notificationCount}
      />

      {/* Content without scroll */}
      <Collapsible.Content forceMount className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex flex-col flex-shrink-0">
            <InfoBox />

            <div className="mb-6">
              <h2 className="px-6 mb-2 text-sm uppercase font-medium text-gray-500 tracking-wider">
                Gerenciar Negócio
              </h2>
              <Navigation pathname={activePathname} onNavItemClick={handleNavItemClick} />
            </div>

            <div className="mx-6 border-t border-gray-200 my-4" />

            <div>
              <h2 className="px-6 mb-2 text-sm uppercase font-medium text-gray-500 tracking-wider">
                Suporte
              </h2>
              <div className="space-y-2 px-4">
                <NavItem
                  icon={Cog}
                  title="Configurações"
                  href="/dashboard/settings"
                  active={activePathname === "/dashboard/settings"}
                  onClick={() => handleNavItemClick("/dashboard/settings")}
                  className={activePathname === "/dashboard/settings" ? "bg-gray-100 text-red-500" : "text-gray-600"}
                />
                <NavItem
                  icon={LifeBuoy}
                  title="Central de Ajuda"
                  href="/dashboard/support"
                  active={activePathname === "/dashboard/support"}
                  onClick={() => handleNavItemClick("/dashboard/support")}
                  className={activePathname === "/dashboard/support" ? "bg-gray-100 text-red-500" : "text-gray-600"}
                />
              </div>
            </div>
          </div>

          {/* Profile */}
          <div className="mt-auto border-t border-gray-200 pt-4">
            <Profile />
          </div>
        </div>
      </Collapsible.Content>

      {/* Botão para abrir sidebar no mobile */}
      {!isDesktop && !isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          onClick={() => setIsOpen(true)}
          className="fixed z-20 bottom-6 left-6 h-14 w-14 rounded-full bg-red-500 shadow-lg flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <Menu className="h-6 w-6 text-white" />
        </motion.button>
      )}
    </Collapsible.Root>
  );
}
