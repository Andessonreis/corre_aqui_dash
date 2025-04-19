"use client";  

import { ReactNode, useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";

// Layout do dashboard
export default function RootLayout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme('light');
  }, []);

  return (
    <>
      <div className={`min-h-screen dark:bg-zinc-900 lg:flex ${theme}`}>
        <Sidebar />
        <main className="flex-1 overflow-x-hidden pt-20 lg:pt-0">
          <div className="mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
