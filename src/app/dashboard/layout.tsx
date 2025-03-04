"use client";  

import { ReactNode, useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";

// Layout do dashboard
export default function RootLayout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme('dark');
  }, []);

  return (
    <>
      <div className={`relative min-h-screen dark:bg-zinc-900 lg:grid lg:grid-cols-app ${theme}`}>
        <Sidebar />
        <main className="max-w-screen px-4 pb-12 pt-24 lg:col-start-2 lg:w-auto lg:px-8 lg:pt-8">
          {children}
        </main>
      </div>
    </>
  );
}
