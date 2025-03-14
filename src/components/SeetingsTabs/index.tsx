'use client'

import * as ScrollArea from '@radix-ui/react-scroll-area'
import * as Tabs from '@radix-ui/react-tabs'
import { useState } from 'react'
import { TabItem } from './TabItem'

export interface TabProps {
  value: string
  title: string
  content: React.ReactNode
}

interface SeetingsTabsProps {
  tabs: TabProps[]
}

export function SeetingsTabs({ tabs }: SeetingsTabsProps) {
  const [currentTab, setCurrentTab] = useState('my-details')

  return (
    <>
      <Tabs.Root value={currentTab} onValueChange={setCurrentTab}>
        <ScrollArea.Root className="w-full" type="hover">
          <ScrollArea.Viewport className="w-full overflow-x-scroll">
            <Tabs.List className="mt-6 flex w-full items-center gap-4 border-b  dark:border-zinc-800 border-violet-100">
              {tabs.map((tab) => (
                <TabItem
                  key={tab.value}
                  value={tab.value}
                  title={tab.title}
                  isSelected={currentTab === tab.value}
                />
              ))}
            </Tabs.List>
            {tabs.map((tab) => (
              <Tabs.Content key={tab.value} value={tab.value}>
                {tab.content}
              </Tabs.Content>
            ))}
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex h-2.5 touch-none select-none flex-col bg-zinc-100 p-0.5"
            orientation="horizontal"
          >
            <ScrollArea.Thumb className="relative flex-1 rounded-lg bg-zinc-300 before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </Tabs.Root>
    </>
  )
}
