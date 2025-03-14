'use client'

import * as Tabs from '@radix-ui/react-tabs'
import { motion } from 'framer-motion'

export interface TabItemProps {
  value: string
  title: string
  isSelected?: boolean
}

export function TabItem({ value, title, isSelected }: TabItemProps) {
  return (
    <Tabs.Trigger
      value={value}
      className="group relative px-4 pt-2 pb-3 text-sm font-medium text-zinc-500 hover:text-violet-700 data-[state=active]:text-violet-700 outline-none transition-colors duration-600 ease-in-out rounded-t-mddark:text-zinc-400 dark:data-[state=active]:text-zinc-100 dark:hover:text-zinc-100"
    >
      <span className="whitespace-nowrap rounded group-focus-visible:ring-2 group-focus-visible:ring-violet-400 group-focus-visible:ring-offset-4">
        {title}
      </span>
      {isSelected && (
        <>
          <motion.div
            layoutId="activeTab"
            className="absolute w-tab -bottom-px -left-2.5 h-px rounded bg-violet-100 dark:bg-violet-400"
          />
          <motion.div
            layoutId="bgActiveTab"
            className="absolute inset-0 -z-10 bg-violet-50 mix-blend-difference rounded-t-md dark:bg-violet-500"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          >
            <div className="bg-violet-50 w-tab bottom-0 absolute -left-2.5 h-4 before:content-[''] before:z-[1] before:bg-white before:block before:w-3 before:h-full before:absolute before:bottom-0 before:-left-0.5 before:rounded-br-xl after:content-[''] after:z-[1] after:bg-white after:block after:w-3 after:h-full after:absolute after:bottom-0 after:-right-0.5 after:rounded-bl-xl dark:bg-violet-500"></div>
          </motion.div>
        </>
      )}
    </Tabs.Trigger>
  )
}
