"use client";
import { Search, LifeBuoy, Cog, Menu } from "lucide-react";
import * as Input from "../Form/Input";
import { Profile } from "./Profile";
import { Navigation } from "./Navigation";
import { NavItem } from "./Navigation/NavItem";
import * as Collapsible from "@radix-ui/react-collapsible";
import { Button } from "../Button";

export function Sidebar() {
  return (
    <Collapsible.Root
      className="
        fixed inset-x-0 top-0 z-20 flex-col gap-6 border-b bg-white/95 backdrop-blur-sm
        dark:bg-zinc-900/95 lg:sticky lg:inset-y-0 lg:h-screen lg:w-72 lg:border-r lg:border-b-0
        border-zinc-200 dark:border-zinc-800 lg:backdrop-blur-none
        data-[state=open]:h-screen h-20
      "
    >
      {/* Header com logo e botão de menu */}
      <div className="flex h-20 items-center justify-between p-4 lg:px-6 lg:pt-8">
        {/* ADD logo correta aqui */}
        <div className="flex-1"></div> {/* Espaço para logo */}
        <Collapsible.Trigger asChild className="lg:hidden">
          <Button variant="ghost" className="rounded-full">
            <Menu className="h-6 w-6 text-zinc-500 dark:text-zinc-400 transition-all hover:scale-110 hover:text-zinc-700 dark:hover:text-zinc-300" />
          </Button>
        </Collapsible.Trigger>
      </div>

      {/* Conteúdo da Sidebar */}
      <Collapsible.Content
        asChild
        forceMount
        className="
          data-[state=closed]:hidden data-[state=closed]:animate-slideUpAndFade
          data-[state=open]:animate-slideDownAndFade lg:data-[state=closed]:flex
          h-[calc(100vh-5rem)] lg:h-[calc(100vh-5rem)] flex flex-col
          overflow-y-auto
        "
      >
        <div className="flex flex-1 flex-col gap-6 px-2 lg:px-4">
          {/* Barra de pesquisa */}
          <Input.Root className="mx-1 w-auto hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <Input.Prefix>
              <Search className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            </Input.Prefix>
            <Input.Control
              type="text"
              placeholder="Search"
              className="placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            />
          </Input.Root>

          <Navigation />

          {/* Seção inferior fixa */}
          <div className="mt-auto flex flex-col gap-6 pb-6 lg:pb-8">
            <nav className="flex flex-col gap-2">
              <NavItem
                icon={Cog}
                title="Configuração"
                variant="ghost"
                className="hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
              />
              <NavItem
                icon={LifeBuoy}
                title="Suporte"
                variant="ghost"
                className="hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
              />
            </nav>
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 mx-2" />
            <Profile />
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}