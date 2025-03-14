"use client";

import { motion } from "framer-motion";
import * as Tabs from "@radix-ui/react-tabs";
import clsx from "clsx";

interface TabItemProps {
  value: string;
  title: string;
  isSelected: boolean;
}

export function TabItem({ title, value, isSelected }: TabItemProps) {
  return (
    <Tabs.Trigger
      value={value}
      className={clsx(
        "group relative px-1 pb-4 text-sm font-medium leading-5 outline-none",
        "text-zinc-500 hover:text-violet-700 data-[state=active]:text-violet-700",
        "dark:text-zinc-400 dark:data-[state=active]:text-zinc-100 dark:hover:text-zinc-100"
      )}
    >
      <span className="whitespace-nowrap rounded focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-4">
        {title}
      </span>

      {isSelected && (
        <motion.div
          layoutId="activeTab"
          className="absolute -bottom-px left-0 right-0 h-0.5 bg-violet-700 dark:bg-violet-400"
        />
      )}
    </Tabs.Trigger>
  );
}
